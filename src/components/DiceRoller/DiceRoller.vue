<template>
  <div class="dice-roller" :class="{ 'dice-roller--expanded' : isActive }">
    <section class="dice-roller__body">
      <div class="dice-roller__outcome">
        {{ stringifiedOutcome }}
      </div>

      <ul class="dice-group-list">
        <li class="dice-group-list__item" v-for="(dice, index) in dices">
          <button class="button button--primary" @click.prevent="roll(dice);">d{{dice}}</button>
          <div class="dice-group">
            <button class="dice-group__item button button--secondary" @click.prevent="roll(dice, 2);">x2</button>
            <button class="dice-group__item button button--secondary" @click.prevent="roll(dice, 3);">x3</button>
            <button class="dice-group__item button button--secondary" @click.prevent="roll(dice, 4);">x4</button>
          </div>
        </li>
      </ul>

      <button class="button--close button button--link" @click.prevent="toggleDiceRoller">Close</button>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'Diceroller',
    data () {
      return {
        outcome: [],
        dices: [ 20, 8, 12, 6, 10, 4]
      }
    },
    computed: {
      ...mapGetters({
        isActive: 'diceRollerActive'
      }),
      stringifiedOutcome () {
        if (this.outcome.length === 0) {
          return '-'
        }

        if (this.outcome.length === 1) {
          return this.outcome[0]
        }

        let str = ''
        this.outcome.forEach(num => {
          str += `${num} + `
        })

        // remove the last ' + '
        str = str.substr(0, (str.length - 3))

        // add the numbers to make a result
        let total = this.outcome.reduce((a, value) => {
          return a += value
        }, 0)

        return `${str} = ${total}`
      }
    },
    methods: {
      collapseExpand () {
        this.isActive = !this.isActive
      },
      roll(type, multiplier = 1) {
        this.outcome = []

        setTimeout(() => {
          let totalOutcome = []
          for (let i = 0; i < multiplier; i++) {
            totalOutcome.push(this.randomInt(1, type))
          }
          this.outcome = totalOutcome
        }, 250)
      },
      randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      toggleDiceRoller () {
        this.$store.commit('SET_DICE_ROLLER_ACTIVE', !this.isActive)
      }
    }
  }
</script>
<style lang="scss">
@import './Diceroller.scss';
</style>
