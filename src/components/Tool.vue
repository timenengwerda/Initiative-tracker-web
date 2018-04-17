<template>

  <div class="grid--fluid tracker-wrapper">
    <div class="row">
      <div :class="wrapperClass">
        <initiative/>
        <dice-roller/>
        <div class="text--center hidden--md-down">
          <a href="#" @click.prevent="startUsingNotes">Toggle notes</a>
        </div>
      </div>
      <div class="col--md-7 col--md-offset-1" v-if="showNotes">
        <notes />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Initiative from '@/components/Initiative/Initiative'
  import DiceRoller from '@/components/DiceRoller/DiceRoller'
  import Notes from '@/components/Notes/Notes'

  export default {
    name: 'tool',
    components: {
      Initiative,
      DiceRoller,
      Notes
    },
    computed: {
      ...mapGetters([
        'showNotes'
      ]),
      wrapperClass () {
        return (this.showNotes) ? 'col--md-3 col--md-offset-1' : 'col--md-4 col--md-offset-4'
      }
    },
    methods: {
      startUsingNotes () {
        this.$store.commit('TOGGLE_NOTES', !this.showNotes)
      }
    }
  }
</script>
<style lang="scss">
.tracker-wrapper {
  > .row {
    height: 100vh;
    margin-bottom: 0;
  }
}

</style>
