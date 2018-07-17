<template>
  <div class="bottom-bar">
    <div class="bottom-bar__item" @click.prevent="toggleDiceRoller">
      <i class="icon fa fa-dice"></i>
    </div>

    <dice-roller />

    <div class="bottom-bar__item hidden--md-down"  @click.prevent="startUsingNotes">
      <i class="icon fa fa-sticky-note"></i>
    </div>

    <spell-finder class="bottom-bar__item" />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import DiceRoller from '@/components/DiceRoller/DiceRoller'
  import SpellFinder from '@/components/SpellFinder/SpellFinder'

  export default {
    name: 'BottomBar',
    components: {
      DiceRoller,
      SpellFinder
    },
    computed: {
      ...mapGetters([
        'showNotes',
        'diceRollerActive'
      ])
    },
    methods: {
      toggleDiceRoller () {
        this.$store.commit('SET_DICE_ROLLER_ACTIVE', !this.diceRollerActive)
      },
      startUsingNotes () {
        this.$store.commit('TOGGLE_NOTES', !this.showNotes)
      }
    }
  }
</script>
<style lang="scss">
@import './BottomBar';
</style>
