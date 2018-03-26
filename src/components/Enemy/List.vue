<template>
  <li class="initiative__list__enemy-list" v-if="enemyIsAlive" @click.prevent="setActiveInAttackOrder({indexOfGroup, indexOfEnemy})">
    <div class="enemy-list">
      <div class="enemy-list__info">
        <h2 class="enemy-list__info__title">{{ enemy.name }}</h2>
        <div class="enemy-list__buffs">
          <div class="form-group">
            <input :id="`${indexOfGroup}-buff`" class="form-control" :checked="hasBuff" v-model="hasBuff" type="checkbox">
            <label :for="`${indexOfGroup}-buff`" @click.prevent="hasBuff = !hasBuff; hasDebuff = false">
              Buffed
            </label>
          </div>

          <div class="form-group">
            <input :id="`${indexOfGroup}-debuff`" class="form-control" :checked="hasDebuff" v-model="hasDebuff" type="checkbox">
            <label :for="`${indexOfGroup}-debuff`" @click.prevent="hasDebuff = !hasDebuff; hasBuff = false">
              Debuffed
            </label>
          </div>
        </div>
      </div>
      <div class="enemy-list__damage">
        <form @submit.prevent="updateHealth" class="enemy-list__damage-form">
          <div class="form-group">
            <input type="text" class="form-control" placeholder="DMG" v-model="decreaseHealthBy" autofocus>
          </div>
        </form>
        <div class="enemy-list__damage-form__health">{{ enemy.health }} / {{ enemy.maxHealth }}</div>
      </div>
    </div>
  </li>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: 'EnemyList',
    props: ['indexOfEnemy', 'indexOfGroup'],
    data () {
      return {
        decreaseHealthBy: '',
        hasBuff: false,
        hasDebuff: false
      }
    },
    computed: {
      enemyIsAlive () {
        return (this.enemy.health > 0)
      },
      enemy () {
        return this.$store.getters.attackOrder[this.indexOfGroup].players[[this.indexOfEnemy]]
      }
    },
    methods: {
      updateHealth () {
        const newHealth = this.enemy.health - this.decreaseHealthBy

        this.setEnemyHealth({groupIndex: this.indexOfGroup, enemyIndex: this.indexOfEnemy, health: newHealth})
        this.decreaseHealthBy = ''

        if (newHealth <= 0) {
          this.removeEnemy()
        }
      },
      removeEnemy () {
        this.removeEnemyFromList({groupIndex: this.indexOfGroup, enemyIndex: this.indexOfEnemy})
      },
      ...mapActions({
        setEnemyHealth: 'setEnemyHealth',
        setActiveInAttackOrder: 'setActiveInAttackOrder',
        removeEnemyFromList: 'removeEnemyFromList'
      })
    }
  }
</script>
<style lang="scss">
@import 'EnemyList.scss';
</style>
