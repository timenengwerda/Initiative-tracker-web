<template>
  <div class="notes">
    <template v-if="user">
      <div class="notes__tabs tabs">
        <div class="tabs__header search">
          <input type="text" v-model="searchTerm" class="search__input form-control" placeholder="Search">
          <a href="" class="search__close" @click.prevent="searchTerm = ''" v-if="searchTerm != ''"><i class="fa fa-times"></i></a>
        </div>
        <div class="tabs__content">
          <template v-if="notesLoading">
            Loading notes
          </template>
          <template v-else>
            <div
              @click.prevent="activeTab = note.id"
              class="tabs__item"
              :class="{'tabs__item--active': activeTab === note.id}"
              v-for="(note, index) in filteredNotes"
              v-if="notes.length > 0">
                <span class="tabs__item__title">{{ note.title }}</span>
                <a href="#" @click.prevent="removeNote($event, index)" class="btn btn-link tabs__item__options">
                  <i class="fa fa-trash"></i>
                </a>
            </div>
            <div class="tabs__item tabs__item--static" v-if="notes.length === 0">No notes found.<br><a href="" @click.prevent="newTab">Create one now</a></div>
          </template>
        </div>
        <div class="tabs__footer">
          <a href="#" @click.prevent="newTab">
            <i class="fa fa-plus"></i>
            New Note
          </a>
          <a href="#" @click.prevent="googleSignout" v-if="user">
            Signout
          </a>
          <a href="#" @click.prevent="googleLogin" v-if="!user">
            Login with Google
          </a>
        </div>
      </div>

      <note
        :id="note.id"
        :key="index"
        v-if="activeTab !== -1 && notes.length > 0 && activeTab === note.id && notes.length"
        v-for="(note, index) in notes" />
      <div v-if="notes.length === 0 || activeTab === -1" class="notes__content">
        <template v-if="showNotesImport">
          <h1>Import notes</h1>
          <form @submit.prevent="extractJson">
            <div class="form-group">
              <label>Json file:</label>
              <input type="file" class="form-control" accept="application/json" @change.prevent="setImportFile" />
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="wipeOnImport" value="1" id="wipe">
              <label for="wipe">Wipe existing notes</label>
            </div>
            <div class="form-group">
              <button type="submit" class="button button--primary">Import</button>
            </div>
          </form>
        </template>
        <template v-else>
          <h1>Welcome back, {{user.username}}!</h1>
        </template>
      </div>
    </template>
    <div v-else>
      <h1>You need to be logged in with your Google Account before you can use notes</h1><br>
      <button class="button button--primary" @click.prevent="googleLogin">Login with your Google Account</button>
    </div>
  </div>
</template>

<script>
  import Note from './Note'
  import { mapGetters } from 'vuex'
  import firebase from 'firebase/app'
  import 'firebase/auth'

  export default {
    name: 'Notes',
    components: {
      Note
    },
    data () {
      return {
        notesLoading: true,
        activeTab: -1,
        searchTerm: '',
        showOptions: false,
        showNotesImport: false,
        importFile: false,
        wipeOnImport: false,
        storageNotes: []
      }
    },
    computed: {
      filteredNotes () {
        if (this.notes.length === 0) {
          return []
        }

        if (this.searchTerm === '') {
          return this.notes
        }

        return this.notes.filter(note => {
          return note.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || note.content.toLowerCase().includes(this.searchTerm.toLowerCase())
        })
      },
      ...mapGetters([
        'notes',
        'user'
      ])
    },
    watch: {
      'user': function (user) {
        // if a user is found, get all its notes
        if (user) {
          this.notesLoading = true
          this.$store.dispatch('getAllNotesByUserId', this.user.uid).then(response => {
            this.notesLoading = false
          })
        }
      }
    },
    mounted () {
      if (this.user) {
        this.$store.dispatch('getAllNotesByUserId', this.user.uid).then(response => {
          this.notesLoading = false
        })
      }
    },
    methods: {
      googleLogin () {
        this.$store.dispatch('googleLogin').then(response => {
          // login success
        }, error => {
          alert(error)
        })
      },
      newTab () {
        this.$store.dispatch('saveNewNote').then(response => {
          this.activeTab = this.notes[this.notes.length - 1].id // make the new tab active
        })
      },
      removeNote(e, index) {
        e.stopPropagation() // dont make the item active

        this.$swal({
          title: 'Are you sure?',
          text: 'This will remove the entire note from storage',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes Delete it!',
          cancelButtonText: 'No, Keep it!',
          showCloseButton: true,
          showLoaderOnConfirm: true
        }).then((result) => {
          if(result.value) {
            this.$store.dispatch('removeNote', index)
            this.$swal('Deleted', 'The note has been deleted', 'success')
          }
        })
      },
      googleSignout () {
        firebase.auth().signOut().then( response => {
          // Sign-out successful.
          this.$store.commit('SET_USER', false)
          this.$store.commit('SET_ACCESS_TOKEN', false)
          this.$store.commit('CLEAR_NOTES')
        }).catch(function(error) {
          // An error happened.
          console.log(error)
        })
      }
    }
  }
</script>
<style lang="scss">
@import './Notes';

.search {
  position: relative;

  &__input {
    border-top: 0;
    border-right: 0;
    border-left: 0;
    border-radius: 0;
  }

  &__close {
    position: absolute;
    top: 13px;
    right: 13px;
  }
}

.options {
  position: absolute;
  right: 0;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid $gray-lighter;
  border-radius: 5px;
  background: $white;
}
</style>
