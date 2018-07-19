import firebase from 'firebase/app'
import 'firebase/database'

export default {
  getCampaignsFromUser (userId) {

  },
  removeItem(ref, id) {
    return new Promise((resolve, reject) => {
      const refToRemove = firebase.database().ref(`${ref}/${id}`)
      if (refToRemove) {
        refToRemove.remove().then(response => {
          resolve(true)
        }, error => {
          reject(error)
        })
      }
    })
  },
  saveItem(ref, id = false, dto) {
    return new Promise((resolve, reject) => {
      if (id) {
        firebase.database().ref(`${ref}/${id}`).set(dto).then(response => {
          firebase.database().ref(ref).child(id)
          .once('value')
          .then(function(snapshot) {
            resolve(snapshot.val())
          })
        }, error => {
          reject(error)
        })
      } else {
        const newRef = firebase.database().ref(`${ref}`).push()
        newRef.then(response => {
          const newId = response.key

          newRef.set(dto).then(response => {
            firebase.database().ref(ref).child(newId)
            .once('value')
            .then(function(snapshot) {
              resolve({snapshot: snapshot.val(), id: newId})
            })
          }, error => {
            reject(error)
          })
        })
      }
    })
  },
  getItemByChild(ref, child, id) {
    return new Promise((resolve, reject) => {
      firebase.database()
        .ref(ref)
        .orderByChild(child)
        .equalTo(id)
        .once('value')
        .then(function(snapshot) {
          resolve(snapshot.val())
        }, error => {
          reject(error)
        })
    })
  },
  getItem(ref, id) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(ref).child(id)
      .once('value')
      .then(function(snapshot) {
        resolve(snapshot.val())
      }, error => {
        reject(error)
      })
    })
  }
}
