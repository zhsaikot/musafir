/**
 * MUSAFIR - Islamic Lifestyle E-commerce
 * Official Firebase Configuration & Initialization
 */

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBlxy_QxmyXG2395xU4U4EFqsGXagGeFFE",
  authDomain: "musafir-a3772.firebaseapp.com",
  projectId: "musafir-a3772",
  storageBucket: "musafir-a3772.firebasestorage.app",
  messagingSenderId: "293217528966",
  appId: "1:293217528966:web:77023dba805a6548023507",
  measurementId: "G-DH98YTEJC6"
};

// Live Firebase Connection Enabled (Authentication & Analytics)
window.IS_FIREBASE_ENABLED = true;

// Firestore Database Provisioning Status
// Set to true once Firestore database is enabled in Firebase Console & synced from Admin Panel
window.IS_FIRESTORE_PROVISIONED = localStorage.getItem('musafir_firestore_active') === 'true';

// WhatsApp Order Configuration & Business Info
window.STORE_CONFIG = {
  brandName: "MUSAFIR",
  descriptor: "Islamic Lifestyle",
  whatsappNumber: "8801577696391", // International format without '+' or spaces
  displayPhone: "+880 1577-696391",
  whatsappHandle: "@musafirlifestyle",
  email: "support@musafirlifestyle.com",
  facebookUrl: "https://www.facebook.com/profile.php?id=61564925019564",
  instagramUrl: "https://www.instagram.com/musafirlifestyle",
  youtubeUrl: "https://youtube.com/@musafirlifestyle",
  tiktokUrl: "https://tiktok.com/@musafirlifestyle",
  address: "House 12, Road 5, Dhanmondi, Dhaka, Bangladesh",
  deliveryInsideDhaka: 70,
  deliveryOutsideDhaka: 130,
  freeDeliveryThreshold: 2500
};

// Automatic Firebase App & Services Initialization
(function initFirebaseServices() {
  if (typeof firebase !== 'undefined') {
    try {
      if (!firebase.apps || !firebase.apps.length) {
        window.firebaseApp = firebase.initializeApp(window.FIREBASE_CONFIG);
      } else {
        window.firebaseApp = firebase.app();
      }

      // Authentication
      if (typeof firebase.auth === 'function') {
        window.firebaseAuth = firebase.auth();
      }

      // Cloud Firestore
      if (typeof firebase.firestore === 'function') {
        window.firebaseFirestore = firebase.firestore();
      }

      // Analytics
      if (typeof firebase.analytics === 'function') {
        try {
          window.firebaseAnalytics = firebase.analytics();
        } catch (e) {
          // Analytics can be disabled in some local/file testing environments
        }
      }

      console.log("MUSAFIR: Firebase initialized successfully with Project ID: musafir-a3772");
    } catch (e) {
      console.warn("MUSAFIR: Firebase initialization warning:", e);
    }
  } else {
    console.info("MUSAFIR: Running in Offline / LocalStorage fallback mode (Firebase SDK not detected).");
  }
})();
