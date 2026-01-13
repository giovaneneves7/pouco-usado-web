importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);
// // Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
  apiKey: "AIzaSyAUj3GnZhNtHzVaqPEr8DKGoFjrhETYQBA",
  authDomain: "pouco-usado-25582.firebaseapp.com",
  projectId: "pouco-usado-25582",
  storageBucket: "pouco-usado-25582.firebasestorage.app",
  messagingSenderId: "253558742134",
  appId: "1:253558742134:web:bd74b949b9b083a8e31357",
  measurementId: "G-R7REJL44TR"

};


firebase?.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

self.addEventListener("install", function (event) {
  console.log("Hello world from the Service Worker :call_me_hand:");
});
