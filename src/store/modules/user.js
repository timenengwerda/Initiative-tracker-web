// import storage from '../storage'
// import { uuidv4 } from '../../Utils'
import firebase from 'firebase/app'
import 'firebase/auth'

import firebaseApi from '../firebaseApi'
import _ from 'lodash'

const state = {
  user: false,
  accessToken: false
}

const actions = {
  getUser (context, uid) {
    return new Promise((resolve, reject) => {
      firebaseApi.getItem('user', uid).then(response => {
        context.commit('SET_USER', response)
      })
    })
  },
  googleLogin (context) {
    return new Promise((resolve, reject) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then(result => {
          // save/update the user in the firebase DB
          firebaseApi.saveItem('user', result.user.uid, {
            username: result.user.displayName,
            uid: result.user.uid
          }).then(() => {
            resolve()
          }, error => {
            reject(error)
          })
        }).catch(function(error) {
          reject(error)
        })
      })
      .catch(function(error) {
        console.log(error)
      })
    })
  }
}

// mutations
const mutations = {
  SET_USER(context, dto) {
    state.user = dto
  },
  SET_ACCESS_TOKEN (context, dto) {
    state.accessToken = dto
  }
}

const getters = {
  user: state => state.user
}

export default {
  state,
  getters,
  actions,
  mutations
}
