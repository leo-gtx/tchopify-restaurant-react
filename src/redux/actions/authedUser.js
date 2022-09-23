import {v4 as uuidv4} from 'uuid';
import firebase from '../../firebase';
import { formattedAddress, generateOTP, RequestTimeout } from '../../utils/utils';
import { USER } from '../../utils/entities';
import { PATH_DASHBOARD } from '../../routes/paths';
import { withdraw } from '../../utils/api';
import { handleEraseData } from './shared';

export const SET_AUTHED_USER = 'SET_AUTHED_USER';
export const REMOVE_AUTHED_USER = 'REMOVE_AUTHED_USER';
export const UPDATE_AUTHED_USER = 'UPDATE_AUTHED_USER';
export const ADD_ADDRESS = 'ADD_ADDRESS';
export const DELETE_ADDRESS = 'DELETE_ADDRESS';

export function addAddress(address){
  return {
    type: ADD_ADDRESS,
    payload: address,
  }
}

export function deleteAddress(addressId){
  return {
    type: DELETE_ADDRESS,
    payload: addressId,
  }
}

function setAuthedUser(user){
    return{
        type: SET_AUTHED_USER,
        payload: user,
    }
}

function removeAuthedUser(){
  return{
    type: REMOVE_AUTHED_USER,
  }
}

export function updateAuthedUser(user){
  return {
    type: UPDATE_AUTHED_USER,
    payload: user
  }
}

export function handleGetAuthedUser(userId, callback){
    return (dispatch)=> firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .get()
        .then((doc)=>{
            if(doc.exists){
                const data = {
                    ...doc.data(),
                    isAuthenticated: true
                }
                dispatch(setAuthedUser(data))
                callback(data)
            }else{
                dispatch(setAuthedUser({ isAuthenticated: false}))
                callback({isAuthenticated: false})
            }

        })
        .catch((error)=>{
            console.error(error)
        })
    
}

export function login(email, password){
    return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
} 

export function register({email, password, fullname, country, phoneNumber, role}, onSuccess, onError){
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        firebase
          .firestore()
          .collection('users')
          .doc(res.user.uid)
          .set({
            ...USER,
            id: res.user.uid,
            email,
            fullname,
            country,
            phoneNumber,
            emailVerified: res.user.emailVerified,
            role,
            createdAt: Date.now()
          })
          .then(()=>{
            if(!res.user.emailVerified) res.user.sendEmailVerification({
              url: `${process.env.REACT_APP_HOST}${PATH_DASHBOARD.root}`
            });
            onSuccess()
          })
        
      }) 
      .catch((err)=>onError(err))

}
    
  export function logout(){
    return (dispatch)=> firebase
    .auth()
    .signOut()
    .then(()=>{
      dispatch(removeAuthedUser())
      dispatch(handleEraseData())
    })
    .catch((err)=>console.error(err))
  };

  /*  export async function resetPassword(email){
   return firebase.auth().sendPasswordResetEmail(email);
  }; */

  export function loginWithGoogle(onError){
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider)
    .then((user)=>{
      const taskUser = firebase.firestore().collection('users')
      taskUser
          .doc(user.user.uid)
          .get()
          .then((res)=>{
            if(!res.exists){
              taskUser
              .doc(user.user.uid)
              .set({
                id: user.user.uid,
                email: user.user.email,
                fullname: user.user.displayName
              });
            }else{
              taskUser
              .doc(user.user.uid)
              .update({
                email: user.user.email,
                emailVerified: true
              })
            }
          })
          .catch((err)=>console.error(err))
         
    })
    .catch((err)=>{
      console.error(err)
      onError(err.message)
    })
  };

  export function loginWithFaceBook(onError){
    const provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(provider)
    .then((user)=>{
      const taskUser = firebase.firestore().collection('users')
      taskUser
          .doc(user.user.uid)
          .get()
          .then((res)=>{
            if(!res.exists){
              taskUser
              .doc(user.user.uid)
              .set({
                id: user.user.uid,
                email: user.user.email,
                fullname: user.user.displayName
              });
            }else{
              taskUser
              .doc(user.user.uid)
              .update({
                email: user.user.email,
                emailVerified: true
              })
            }
          })
          .catch((err)=>console.error(err))
         
    })
    .catch((err)=>{
      console.error(err)
      onError(err.message)
    })
  };

  export function handleUpdateProfile({fullname, phoneNumber, image,  country, city, userId, oldAvatar}, callback, onError){
    return (dispatch) =>{
    // If there is no image
    if(image==null){
      const data = {
        fullname,
        phoneNumber,
        country,
        city
      }
     return firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .update(data)
      .then(()=>{
          dispatch(updateAuthedUser(data))
          callback()
      })
      .catch((err)=>{
        console.error(err)
        onError(err)
      })
    }
    
    // If there is an image
    const filename = `${Date.now()}.jpeg`
    const uploadTask = firebase.storage()
    .ref(`images/avatars/${filename}`,{
      contentType: 'image/jpeg',
    })
    .put(image)
    return uploadTask
    .on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log(`Upload is ${progress} done`);
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
        default:
          break;
      }
    },(e)=>{
       onError(e)
      switch (e.code) {
        case 'storage/unauthorize':
          console.error('Unauthorize')
          break;
        case 'storage/unknown':
          console.error(e.serverResponse)
          break;
        default:
          break;
      }
    }, () => {
      // Delete Old Image
      if(oldAvatar){
        // Create a reference to the file to delete
      const imageRef = firebase.storage().ref(`images/avatars/${oldAvatar}`);

      // Delete the file
      imageRef.delete().then(() => {
        console.log("Old image Deleted Successfully")
      }).catch((error) => {
        console.error(error)
        onError(error)
      });
      }
      
      // Record new data
        uploadTask.snapshot.ref.getDownloadURL().then( downloadedURL => {
            const data = {
              fullname,
              phoneNumber,
              country,
              city,
              avatar: downloadedURL,
              filename
            }
           firebase
            .firestore()
            .collection('users')
            .doc(userId)
            .update(data)
            .then(()=>{
                dispatch(updateAuthedUser(data))
                callback()
            })
            .catch((err)=>{
              console.error(err)
              onError(err)
            })
         })
       
       
    })   
    
    }
}

export function handleUpdateProfileCustomer({fullname, phoneNumber, image, userId, oldAvatar}, callback, onError){
  return (dispatch) =>{
  // If there is no image
  if(image==null){
    const data = {
      fullname,
      phoneNumber,
    }
   return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .update(data)
    .then(()=>{
        dispatch(updateAuthedUser(data))
        callback()
    })
    .catch((err)=>{
      console.error(err)
      onError(err)
    })
  }
  
  // If there is an image
  const filename = `${Date.now()}.jpeg`
  const uploadTask = firebase.storage()
  .ref(`images/avatars/${filename}`,{
    contentType: 'image/jpeg',
  })
  .put(image)
  return uploadTask
  .on("state_changed", (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    console.log(`Upload is ${progress} done`);
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
      default:
        break;
    }
  },(e)=>{
     onError(e)
    switch (e.code) {
      case 'storage/unauthorize':
        console.error('Unauthorize')
        break;
      case 'storage/unknown':
        console.error(e.serverResponse)
        break;
      default:
        break;
    }
  }, () => {
    // Delete Old Image
    if(oldAvatar){
      // Create a reference to the file to delete
    const imageRef = firebase.storage().ref(`images/avatars/${oldAvatar}`);

    // Delete the file
    imageRef.delete().catch((error) => {
      console.error(error)
      onError(error)
    });
    }
    
    // Record new data
      uploadTask.snapshot.ref.getDownloadURL().then( downloadedURL => {
          const data = {
            fullname,
            phoneNumber,
            avatar: downloadedURL,
            filename
          }
         firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .update(data)
          .then(()=>{
              dispatch(updateAuthedUser(data))
              callback()
          })
          .catch((err)=>{
            console.error(err)
            onError(err)
          })
       })
     
     
  })   
  
  }
}

export function handleChangePassword({newPassword}, callback){
  return firebase
  .auth()
  .currentUser
  .updatePassword(newPassword)
  .then(()=>{
    callback()
  })
  .catch((err)=>console.log(err))
}

export function handleAddSocialsLinks({userId, facebookLink, instagramLink, twitterLink, linkedinLink}, callback){
  const data = {
    socials: {
      facebookLink,
      twitterLink,
      instagramLink,
      linkedinLink
    }
  }
  return (dispatch) => firebase
  .firestore()
  .collection('users')
  .doc(userId)
  .update(data)
  .then(()=>{
    dispatch(updateAuthedUser(data))
    callback()
  })
  .catch((err)=>console.log(err))
}

export function handleSendVerificationEmail(callback){
  const actionCodeSettings = {
    url: `${process.env.REACT_APP_HOST}${PATH_DASHBOARD.root}`,
    /* iOS: {
      bundleId: 'com.example.ios'
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12'
    },
    handleCodeInApp: true,
    // When multiple custom dynamic link domains are defined, specify which
    
    // one to use.
    dynamicLinkDomain: "tchopify.web.app.page.link"
    */
  };
  return firebase
  .auth()
  .currentUser
  .sendEmailVerification(actionCodeSettings)
  .then(callback)
  .catch((err)=>console.error(err))

}

export function handleUpdateBusinessHours({userId, businessHours}, callback, onError){
  return (dispatch) => firebase
  .firestore()
  .collection('users')
  .doc(userId)
  .update({businessHours})
  .then(()=>{
      dispatch(updateAuthedUser({businessHours}))
      callback()
  })
  .catch((err)=>{
    console.error(err)
    onError(err)
  })

}

export function handleAddAddress({userId, receiver, fullAddress, addressType }, callback, onError){
const id = uuidv4()
const data = {
  id,
  receiver,
  fullAddress,
  addressType,
  userId,
};
return (dispatch) =>  firebase
  .firestore()
  .collection('addresses')
  .doc(id)
  .set(data)
  .then(()=>{
    dispatch(addAddress(data))
    callback()
  })
  .catch((err)=>{
    onError(err)
    console.error(err)
  })
}

export function handleDeleteAddress(addressId){
  return (dispatch) =>  firebase
    .firestore()
    .collection('addresses')
    .doc(addressId)
    .delete()
    .then(()=>{
      dispatch(deleteAddress(addressId))
    })
    .catch((err)=>{
      console.error(err)
    })
  }

  export function handleGetAddress(userId){
    return (dispatch) => firebase
    .firestore()
    .collection('addresses')
    .where('userId', '==', userId)
    .get()
    .then((documentSnapshot)=>{
      if(!documentSnapshot.empty) dispatch(updateAuthedUser({addresses : formattedAddress(documentSnapshot.docs)}))
    })
  }

export function handleGetUser({id, phoneNumber, role}, callback){
  const data = {
    id,
    phoneNumber,
    role
  }
  return (dispatch) => firebase
  .firestore()
  .collection('users')
  .doc(id)
  .get()
  .then((documentSnapshot)=> {
    if(!documentSnapshot.exists){
      firebase
      .firestore()
      .collection('users')
      .doc(id)
      .set(data)
      .then(()=>{
        dispatch(setAuthedUser(data))
      })
    }else{
      dispatch(setAuthedUser(documentSnapshot.data()))
    }
    callback()
  })
}

export function handleWithdrawMoney({code, amount, wallet, service, userId}, callback, onError){
  const currentDate = new Date().getTime()
  // check otp
    return (dispatch)=>firebase
    .firestore()
    .collection('otp')
    .where('id', '==', userId)
    .where('code', '==', code)
    .where('isUsed', '==', false)
    .where('expiredAt', '>=', currentDate)
    .get()
    .then((snapDoc)=>{
      console.log(snapDoc.empty)
      if(!snapDoc.empty){
        // check balance
        firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .get()
        .then((snapDoc)=>{
          if(snapDoc.exists){
            const {balance, rate, rewards} = snapDoc.data();
            const commission = rewards - ( amount * rate);
            const currentRewards = rewards - (amount * rate);
            const totalAmount = amount + commission;
            if(totalAmount <= balance){
              // Trigger payment
              withdraw({amount, wallet, service})
              .then((res)=>{
                firebase
                .firestore()
                .collection('users')
                .doc(userId)
                .update({balance: balance - totalAmount, rewards: currentRewards > 0? currentRewards:0})
                .then(()=>{
                  dispatch(updateAuthedUser({balance: balance - totalAmount, rewards: currentRewards > 0? currentRewards:0}))
                })
                //  Disable otp
                firebase
                .firestore()
                .collection('otp')
                .doc(userId)
                .update({isUsed: true})
                // Transactions history
                firebase
                .firestore()
                .collection('transactions')
                .add({
                  userId,
                  type: 'withdraw',
                  details: res.data
                })
                callback()
              })
              .catch((err)=>{
                onError(err.message)
              })
            
            }else{
              onError('Insuficient Funds')
            } 
          }else{
            onError('User does\'t exist')
          }
          
        })
        .catch((err)=>onError(err.message))
      }else{
        onError('Withdraw request expired')
      }
    })
    .catch((err)=>onError(err.message))
    
}

export  function handleVerifyUser({userId, phoneNumber, amount, payment}, callback){
  const code = generateOTP();
  const nextDate  = new Date().getTime() + 5*60000;
  const actionCodeSettings = {
    url: `${process.env.REACT_APP_HOST}${PATH_DASHBOARD.general.home}?phoneNumber=${phoneNumber}&amount=${amount}&payment=${payment}&code=${code}`,
    /* iOS: {
      bundleId: 'com.example.ios'
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12'
    },
    handleCodeInApp: true,
    // When multiple custom dynamic link domains are defined, specify which
    
    // one to use.
    dynamicLinkDomain: "tchopify.web.app.page.link"
    */
  };
  const data = {
    id: userId,
    code,
    expiredAt: nextDate,
    isUsed: false
  }
  return firebase.firestore().collection('otp')
  .doc(userId)
  .set(data)
  .then(()=> firebase
  .auth().currentUser.sendEmailVerification(actionCodeSettings)
  .then(()=>callback())
  .catch((error)=>console.error(error)))
  
}

export function resetPassword(email, onSuccess, onError){
  return firebase.auth().sendPasswordResetEmail(email)
  .then(()=>onSuccess())
  .catch((err)=>onError(err))
}

export function handleSetRegistrationToken(userId, token){
  return (dispatch) => firebase
  .firestore()
  .collection('users')
  .doc(userId)
  .update({token})
  .then(()=>{
    dispatch(updateAuthedUser({token}))
  })
  .catch((err)=>console.error(err))
}

export function GetOwner(userId, callback){
  return RequestTimeout(5000, 
    firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .get()
    .then((snapDoc)=>
      callback(snapDoc.data())
    )
  )
}