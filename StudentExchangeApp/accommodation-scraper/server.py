import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

app = Flask(__name__)
CORS(app)

# Scraping Logic
def scrape_houses(country, city, university):
    print("🚀 Starting scrape_houses")
    
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--window-size=1920x1080")

    try:
       service = Service(ChromeDriverManager().install())
       driver = webdriver.Chrome(service=service, options=options)

    except Exception as e:
        print(f"❌ Failed to start ChromeDriver: {e}")
        raise

    if university:
        url = f"https://www.student.com/{country.lower()}/{city.lower()}/u/{university.lower().replace(' ', '-')}"
    else:
        url = f"https://www.student.com/{country.lower()}/{city.lower()}"

    print(f"🔗 Visiting: {url}")
    try:
        driver.get(url)
    except Exception as e:
        print(f"❌ Failed to load page: {e}")
        driver.quit()
        raise

    time.sleep(5)

    houses = []
    try:
        properties = driver.find_elements(By.XPATH, "//a[contains(@aria-label, 'Go to')]")
        print(f"🏠 Found {len(properties)} properties")
    except Exception as e:
        print(f"❌ Error finding properties: {e}")
        driver.quit()
        raise

    for prop in properties:
        try:
            name = prop.get_attribute("aria-label").replace("Go to ", "").replace(" page", "").strip()
            link = prop.get_attribute("href")
            parent = prop.find_element(By.XPATH, "..")

            try:
                image = parent.find_element(By.TAG_NAME, "img").get_attribute("src")
            except:
                image = "https://via.placeholder.com/150"

            try:
                location = parent.find_element(By.XPATH, ".//p[contains(@class, 'text-gray-500')]").text.strip()
            except:
                location = "N/A"

            houses.append({
                "id": link.split("/")[-1],
                "name": name,
                "location": location,
                "imageUrl": image,
                "link": link
            })
        except Exception as inner:
            print(f"⚠️ Skipping property due to error: {inner}")
            continue

    driver.quit()
    print(f"✅ Scraping complete. Total houses: {len(houses)}")
    return houses


@app.route("/scrape", methods=["GET"])
def scrape():
    country = request.args.get("country", "").strip()
    city = request.args.get("city", "").strip()
    university = request.args.get("university", "").strip()

    print(f"📥 Incoming request: country={country}, city={city}, university={university}")

    if not country or not city:
        print("❌ Missing required parameters.")
        return jsonify({"error": "Country and city are required"}), 400

    try:
        results = scrape_houses(country, city, university)
        return jsonify({"houses": results})
    except Exception as e:
        print(f"❌ Scraping failed: {e}")
        return jsonify({"error": "Something went wrong during scraping."}), 500


@app.route("/health")
def health():
    return "OK", 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port, debug=True)
