<template>
  <div class="notes">
    <div class="notes__tabs tabs">
      <div class="tabs__header search">
        <input type="text" v-model="searchTerm" class="search__input form-control" placeholder="Search">
        <a href="" class="search__close" @click.prevent="searchTerm = ''" v-if="searchTerm != ''"><i class="fas fa-times"></i></a>
      </div>
      <div class="tabs__content">
        <div
          @click.prevent="activeTab = note.id"
          class="tabs__item"
          :class="{'tabs__item--active': activeTab === note.id}"
          v-for="(note, index) in filteredNotes"
          v-if="notes.length > 0">
            <span class="tabs__item__title">{{ note.title }}</span>
            <a href="#" @click.prevent="removeNote($event, index)" class="btn btn-link tabs__item__options">
              <i class="fas fa-trash"></i>
            </a>
        </div>
        <div class="tabs__item tabs__item--static" v-if="notes.length === 0">No notes found.<br><a href="" @click.prevent="newTab">Create one now</a></div>
      </div>


      <div class="tabs__footer">
        <a href="#" @click.prevent="newTab">
          <i class="fas fa-plus"></i>
          New Note
        </a>
        <a href="" @click.prevent="showOptions = !showOptions">
          Options
        </a>
        <div class="options" v-if="showOptions">
          <a href="#" @click.prevent="importNotes">
            Import notes
          </a>
          <a href="#" @click.prevent="exportNotes">
            Export notes
          </a>
          <a href="#" @click.prevent="clearNotes">
            Wipe all notes
          </a>
        </div>
      </div>
    </div>

    <note
      :id="note.id"
      :key="index"
      v-if="activeTab !== -1 && notes.length > 0 && activeTab === note.id"
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
        <h1>Beware!</h1>
        <p>
          The <strong>notes</strong> and <strong>players</strong> are being saved in you own web storage. If you decide to empty your browser history and/or cookies all this content will be <strong>LOST</strong>.
        </p>
      </template>
    </div>
  </div>
</template>

<script>
  import Note from './Note'
  import { mapGetters } from 'vuex'
  import { uuidv4 } from '../../Utils'

  export default {
    name: 'Notes',
    components: {
      Note
    },
    data () {
      return {
        activeTab: -1,
        searchTerm: '',
        showOptions: false,
        showNotesImport: false,
        importFile: false,
        wipeOnImport: false
      }
    },
    computed: {
      filteredNotes () {
        if (this.searchTerm === '') {
          return this.notes
        }

        return this.notes.filter(note => {
          return note.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || note.content.toLowerCase().includes(this.searchTerm.toLowerCase())
        })
      },
      ...mapGetters([
        'notes'
      ])
    },
    methods: {
      newTab () {
        this.$store.commit('ADD_BLANK_NOTE')
        this.activeTab = this.notes[this.notes.length - 1].id // make the new tab active
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
            this.$store.commit('REMOVE_NOTE', index)
            this.$store.commit('UPDATE_NOTES_IN_STORAGE')
            this.$swal('Deleted', 'The note has been deleted', 'success')
          }
        })
      },
      setImportFile (event) {
        this.importFile = event.target.files[0]
      },
      extractJson (event) {
        if (this.importFile) {
          if (this.wipeOnImport) {
            this.$store.commit('SET_NOTES', [])
          }

          const reader = new FileReader()
          reader.onload = (event) => {
            const result = JSON.parse(event.target.result)
            if (result.length) {
              result.forEach(note => {
                if (note.title !== undefined && note.saveStatus !== undefined && note.content !== undefined) {
                  console.log(note)
                  if (!note.id) {
                    note.id = uuidv4()
                  }
                  this.$store.commit('ADD_NOTE', note)
                  this.$store.commit('UPDATE_NOTES_IN_STORAGE')
                }
              })
            }
          }

          reader.readAsText(this.importFile)
        } else {
          this.$swal({
            title: 'No file was selected',
            type: 'warning'
          })
        }
      },
      importNotes () {
        this.activeTab = -1;
        this.showNotesImport = true
        this.showOptions = false
        this.importFile = false
        this.wipeOnImport = false
      },
      exportNotes() {
        this.$swal({
          title: 'Name your export file',
          input: 'text'
        }).then(val => {
          let exportName = (val && val.value) ? val.value : 'initiative-tracker-export'
          exportName = exportName.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");

          // Ewout gave me this of which i'm forever grateful
          const data = JSON.stringify(this.notes)
          const blob = new Blob([data], { type: 'text/plain' })
          const e = document.createEvent('MouseEvents'),
            a = document.createElement('a')
            a.download = `${exportName}.json`
            a.href = window.URL.createObjectURL(blob)
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
            e.initEvent(
              'click',
              true,
              false,
              window,
              0,
              0,
              0,
              0,
              0,
              false,
              false,
              false,
              false,
              0,
              null
            )
            a.dispatchEvent(e)

            this.showOptions = false
        })
      },
      clearNotes () {
        this.showOptions = false

        this.$swal({
          title: 'Are you sure?',
          text: 'This will remove all notes from storage and cannot be undone',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes Delete it!',
          cancelButtonText: 'No, Keep it!',
          showCloseButton: true,
          showLoaderOnConfirm: true
        }).then((result) => {
          if(result.value) {
            this.$store.commit('SET_NOTES', [])
            this.$swal('Deleted', 'The notes have been deleted', 'success')
          }
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
    border-radius: 0;
    border-top: 0;
    border-left: 0;
    border-right: 0;
  }

  &__close {
    position: absolute;
    top: 13px;
    right: 13px;
  }
}

.options {
  position: absolute;
  bottom: 40px;
  right: 0;
  background: $white;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid $gray-lighter;
}
</style>
