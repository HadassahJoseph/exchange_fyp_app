# from flask import Flask, request, jsonify
# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.options import Options
# import time

# app = Flask(__name__)

# # Web Scraping Function
# def scrape_houses(location):
#     CHROME_DRIVER_PATH = "chromedriver.exe"

#     options = Options()
#     options.add_argument("--headless")
#     options.add_argument("--disable-gpu")
#     options.add_argument("--window-size=1920x1080")

#     service = Service(CHROME_DRIVER_PATH)
#     driver = webdriver.Chrome(service=service, options=options)

#     url = f"https://www.student.com/uk/{location.lower()}"  # Adjust for correct URL format
#     driver.get(url)
#     time.sleep(5)

#     houses = []
#     properties = driver.find_elements(By.XPATH, "//a[contains(@aria-label, 'Go to')]")

#     for prop in properties:
#         try:
#             name = prop.get_attribute("aria-label").replace("Go to ", "").replace(" page", "").strip()
#             link = prop.get_attribute("href")
#             parent = prop.find_element(By.XPATH, "..")

#             try:
#                 image = parent.find_element(By.TAG_NAME, "img").get_attribute("src")
#             except:
#                 image = "No Image"

#             try:
#                 location = parent.find_element(By.XPATH, ".//p[contains(@class, 'text-gray-500')]").text.strip()
#             except:
#                 location = "N/A"

#             houses.append({
#                 "id": link.split("/")[-1],
#                 "name": name,
#                 "location": location,
#                 "imageUrl": image,
#                 "link": link
#             })

#         except:
#             continue

#     driver.quit()
#     return houses

# # API Endpoint
# @app.route("/scrape", methods=["GET"])
# def scrape():
#     location = request.args.get("location", "").strip()
#     if not location:
#         return jsonify({"error": "Location is required"}), 400

#     results = scrape_houses(location)
#     return jsonify({"houses": results})

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def scrape_houses(country, city, university):
    CHROME_DRIVER_PATH = "chromedriver.exe"  

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920x1080")

    service = Service(CHROME_DRIVER_PATH)
    driver = webdriver.Chrome(service=service, options=options)

    # Construct the correct search URL
    if university:
        url = f"https://www.student.com/{country.lower()}/{city.lower()}/u/{university.lower().replace(' ', '-')}"
    else:
        url = f"https://www.student.com/{country.lower()}/{city.lower()}"

        print(f"🕵️‍♂️ Scraping URL: {url}")


    driver.get(url)
    time.sleep(5)

    houses = []
    # properties = driver.find_elements(By.XPATH, "//a[contains(@aria-label, 'Go to')]")

    print("🔍 Looking for property elements...")
    properties = driver.find_elements(By.XPATH, "//a[contains(@aria-label, 'Go to')]")
    print(f"📊 Found {len(properties)} properties")


    for prop in properties:
        try:
            name = prop.get_attribute("aria-label").replace("Go to ", "").replace(" page", "").strip()
            link = prop.get_attribute("href")
            parent = prop.find_element(By.XPATH, "..")

            try:
                image = parent.find_element(By.TAG_NAME, "img").get_attribute("src")
            except:
                image = "No Image"

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

        except:
            continue

    driver.quit()
    return houses

@app.route("/scrape", methods=["GET"])
def scrape():
    country = request.args.get("country", "").strip()
    city = request.args.get("city", "").strip()
    university = request.args.get("university", "").strip()

    print(f"🔥 Received request: Country={country}, City={city}, University={university}")  # Debugging log

    if not country or not city:
        print("❌ Missing parameters")
        return jsonify({"error": "Country and city are required"}), 400

    results = scrape_houses(country, city, university)
    print(f"📊 Scraped Listings: {results}")  # Debugging log

    return jsonify({"houses": results})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
