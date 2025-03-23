
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAOnsn_LihHLKxPduPZfa-ZngaCHv9fqiw",
  authDomain: "studyexchangev2.firebaseapp.com",
  projectId: "studyexchangev2",
  storageBucket: "studyexchangev2.firebasestorage.app",
  messagingSenderId: "172911204441",
  appId: "1:172911204441:web:b0c62781b9026bdc667948",
  measurementId: "G-0PGZ586BSV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
