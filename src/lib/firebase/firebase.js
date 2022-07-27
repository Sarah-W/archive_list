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
  documentId,
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

  /**
 * @param {any | undefined} u
 */
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

signIn.newUser = async (/** @type {string} */ email,/** @type {string} */ password)=>{
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

signIn.email = async(/** @type {string} */ email,/** @type {string} */ password)=>{
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

signIn.forgotPasswordEmail = async(/** @type {string} */ email)=>{
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

/**
 * @param {string} name
 * @param {{ uid: string; }} user
 * @param {unknown[]} documents
 * @param {any[]} trash
 * @param {{}} style
 * @param {boolean} published
 */
async function saveTimeline(name,user,documents,trash,style,published){
  // Add a new message entry to the Firebase database.
  try {
   let doc= await addDoc(collection(getFirestore(), 'timelines'), {
      user: user.uid,
      name,
      documents,
      trash,
      style,
      published,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return doc.id
  }
  catch(error) {
    console.error('Error writing new message to Firebase Database', error);
  }
}

/**
 * @param {{ data: any; id: string; }} old
 * @param {unknown[]} documents
 * @param {any[]} trash
 * @param {{}} style
 * @param {boolean} published
 */
async function updateTimeline(old,documents,trash,style,published){
  let tl = {...old.data,documents,trash,style,published}

  await setDoc(doc(db,'timelines',old.id),{...tl,updatedAt: serverTimestamp()})
  return old.id
}

/**
 * @param {string} id
 */
async function deleteTimeline(id){
  await deleteDoc(doc(db, "timelines",id))
  return "done"
}


const list = writable([])

/**
 * @param {{ uid: string; } | undefined} [usr]
 */
function loadUserTimelines(usr) {
  if (usr){
   const usersTimelinesQuery = query(collection(getFirestore(), 'timelines'), where("user","==",usr.uid), orderBy('createdAt', 'desc'));
    // Start listening to the query.
    return onSnapshot(usersTimelinesQuery, function(snapshot) {
      // @ts-ignore
      list.set(snapshot.docs.map(x=>({data:x.data(),id:x.id})))
    });
  }
  return ()=>{}
}

userTimelinesUnsubscribe = loadUserTimelines()

let onePublicTimeline = (/** @type {string} */ id)=>{
  const q = query(collection(getFirestore(), 'timelines'), where("published","==",true),where(documentId(),'==',id))
  const oneTimeline = writable({})
  onSnapshot(q,(resp)=>{    
    const doc = resp.docs[0]
    oneTimeline.set({data:doc.data(),id:doc.id})
    })
  return oneTimeline  
}

export {app,signIn,signUserOut,user,saveTimeline,list, onePublicTimeline, updateTimeline,deleteTimeline}
