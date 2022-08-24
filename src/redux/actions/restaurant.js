
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../firebase';
import {setCurrentRestaurant} from './app';
import { formattedRestaurants } from '../../utils/utils';
import BUSINESS_HOURS from '../../utils/mock-data/businessHours'

export const SET_RESTAURANT = 'SET_RESTAURANT';
export const REMOVE_RESTAURANT = 'REMOVE_RESTAURANT';
export const UPDATE_RESTAURANT = 'UPDATE_RESTAURANT';
export const SET_RESTAURANTS = 'SET_RESTAURANTS';
export const UPDATE_BUSINESS_HOURS = 'UPDATE_BUSINESS_HOURS';

function setRestaurant(restaurant){
    return{
        type: SET_RESTAURANT,
        payload: restaurant
    }
}

function updateRestaurant(restaurant){
  return {
    type: UPDATE_RESTAURANT,
    payload: restaurant
  }
}

export function setRestaurants(restaurants){
  return{
    type: SET_RESTAURANTS,
    payload: restaurants
  }
}

function removeRestaurant(restaurantId){
  return {
    type: REMOVE_RESTAURANT,
    payload: restaurantId
  }
}

function updateBusinessHours(restaurantId, businessHours){
  return {
      type: UPDATE_BUSINESS_HOURS,
      payload: {
          restaurantId,
          businessHours
      }
  }
}



export function handleNewRestaurant({owner, name, location, image, phoneNumber, kmCost, status, mode}, callback, onError){
    const id = uuidv4()
    return (dispatch) =>{
        // If there is no image
        if(image==null){
          const data = {
            id,
            name,
            phoneNumber,
            location,
            status,
            mode,
            kmCost,
            owner,
            businessHours: BUSINESS_HOURS,
            createdAt: Date.now()
          }
         firebase
          .firestore()
          .collection('restaurants')
          .doc(id)
          .set(data)
          .then(()=>{
              dispatch(setRestaurant(data))
              dispatch(setCurrentRestaurant(id))
              callback()
          })
          .catch((err)=>{
            console.error(err)
            onError(err)
          })
        }else{
          // If there is an image
        const filename = `${Date.now()}.jpeg`
        const uploadTask = firebase.storage()
        .ref(`images/restaurants/${filename}`,{
          contentType: 'image/jpeg',
        })
        .put(image)
        uploadTask
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
          onError(e.code)
        }, () => {
          
          // Record new data
            uploadTask.snapshot.ref.getDownloadURL().then( downloadedURL => {
                const data = {
                  id,
                  name,
                  phoneNumber,
                  location,
                  image: downloadedURL,
                  filename,
                  status,
                  mode,
                  kmCost,
                  owner,
                  businessHours: BUSINESS_HOURS,
                  createdAt: Date.now()
                }
               firebase
                .firestore()
                .collection('restaurants')
                .doc(id)
                .set(data)
                .then(()=>{
                    dispatch(setRestaurant(data))
                    dispatch(setCurrentRestaurant(id))
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
}

export function handleEditRestaurant({id, name, location, image, phoneNumber, status, oldImage, mode, kmCost}, callback, onError){
  return (dispatch) =>{
      // If there is no image
      if(image==null){
        const data = {
          id,
          name,
          phoneNumber,
          location,
          status,
          mode,
          kmCost
        }
       firebase
        .firestore()
        .collection('restaurants')
        .doc(id)
        .update(data)
        .then(()=>{
            dispatch(updateRestaurant(data))
            callback()
        })
        .catch((err)=>{
          console.error(err)
          onError(err)
        })
      }else{
        // If there is an image
      const filename = `${Date.now()}.jpeg`
      const uploadTask = firebase.storage()
      .ref(`images/restaurants/${filename}`,{
        contentType: 'image/jpeg',
      })
      .put(image)
      uploadTask
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
        onError(e.code)
      }, () => {

        // Delete Old Image
        if(oldImage){
          // Create a reference to the file to delete
          const imageRef = firebase.storage().ref(`images/restaurants/${oldImage}`);
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
                id,
                name,
                phoneNumber,
                location,
                image: downloadedURL,
                filename,
                status,
                mode,
                kmCost
              }
             firebase
              .firestore()
              .collection('restaurants')
              .doc(id)
              .update(data)
              .then(()=>{
                  dispatch(updateRestaurant(data))
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
}

export function handleGetRestaurants(owner){
  return (dispatch) => firebase
    .firestore()
    .collection('restaurants')
    .where('owner', '==', owner)
    .get()
    .then((documentSnapshot)=>{
       dispatch(setRestaurants(formattedRestaurants(documentSnapshot.docs)))
    })
    .catch((err)=>console.error(err))
}

export function handleGetStores({status}, callback){
  return firebase
  .firestore()
  .collection('restaurants')
  .where('status', '==', status)
  .get()
  .then((documentSnapshot)=>{
    callback(formattedRestaurants(documentSnapshot.docs))
  })
}

export function handleGetRestaurant(restaurantId, callback){
  return firebase
  .firestore()
  .collection('restaurants')
  .doc(restaurantId)
  .get()
  .then((documentSnapshot)=>{
    if(documentSnapshot.exists) callback(documentSnapshot.data())
  })
}

export function handleDeleteRestaurant({restaurantId, filename}, callback){
  return (dispatch) => firebase
  .firestore()
  .collection('restaurants')
  .doc(restaurantId)
  .delete()
  .then(()=>{
      if (filename){
        // Create a reference to the file to delete
        const imageRef = firebase.storage().ref(`images/restaurants/${filename}`);
        // Delete the file
        imageRef.delete().then(() => {
            console.log("Restaurant Image Deleted Successfully")
        }).catch((error) => {
            console.error(error)
            // onError(error)
        });
      }
      dispatch(removeRestaurant(restaurantId))
      callback()
  })
  .catch((err)=>console.log(err))
}

export function handleUpdateBusinessHours({restaurantId, businessHours}, callback, onError){
  return (dispatch) => firebase
  .firestore()
  .collection('restaurants')
  .doc(restaurantId)
  .update({businessHours})
  .then(()=>{
      dispatch(updateBusinessHours(restaurantId, businessHours))
      callback()
  })
  .catch((err)=>{
    console.error(err)
    onError(err)
  })

}