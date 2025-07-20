// firebase/firebase.js

// Firebase CDN (v10.12.2 is Modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCc38FFnM7Xc7xFOoffrnEsQ3DJexchl8s",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "daily-task-manager-24d82.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "daily-task-manager-24d82",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "daily-task-manager-24d82.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "399990159546",
  appId: process.env.FIREBASE_APP_ID || "1:399990159546:web:918bc96a0c138279906a83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, {
      displayName: displayName
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Firestore functions
const addTask = async (taskData) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      ...taskData,
      createdAt: new Date(),
      userId: auth.currentUser.uid
    });
    return docRef;
  } catch (error) {
    throw error;
  }
};

const getTasks = async () => {
  try {
    const q = query(collection(db, "tasks"), where("userId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    return tasks;
  } catch (error) {
    throw error;
  }
};

const updateTask = async (taskId, updates) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    throw error;
  }
};

const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
  } catch (error) {
    throw error;
  }
};

// export for reuse
export {
  auth,
  db,
  registerUser,
  loginUser,
  logoutUser,
  addTask,
  getTasks,
  updateTask,
  deleteTask
};