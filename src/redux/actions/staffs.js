import firebase from '../../firebase';
import {formattedStaffs} from '../../utils/utils';

export const ADD_STAFF = 'ADD_STAFF';
export const SET_STAFFS  = 'SET_STAFFS';
export const REMOVE_STAFF = 'REMOVE_STAFF';
export const UPDATE_STAFF = 'UPDATE_STAFF';

function updateStaff(staff){
    return {
        type: UPDATE_STAFF,
        payload: staff,
    };
}

export function setStaffs(staffs){
    return {
        type: SET_STAFFS,
        payload: staffs,
    };
}

function removeStaff(staffId){
    return {
        type: REMOVE_STAFF,
        payload: staffId,
    };
}

export function handleGetStaffs(owner){
    return (dispatch) => firebase
    .firestore()
    .collection('users')
    .where('owner','==', owner)
    .get()
    .then((documentSnapshot)=>{
        dispatch(setStaffs(formattedStaffs(documentSnapshot.docs)))
    })
    .catch((err)=>console.error(err))
}

export function handleAddStaff({email, password, firstName, lastName, role, owner, shop}, onSuccess, onError){
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        firebase
          .firestore()
          .collection('users')
          .doc(res.user.uid)
          .set({
            id: res.user.uid,
            email,
            fullname: `${firstName} ${lastName}`,
            emailVerified: res.user.emailVerified,
            role,
            shop,
            owner,
            createdAt: Date.now()
          });
        if(!res.user.emailVerified) res.user.sendEmailVerification();
        onSuccess()
      })
      .catch((err)=>onError(err))
}

export function handleDeleteStaff({staffId, filename}, callback, onError){
    return (dispatch) => firebase
    .firestore()
    .collection('users')
    .doc(staffId)
    .delete()
    .then(()=>{

        if (filename){
          // Create a reference to the file to delete
          const imageRef = firebase.storage().ref(`images/staffs/${filename}`);
          // Delete the file
          imageRef.delete().then(() => {
              console.log(`Image ${filename} Deleted Successfully`)
          }).catch((error) => {
              console.error(error)
               onError(error)
          });
        }
        dispatch(removeStaff(staffId))
        callback()
    })
    .catch((err)=>console.log(err))
  }

  export function handleEditStaff({id, lastName, firstName, role, shop}, callback, onError){
    return (dispatch) =>{
          const data = {
            id,
            lastName,
            firstName,
            role,
            shop
          }
         firebase
          .firestore()
          .collection('users')
          .doc(id)
          .update(data)
          .then(()=>{
              dispatch(updateStaff(data))
              callback()
          })
          .catch((err)=>{
            console.error(err)
            onError(err)
          })
        }
  }