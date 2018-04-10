<template>
  <form @submit.prevent="saveNote" class="notes__content">
    <div class="form-group">
      <input type="text" class="notes__content__title form-control" ref="title" v-model="title">
    </div>
    <div class="form-group notes__content__form-group--full-height">
      <vue-editor
        placeholder="Start making a note..."
        v-model="content"
        :editorToolbar="customToolbar"
        class="notes__content__editor" />
    </div>
    <div class="form-group button-group">
      <button type="submit" class="button button--primary">Save</button>
      <small v-if="note.saveStatus">Last saved: {{ saveDate }}</small>
    </div>
  </form>
</template>

<script>
  import { VueEditor } from 'vue2-editor'
  import moment from 'moment'
  export default {
    name: 'Note',
    props: ['index'],
    components: {
      VueEditor
    },
    data () {
      return {
        saveFrequency: 10000, // time in ms how often the content should be saved to the localstorage
        customToolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }]
        ]
      }
    },
    computed: {
      saveDate () {
        if (this.note.saveStatus) {
          const date = moment(this.note.saveStatus)
          return date.format('DD MMMM HH:mm:ss')
        }

        return false
      },
      content: {
        get () {
          return this.$store.getters.notes[this.index].content
        },
        set (value) {
          this.$store.commit('UPDATE_NOTE_CONTENT', {noteIndex: this.index, value})
        }
      },
      title: {
        get () {
          return this.$store.getters.notes[this.index].title
        },
        set (value) {
          this.$store.commit('UPDATE_NOTE_TITLE', {noteIndex: this.index, value})
        }
      },
      note () {
        return this.$store.getters.notes[this.index]
      }
    },
    mounted() {
      setInterval(() => {
        this.saveNote()
      }, this.saveFrequency)
      this.$nextTick(() => this.$refs.title.focus())
    },
    methods: {
      saveNote () {
        this.$store.commit('UPDATE_NOTES_IN_STORAGE')
        this.$store.commit('UPDATE_SAVE_STATUS', {noteIndex: this.index, timestamp: Date.now()})
      }
    }
  }
</script>

