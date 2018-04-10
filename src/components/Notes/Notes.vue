<template>
  <div class="notes">
    <div class="notes__tabs tabs">
      <div class="tabs__header search">
        <input type="text" v-model="searchTerm" class="search__input form-control" placeholder="Search for title...">
        <a href="" class="search__close" @click.prevent="searchTerm = ''" v-if="searchTerm != ''"><i class="fas fa-times"></i></a>
      </div>
      <div
        @click.prevent="activeTab = index"
        class="tabs__item"
        :class="{'tabs__item--active': activeTab === index}"
        v-for="(note, index) in filteredNotes"
        v-if="notes.length > 0">
          <span class="tabs__item__title">{{ note.title }}</span>
          <a href="#" @click.prevent="removeNote($event, index)" class="btn btn-link tabs__item__options">
            <i class="fas fa-trash"></i>
          </a>
      </div>

      <div class="tabs__item tabs__item--static" v-if="notes.length === 0">No notes found.<br><a href="" @click.prevent="newTab">Create one now</a></div>

      <div class="tabs__footer">
        <a href="#" @click.prevent="newTab">
          <i class="fas fa-plus"></i>
          New tab
        </a>
        <a href="#" @click.prevent="stopUsingNotes">
          Close notes
        </a>
      </div>
    </div>
    <note
      :index="index"
      :key="index"
      v-if="activeTab >= 0 && notes.length > 0 && activeTab === index"
      v-for="(note, index) in notes" />
    <div v-if="notes.length === 0 || activeTab === -1" class="notes__content">
      <h1>Beware!</h1>
      <p>
        The <strong>notes</strong> and <strong>players</strong> are being saved in you own web storage. If you decide to empty your browser history and/or cookies all this content will be <strong>LOST</strong>.
      </p>
    </div>
  </div>
</template>

<script>
  import Note from './Note'
  import { mapGetters } from 'vuex'
  export default {
    name: 'Notes',
    components: {
      Note
    },
    data () {
      return {
        activeTab: -1,
        searchTerm: ''
      }
    },
    computed: {
      filteredNotes () {
        if (this.searchTerm === '') {
          return this.notes
        }

        return this.notes.filter(note => {
          return note.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        })
      },
      ...mapGetters([
        'notes'
      ])
    },
    methods: {
      stopUsingNotes () {
        this.$store.commit('TOGGLE_NOTES', false)
      },
      newTab () {
        this.$store.commit('ADD_BLANK_NOTE')
        this.activeTab = this.notes.length - 1 // make the new tab active
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
      exportNotes() {
        // Ewout gave me this of which i'm forever grateful
        const data = JSON.stringify(this.checkRequests)
        const blob = new Blob([data], { type: 'text/plain' })
        const e = document.createEvent('MouseEvents'),
          a = document.createElement('a')
        a.download = 'export.json'
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
</style>
