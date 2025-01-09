import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAHyJEpAYUVzHjwCHzvOmh-Zn7zGNF6xJc",
  authDomain: "svce-bicycle-registery.firebaseapp.com",
  databaseURL: "https://svce-bicycle-registery-default-rtdb.firebaseio.com",
  projectId: "svce-bicycle-registery",
  storageBucket: "svce-bicycle-registery.firebasestorage.app",
  messagingSenderId: "92423508156",
  appId: "1:92423508156:web:40fda6360c86387e5e00b9",
  measurementId: "G-942XF1C7S6"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);