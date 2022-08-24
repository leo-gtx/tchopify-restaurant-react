import {v4 as uuidv4} from 'uuid';
import firebase from '../../firebase';
import { formattedCategories } from '../../utils/utils';

export const ADD_CATEGORY = 'ADD_CATEGORY';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const ADD_SUBCATEGORY = 'ADD_SUBCATEGORY';
export const SET_SUBCATEGORIES = 'SET_SUBCATEGORIES';
export const DELETE_SUBCATEGORY = 'DELETE_SUBCATEGORY';
export const EDIT_CATEGORY = 'EDIT_CATEGORY';
export const EDIT_SUBCATEGORY = 'EDIT_SUBCATEGORY';

function addCategory(category){
    return {
        type: ADD_CATEGORY,
        payload: category
    }
}

function editCategory(category){
    return {
        type: EDIT_CATEGORY,
        payload: category
    }
}

function editSubcategory(subcategory){
    return {
        type: EDIT_SUBCATEGORY,
        payload: subcategory
    }
}

export function setCategories(categories){
    return {
        type: SET_CATEGORIES,
        payload: categories
    }
}

function removeCategory(categoryId){
    return{
        type: DELETE_CATEGORY,
        payload: categoryId
    }
}
function addSubcategory(subcategory){
    return {
        type: ADD_SUBCATEGORY,
        payload: subcategory
    }
}
export function setSubcategories(subcategories){
    return {
        type: SET_SUBCATEGORIES,
        payload: subcategories
    }
}
function removeSubcategory(subcategoryId){
    return {
        type: DELETE_SUBCATEGORY,
        payload: subcategoryId
    }
}

export function handleNewCategory({name, image}, callback, onError){
    const id = uuidv4()
    return (dispatch) =>
        // Check if category name already exists
        firebase
        .firestore()
        .collection('categories')
        .where('name', '==', name)
        .get()
        .then((querySnapshot)=>{
            if(querySnapshot.empty){
                // If there is no image
                if(image==null){
                    const data = {
                    id,
                    name,
                    isGroup: true,
                    createdAt: Date.now(),
                    }
                firebase
                    .firestore()
                    .collection('categories')
                    .doc(id)
                    .set(data)
                    .then(()=>{
                        dispatch(addCategory(data))
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
                .ref(`images/categories/${filename}`,{
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
                            isGroup: true,
                            createdAt: Date.now(),
                            image: downloadedURL,
                            filename
                        }
                        firebase
                        .firestore()
                        .collection('categories')
                        .doc(id)
                        .set(data)
                        .then(()=>{
                            dispatch(addCategory(data))
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
                console.log("This name is already used")
                alert("This name is already used");
                onError("Category: Create: This name is already used")
            }
        })
        
}

export function handleGetCategories(){
    return (dispatch) => firebase
    .firestore()
    .collection('categories')
    .where('isGroup', '==', true)
    .get()
    .then((documentSnapshot)=>{
        if(!documentSnapshot.empty) dispatch(setCategories(formattedCategories(documentSnapshot.docs)))
    })
    .catch((err)=>console.error(err))

}

export function handleGetSubCategories(owner){
    return (dispatch) => firebase
    .firestore()
    .collection('categories')
    .where('isGroup', '==', false)
    .where('owner', '==', owner)
    .get()
    .then((documentSnapshot)=>{
        if(!documentSnapshot.empty) dispatch(setSubcategories(formattedCategories(documentSnapshot.docs)))
    })
    .catch((err)=>console.error(err))

}

export function handleGetSubcategoriesByRestaurant(restaurantId, callback){
    return firebase
    .firestore()
    .collection('categories')
    .where('isGroup', '==', false)
    .where('owner', '==', restaurantId)
    .get()
    .then((documentSnapshot)=>{
        if(!documentSnapshot.empty) callback(formattedCategories(documentSnapshot.docs))
    })
    .catch((err)=>console.error(err))
}

export function handleDeleteSubcategory(id, callback){
    return (dispatch) => firebase
    .firestore()
    .collection('categories')
    .doc(id)
    .delete()
    .then(()=>{
        dispatch(removeSubcategory(id))
        callback()
    })
    .catch((err)=>console.log(err))
}

export function handleDeleteCategory(id, callback){
    return (dispatch) => firebase
    .firestore()
    .collection('categories')
    .doc(id)
    .delete()
    .then(()=>{
        dispatch(removeCategory(id))
        callback()
    })
    .catch((err)=>console.log(err))
}

export function handleNewSubcategory({owner, name, categoryGroup}, callback, onError){
    const id = uuidv4()
    return (dispatch) =>
        // Check if category name already exists
        firebase
        .firestore()
        .collection('categories')
        .where('name', '==', name)
        .get()
        .then((querySnapshot)=>{
            if(querySnapshot.empty){
                    const data = {
                    id,
                    name,
                    isGroup: false,
                    categoryGroup, 
                    createdAt: Date.now(),
                    owner,
                    }
                firebase
                    .firestore()
                    .collection('categories')
                    .doc(id)
                    .set(data)
                    .then(()=>{
                        dispatch(addSubcategory(data))
                        callback()
                    })
                    .catch((err)=>{
                        console.error(err)
                        onError(err)
                    })
            }else{
                // TODO: return name alredy use error
                console.log("This name is already used")
                alert("This name is already used");
                onError("Category: Create: This name is already used")
            }
        })
        
}

export function handleEditSubcategory({id, name, categoryGroup}, callback, onError){
    return (dispatch) =>
        // Check if category name already exists
        firebase
        .firestore()
        .collection('categories')
        .where('name', '==', name)
        .get()
        .then((querySnapshot)=>{
            if(querySnapshot.empty || querySnapshot.docs[0].data().id === id ){
                    const data = {
                    id,
                    name,
                    categoryGroup,
                    }
                firebase
                    .firestore()
                    .collection('categories')
                    .doc(id)
                    .update(data)
                    .then(()=>{
                        dispatch(editSubcategory(data))
                        callback()
                    })
                    .catch((err)=>{
                        console.error(err)
                        onError(err)
                    })
            }else{
                // TODO: return name alredy use error
                console.log("This name is already used")
                alert("This name is already used");
                onError("Category: Create: This name is already used")
            }
        })
        
}

export function handleEditCategory({id, name, image, oldImage}, callback, onError){
    
    return (dispatch) =>
        // Check if category name already exists
        firebase
        .firestore()
        .collection('categories')
        .where('name', '==', name)
        .get()
        .then((querySnapshot)=>{
            if(querySnapshot.empty || querySnapshot.docs[0].data().id === id){
                // If there is no image
                if(image==null){
                    const data = {
                    id,
                    name,
                    }
                firebase
                    .firestore()
                    .collection('categories')
                    .doc(id)
                    .update(data)
                    .then(()=>{
                        dispatch(editCategory(data))
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
                .ref(`images/categories/${filename}`,{
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
                    // Delete Old Image
                    if(oldImage){
                        // Create a reference to the file to delete
                    const imageRef = firebase.storage().ref(`images/categories/${oldImage}`);

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
                            image: downloadedURL,
                            filename
                        }
                        firebase
                        .firestore()
                        .collection('categories')
                        .doc(id)
                        .update(data)
                        .then(()=>{
                            dispatch(editCategory(data))
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
                console.log("This name is already used")
                alert("This name is already used");
                onError("Category: Create: This name is already used")
            }
        })
        
}