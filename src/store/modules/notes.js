import storage from '../storage'
import { uuidv4 } from '../../Utils'

const state = {
  notes: (storage.get('notes')) ? JSON.parse(storage.get('notes')) : [],
  showNotes: false
}

const actions = {

}

// mutations
const mutations = {
  ADD_BLANK_NOTE(context, dto) {
    state.notes.push({
      title: `New note ${state.notes.length + 1}`,
      saveStatus: false,
      content: '',
      id: uuidv4()
    })
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
  UPDATE_NOTES_IN_STORAGE(context) {
    storage.set('notes', JSON.stringify(state.notes))
  },
  UPDATE_SAVE_STATUS(context, dto) {
    state.notes.find(note => note.id === dto.noteId).saveStatus = dto.timestamp
  },
  TOGGLE_NOTES(context, dto) {
    state.showNotes = dto
  },
  ADD_NOTE(context, dto) {
    state.notes.push(dto)
  },
  SET_NOTES(context, dto) {
    state.notes = dto
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
