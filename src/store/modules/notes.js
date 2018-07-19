import firebaseApi from '../firebaseApi'

const state = {
  notes: [],
  showNotes: false
}

const actions = {
  removeNote(context, noteIndex) {
    return new Promise((resolve, reject) => {
      const note = context.state.notes[noteIndex]
      if (note) {
        firebaseApi.removeItem('note', note.id).then(response => {
          if (response) {
            context.commit('REMOVE_NOTE', noteIndex)
            resolve()
          } else {
            reject('No response')
          }
        }, error => {
          console.log(error)
        })
      } else {
        reject('Note not found')
      }
    })
  },
  getAllNotesByUserId(context, uid) {
    context.commit('CLEAR_NOTES')
    return new Promise((resolve, reject) => {
      firebaseApi.getItemByChild('note', 'uid', uid).then(response => {
        if (response) {
          for (let i in response) {
            context.commit('ADD_NOTE', {
              title: response[i].title,
              content: response[i].content,
              saveStatus: response[i].saveStatus,
              id: i
            })
          }
        }
        resolve(true)
      }, error => {
        resolve(error)
      })
    })
  },
  saveNewNote(context) {
    return new Promise((resolve, reject) => {
      firebaseApi.saveItem('note', false, {
        content: '',
        title: `New note ${context.state.notes.length + 1}`,
        uid: context.getters.user.uid,
        saveStatus: Date.now()
      }).then(response => {
        if (response) {
          context.commit('ADD_NOTE', {
            title: response.snapshot.title,
            content: response.snapshot.content,
            id: response.id
          })

          resolve(true)
        } else {
          reject('Response failed')
        }
      }, error => {
        reject(error)
      })
    })
  },
  saveExistingNote(context, noteId) {
    return new Promise((resolve, reject) => {
      const note = context.getters.getNoteById(noteId)
      if (note) {
        firebaseApi.saveItem('note', noteId, {
          content: note.content,
          title: note.title,
          uid: context.getters.user.uid,
          saveStatus: note.saveStatus
        }).then(response => {
          if (response) {
            resolve(true)
          } else {
            reject('Response failed')
          }
        }, error => {
          reject(error)
        })
      }
    })
  }
}

// mutations
const mutations = {
  ADD_NOTE(context, dto) {
    state.notes.push({
      title: dto.title,
      saveStatus: (dto.saveStatus) ? dto.saveStatus : false,
      content: dto.content,
      id: dto.id
    })
  },
  CLEAR_NOTES (context) {
    state.notes = []
  },
  REMOVE_NOTE(context, dto) {
    state.notes.splice(dto, 1)
  },
  UPDATE_NOTE_CONTENT(context, dto) {
    state.notes.find(note => note.id === dto.noteId).content = dto.value
  },
  UPDATE_NOTE_TITLE(context, dto) {
    state.notes.find(note => note.id === dto.noteId).title = dto.value
  },
  UPDATE_SAVE_STATUS(context, dto) {
    state.notes.find(note => note.id === dto.noteId).saveStatus = dto.timestamp
  },
  TOGGLE_NOTES(context, dto) {
    state.showNotes = dto
  }
}

const getters = {
  notes: state => state.notes,
  showNotes: state => state.showNotes,
  getNoteById: (state) => (id) => {
    return state.notes.find(note => note.id === id)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
