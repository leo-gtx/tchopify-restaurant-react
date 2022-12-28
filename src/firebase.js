import firebase from 'firebase/app';
import 'firebase/firestore'; 
import 'firebase/storage';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/messaging';
import { firebaseConfig } from './config';

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

if (window.location.hostname !== 'localhost'){
  firebase.analytics()
}


const auth = firebase.auth()
// if (window.location.hostname === 'localhost'){
//   auth.useEmulator('http://localhost:9099')
// }


const firestore = firebase.firestore()
if(window.location.hostname === 'localhost'){
  firestore.useEmulator('localhost', 8081)
}
firestore.settings({
  cacheSizeBytes: 1000 * 1000 * 15,
  merge: true,
})
firestore.enablePersistence().catch((err)=>console.error(err))

const storage = firebase.storage()
if(window.location.hostname === 'localhost'){
  storage.useEmulator('localhost', 9199)
}

const functions = firebase.functions()
if(window.location.hostname === 'localhost'){
  functions.useEmulator('localhost', 5001)
}

let messaging = null;
if(firebase.messaging.isSupported()){
  messaging = firebase.messaging()
}

export const getToken = (callback)=>messaging
.getToken({vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY})
.then((currentToken)=>{
    if(currentToken){
        callback(currentToken)
    }else{
        callback(null)
    }
})

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
});

export default firebase