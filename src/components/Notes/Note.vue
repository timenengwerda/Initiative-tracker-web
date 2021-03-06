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
        :customModules="quillModules"
        :editorOptions="quillEditorSettings"
        class="notes__content__editor" />
    </div>
    <div class="form-group button-group">
      <button type="submit" class="button button--primary">Save</button>
      <small v-if="note.saveStatus">Last saved: {{ saveDate }}</small>
    </div>
  </form>
</template>

<script>
  import { VueEditor, Quill } from 'vue2-editor'
  import AutoLinks from 'quill-auto-links';
  import moment from 'moment'
  import linkifyHtml from 'linkifyjs/html'

  export default {
    name: 'Note',
    props: ['id'],
    components: {
      VueEditor
    },
    data () {
      return {
        saveInterval: null,
        saveFrequency: 10000, // time in ms how often the content should be saved to the localstorage
        customToolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link']
        ]
      }
    },
    computed: {
      quillModules () {
        return [{
          alias: 'autoLinks',
          module: AutoLinks
        }]
      },
      quillEditorSettings () {
        return {
          modules: {
            autoLinks: true
          }
        }
      },
      saveDate () {
        if (this.note.saveStatus) {
          const date = moment(this.note.saveStatus)
          return date.format('DD MMMM HH:mm:ss')
        }

        return false
      },
      content: {
        get () {
          return this.$store.getters.getNoteById(this.id).content
        },
        set (value) {
          this.$store.commit('UPDATE_NOTE_CONTENT', {noteId: this.id, value: value})
        }
      },
      title: {
        get () {
          return this.$store.getters.getNoteById(this.id).title
        },
        set (value) {
          this.$store.commit('UPDATE_NOTE_TITLE', {noteId: this.id, value})
        }
      },
      note () {
        return this.$store.getters.getNoteById(this.id)
      }
    },
    mounted() {
      this.saveInterval = setInterval(() => {
        this.saveNote()
      }, this.saveFrequency)
      this.$nextTick(() => this.$refs.title.focus())
    },
    beforeDestroy () {
      // clear the interval if this component is destroyed. It prevents console errors for trying to do saveNote() after this component is removed
      clearInterval(this.saveInterval)
    },
    methods: {
      saveNote () {
        this.$store.commit('UPDATE_SAVE_STATUS', {noteId: this.id, timestamp: Date.now()})
        this.$store.dispatch('saveExistingNote', this.id)
      }
    }
  }
</script>

