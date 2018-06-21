<template>
  <div class="col" v-if="enemyFormOpen">
    <div class="card">
      <div class="card__body">
        <h2 class="card__title">
          New enemies
        </h2>
        <form @submit.prevent="pushEnemy">
          <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control" v-model="newEnemy" ref="enemyName">
          </div>
          <div class="form-group row">
            <div class="col-6">
              <label>Health</label>
              <input type="number" class="form-control" v-model="newEnemyHealth">
            </div>
            <div class="col-6">
              <label>Amount</label>
              <input type="number" class="form-control" v-model="amountOfEnemies">
            </div>
          </div>
          <button type="submit" :disabled="!maySubmitEnemyForm" class="button button--primary">Add</button>
          <button class="button button--link mt-2" @click.prevent="resetEnemyForm">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: 'EnemyForm',
    props: ['enemyFormOpen'],
    data () {
      return {
        newEnemy: '',
        newEnemyHealth: 0,
        amountOfEnemies: 1
      }
    },
    computed: {
      maySubmitEnemyForm () {
        return (this.newEnemyHealth > 0 && this.newEnemy !== '' && this.amountOfEnemies > 0)
      },
    },
    created () {
      this.$nextTick(() => this.$refs.enemyName.focus())
    },
    methods: {
      pushEnemy () {
        if (this.newEnemyHealth > 0 && this.newEnemy !== '' && this.amountOfEnemies > 0) {
          let enemyGroup = {
            type: 'group',
            players: [],
            initiative: 0
          }

          for (let i = 0; i < this.amountOfEnemies; i++) {
            enemyGroup.players.push({
              name: `#${i + 1} ${this.newEnemy}`,
              type: 'enemy',
              maxHealth: this.newEnemyHealth,
              health: this.newEnemyHealth,
              active: false
            })
          }

          this.addToAttackOrder(enemyGroup)

          this.resetEnemyForm()
        }
      },
      resetEnemyForm () {
        this.newEnemy = ''
        this.newEnemyHealth = 0
        this.amountOfEnemies = 1

        this.$emit('close')
      },
      ...mapActions({
        addToAttackOrder: 'addToAttackOrder'
      })
    }
  }
</script>
