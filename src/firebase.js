import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAZtt7XLYL62-VKkFOfVkqqoPf2kYIW9oU",
  authDomain: "test-1358d.firebaseapp.com",
  databaseURL: "https://test-1358d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-1358d",
  storageBucket: "test-1358d.firebasestorage.app",
  messagingSenderId: "965627123968",
  appId: "1:965627123968:web:5fe553029b5f7508367be5",
  measurementId: "G-5SBCL77GY2"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
