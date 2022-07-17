// Import the functions you need from the SDKs you need
import { writable } from 'svelte/store';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {  
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail, 
  signInWithEmailAndPassword,  
  signInWithPopup,
  signOut
    } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  where,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCV7zgPScT6r-rBune4zRSH-Pz4NiqBDOE",
    authDomain: "timeline-ab491.firebaseapp.com",
    projectId: "timeline-ab491",
    storageBucket: "timeline-ab491.appspot.com",
    messagingSenderId: "596534329020",
    appId: "1:596534329020:web:0b45242781db02e9ba5ab9",
    measurementId: "G-Z11LQES7XE"
  };

// Initialize Firebase

  const app = initializeApp(firebaseConfig)
  // const analytics = getAnalytics(app)
  // const auth = getAuth(app)
  let db = getFirestore(app)
  // const userDoc = (userId) => doc(db, "users", userId)

  let userTimelinesUnsubscribe = ()=>{}

  const user = writable({uid:0})

  function authStateObserver(u){
    userTimelinesUnsubscribe()
    list.set([])
    user.set(u)
    userTimelinesUnsubscribe = loadUserTimelines(u)
  }

  onAuthStateChanged(getAuth(), authStateObserver)


let signIn={}

signIn.google = async()=> {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

signIn.newUser = async (email,password)=>{
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user)
      // ...
    })
    .catch((error) => {
      console.log(error)
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}

signIn.email = async(email,password)=>{
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}

signIn.forgotPasswordEmail = async(email)=>{
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
  .then(() => {
    // Password reset email sent!
    // ..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  })
}

function signUserOut() {
  // Sign out of Firebase.
  signOut(getAuth());
}

async function saveTimeline(name,user,documents,trash,style){
  // Add a new message entry to the Firebase database.
  try {
    await addDoc(collection(getFirestore(), 'timelines'), {
      user: user.uid,
      name,
      documents,
      trash,
      style,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  catch(error) {
    console.error('Error writing new message to Firebase Database', error);
  }
}

async function updateTimeline(old,documents,trash,style){
  let tl = {...old.data,documents,trash,style}

  await setDoc(doc(db,'timelines',old.id),{...tl,updatedAt: serverTimestamp()})
  return old.id
}

async function deleteTimeline(id){
  await deleteDoc(doc(db, "timelines",id))
  return "done"
}


const list = writable([])

function loadUserTimelines(usr) {
  if (usr){
   const usersTimelinesQuery = query(collection(getFirestore(), 'timelines'), where("user","==",usr.uid), orderBy('createdAt', 'desc'));
    //  const recentMessagesQuery = query(collection(getFirestore(), 'timelines'));
    // Start listening to the query.
    return onSnapshot(usersTimelinesQuery, function(snapshot) {
      // console.log(snapshot.docs.map(x=>({data:x.data(),id:x.id})))
      // @ts-ignore
      list.set(snapshot.docs.map(x=>({data:x.data(),id:x.id})))
    });
  }
  return ()=>{}
}

userTimelinesUnsubscribe = loadUserTimelines()

let onePublicTimeline = (id)=>{
  const ref = doc(db, 'timelines',id);
  const oneTimeline = writable({})
  onSnapshot(ref,(doc)=>{
    oneTimeline.set({data:doc.data(),id:doc.id})
    })
  return oneTimeline  
}

export {app,signIn,signUserOut,user,saveTimeline,list, onePublicTimeline, updateTimeline,deleteTimeline}
