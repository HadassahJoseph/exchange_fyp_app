const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({region: "us-central1"});

const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");

const createHtmlEmail = (username, pin) => `
  <div style="font-family: Arial, sans-serif; background-color: #1e1e1e; color: #ffffff; padding: 30px;">
    <div style="max-width: 500px; margin: auto; background-color: #2a2a2a; padding: 20px; border-radius: 8px;">
      <h2 style="color: #A8E9DC;">Hi ${username} 👋</h2>
      <p>Thanks for signing up for the Study Exchange App.</p>
      <p>Your verification PIN is:</p>
      <div style="background-color: #A8E9DC; color: #1e1e1e;
      font-size: 32px; font-weight: bold; padding: 12px;
       text-align: center; border-radius: 6px; margin: 20px 0;">
        ${pin}
      </div>
      <p>This code will expire in 10 minutes.</p>
    </div>
  </div>
`;

exports.sendVerificationPin = onCall({
  secrets: [SENDGRID_API_KEY],
  allowUnauthenticated: true,
}, async (data, context) => {
  const {email, userId, username} = data.data;

  if (!email || !userId || !username) {
    throw new HttpsError("invalid-argument", "Missing required parameters.");
  }

  const pin = Math.floor(100000 + Math.random() * 900000).toString();

  await db.collection("verificationCodes").doc(userId).set({
    pin,
    email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  try {
    const apiKey = SENDGRID_API_KEY.value();
    sgMail.setApiKey(apiKey);
    console.log(" SendGrid API key set.");

    const msg = {
      to: email,
      from: "studyexchange.verify@gmail.com", // Must be verified in SendGrid
      subject: "Your Study Exchange Verification Code",
      html: createHtmlEmail(username, pin),
    };

    console.log(" About to send email with:", msg);

    await sgMail.send(msg);

    console.log("Email sent successfully.");
    return {success: true};
  } catch (error) {
    console.error(
        " SendGrid Error:",
        (error.response && error.response.body) || error.message || error,
    );
    throw new HttpsError("internal", "Failed to send email");
  }
});
