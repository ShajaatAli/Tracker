import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCS_7twiiA55n3MsPXaxX_NdbXaUFuLXoQ",
  authDomain: "tracker-7bfd8.firebaseapp.com",
  projectId: "tracker-7bfd8",
  storageBucket: "tracker-7bfd8.appspot.com",
  messagingSenderId: "533611385690",
  appId: "1:533611385690:web:55f911f640736b4bf79963",
  measurementId: "G-RVJGGVG1NL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };

