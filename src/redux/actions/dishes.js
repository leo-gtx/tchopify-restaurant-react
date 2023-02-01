import {v4 as uuidv4} from 'uuid';
import firebase from '../../firebase';
import {formattedDishes} from '../../utils/utils';

export const ADD_DISH = 'ADD_DISH';
export const SET_DISHES  = 'SET_DISHES';
export const REMOVE_DISH = 'REMOVE_DISH';
export const UPDATE_DISH = 'UPDATE_DISH';
function addDish(dish){
    return {
        type: ADD_DISH,
        payload: {
            [dish.id]: dish
        }
    };
}

function updateDish(dish){
    return {
        type: UPDATE_DISH,
        payload: dish,
    };
}

export function setDishes(dishes){
    return {
        type: SET_DISHES,
        payload: dishes,
    };
}

function removeDish(dishId){
    return {
        type: REMOVE_DISH,
        payload: dishId,
    };
}
export function handleGetDishes(owner){
    return (dispatch) => firebase
    .firestore()
    .collection('dishes')
    .where('owner', '==', owner)
    .get()
    .then((documentSnapshot)=>{
       dispatch(setDishes(formattedDishes(documentSnapshot.docs)))
    })
    .catch((err)=>console.error(err))

}

export function handleGetDish(dishId, callback){
    return firebase
    .firestore()
    .collection('dishes')
    .doc(dishId)
    .get()
    .then((documentSnapshot)=>{
        if(documentSnapshot.exists) callback(documentSnapshot.data())
    })
    .catch((err)=>console.error(err))
}

export function handleGetDishesByShop(shop, callback){
    return firebase
    .firestore()
    .collection('dishes')
    .where('owner', '==', shop)
    .get()
    .then((documentSnapshot) =>{
        if(!documentSnapshot.empty) callback(formattedDishes(documentSnapshot.docs))
    })
    .catch((err)=>console.error(err))
}
export function handleAddDish({name, description, image, category, options, price, cookingTime, isSingleOption, isPublished, owner}, callback, onError){
    const id = uuidv4()
    return (dispatch) =>
        // Check if category name already exists
        firebase
        .firestore()
        .collection('dishes')
        .where('name', '==', name)
        .get()
        .then((querySnapshot)=>{
            if(querySnapshot.empty){
                // If there is no image
                if(image==null){
                    const data = {
                    id,
                    name,
                    description,
                    category,
                    options,
                    price,
                    isSingleOption,
                    isPublished,
                    cookingTime,
                    owner,
                    createdAt: Date.now(),
                    }
                firebase
                    .firestore()
                    .collection('dishes')
                    .doc(id)
                    .set(data)
                    .then(()=>{
                        dispatch(addDish(data))
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
                .ref(`images/dishes/${filename}`,{
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
                    
                    // Record new data
                    uploadTask.snapshot.ref.getDownloadURL().then( downloadedURL => {
                        const data = {
                            id,
                            name,
                            description,
                            category,
                            options,
                            price,
                            cookingTime,
                            isSingleOption,
                            isPublished,
                            owner,
                            createdAt: Date.now(),
                            image: downloadedURL,
                            filename
                        }
                        firebase
                        .firestore()
                        .collection('dishes')
                        .doc(id)
                        .set(data)
                        .then(()=>{
                            dispatch(addDish(data))
                            callback()
                        })
                        .catch((err)=>{
                            console.error(err)
                            onError(err)
                        })
                    })
                    
                    
                })   
                }
            }else{
                // TODO: return name alredy use error
                // alert("This name is already used");
                onError("Dish: Create: This name is already used")
            }
        })
}

export function handleDeleteDish({dishId, filename}, callback){
    return (dispatch) => firebase
    .firestore()
    .collection('dishes')
    .doc(dishId)
    .delete()
    .then(()=>{
        if (filename){
          // Create a reference to the file to delete
          const imageRef = firebase.storage().ref(`images/dishes/${filename}`);
          // Delete the file
          imageRef.delete().then(() => {
              console.log("Dish Image Deleted Successfully")
          }).catch((error) => {
              console.error(error)
              // onError(error)
          });
        }
        dispatch(removeDish(dishId))
        callback()
    })
    .catch((err)=>console.log(err))
  }

  export function handleEditDish({id, name, description, image, category, options, price, cookingTime, isSingleOption, isPublished, oldImage, owner}, callback, onError){
    return (dispatch) =>{
        // If there is no image
        if(image==null){
          const data = {
            id,
            name,
            description,
            category,
            options,
            price,
            isSingleOption,
            isPublished,
            owner,
            cookingTime,
          }
         firebase
          .firestore()
          .collection('dishes')
          .doc(id)
          .update(data)
          .then(()=>{
              dispatch(updateDish(data))
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
        .ref(`images/dishes/${filename}`,{
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
            const imageRef = firebase.storage().ref(`images/dishes/${oldImage}`);
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
                    description,
                    category,
                    options,
                    price,
                    isSingleOption,
                    isPublished,
                    cookingTime,
                    owner,
                    image: downloadedURL,
                    filename,
                }
               firebase
                .firestore()
                .collection('dishes')
                .doc(id)
                .update(data)
                .then(()=>{
                    dispatch(updateDish(data))
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