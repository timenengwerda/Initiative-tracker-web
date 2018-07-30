<template>
  <div class="grid grid--fluid tracker-wrapper">
    <div class="row row--initiative">
      <div :class="wrapperClass" class="tracker-row" style="position: relative;">
        <initiative/>
        <bottom-bar />
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
  import BottomBar from '@/components/BottomBar/BottomBar'
  import SpellFinder from '@/components/SpellFinder/SpellFinder'
  import Notes from '@/components/Notes/Notes'
  import firebase from 'firebase/app'
  import 'firebase/auth'

  export default {
    name: 'tool',
    components: {
      Initiative,
      DiceRoller,
      SpellFinder,
      Notes,
      BottomBar
    },
    computed: {
      ...mapGetters([
        'showNotes',
        'user'
      ]),
      wrapperClass () {
        return (this.showNotes) ? 'col--md-5 scroller' : 'col--md-4 col--md-offset-4'
      },
      wrapperClassBottomBar () {
        return (this.showNotes) ? 'col--md-5' : 'col--md-4 col--md-offset-4'
      }
    },
    mounted () {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.$store.dispatch('getUser', user.uid)
        }
      })
    }
  }
</script>
<style lang="scss">
.tracker-wrapper {
  overflow: hidden;
  height: 100%;

  > .row--initiative {
    overflow: auto;
    margin-bottom: 0;
    height: 100%;
    // min-height: 100vh;
  }
}

.tracker-row {
  display: flex;
  flex-direction: column;
}

</style>
