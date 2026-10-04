import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, remove } from "firebase/database";

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

async function clean() {
  const usersRef = ref(database, 'Users');
  const snap = await get(usersRef);
  if (snap.exists()) {
    const users = snap.val();
    for (const userId of Object.keys(users)) {
      console.log(`Cleaning user: ${userId}`);
      await remove(ref(database, `Users/${userId}/LastSeen`));
      await remove(ref(database, `Users/${userId}/Last_online`));
    }
    console.log("Cleanup complete!");
  } else {
    console.log("No users found.");
  }
  process.exit(0);
}

clean();
