<template>

  <div class="grid grid--fluid tracker-wrapper">
    <div class="row">
      <div :class="wrapperClass">
        <initiative/>
        <dice-roller/>
        <div class="text--center hidden--md-down">
          <a href="#" @click.prevent="startUsingNotes">Toggle notes</a>
        </div>
      </div>
      <div class="col--md-7" v-if="showNotes">
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
        return (this.showNotes) ? 'col--md-5 scroller' : 'col--md-4 col--md-offset-4'
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
  padding-bottom: 100px;

  > .row {
    margin-bottom: 0;
    height: 100vh;
  }
}

</style>
