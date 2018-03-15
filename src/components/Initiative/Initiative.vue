<template>
  <div class="initiative grid">
    <div class="row">
      <div class="col initiative__title-col">
        <h1><i class="fab fa-d-and-d"></i> Initiative tracker</h1>
        <a href="#" class="button button--link" style="margin-left: auto;" @click.prevent="resetInitiative">Reset initiative</a>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <ul class="sortable initiative__list" ref="sortableOrder">
          <template v-for="(order, orderIndex) in attackOrder">
            <player-list
              @deleted="resetInitiative"
              :key="orderIndex"
              :indexOfPlayer="orderIndex"
              v-if="order.type === 'player' " />
            <li class="initiative__list__item enemy" v-if="order.type === 'group'">
              <i class="fa fa-arrows-alt enemy__dragger"></i>
              <ul class="initiative__list">
                  <enemy-list
                  :key="index"
                  :indexOfGroup="orderIndex"
                  :indexOfEnemy="index"
                  @killed="enemyKilled"
                  v-for="(player, index) in order.players"
                  />
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col text--center">
        <a href="#" @click.prevent="openPlayerForm" v-if="!addNewPlayerFormOpen">Add your players</a>
      </div>
      <div class="col" v-if="addNewPlayerFormOpen">
        <div class="card">
          <div class="card__body">
            <h2 class="card__title">
              New player
            </h2>
            <form @submit.prevent="addNewPlayer">
              <div class="form-group">
                <input type="text" v-model="newPlayerName" class="form-control" ref="newPlayerName">
              </div>
              <div class="button-group mt-2">
                <button type="submit" class="button button--primary">Add</button>
                <a href="#" @click.prevent="addNewPlayerFormOpen = false" class="button button--link">I'm done</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col text--center" v-if="!enemyFormOpen">
        <button class="button button--primary" @click.prevent="enemyFormOpen = true">Add enemies to tracker</button>
      </div>
      <enemy-form @close="enemyFormOpen = false" v-if="enemyFormOpen" :enemy-form-open="enemyFormOpen" />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import EnemyList from '@/components/Enemy/List'
  import EnemyForm from '@/components/Enemy/Form'
  import PlayerList from '@/components/Player/List'
  import jQuery from 'jquery'
  import sortable from 'jquery-ui-sortable-npm'

  export default {
    name: 'initiative',
    components: {
      EnemyList,
      PlayerList,
      EnemyForm
    },
    data () {
      return {
        enemyFormOpen: false,
        addNewPlayerFormOpen: false,
        newPlayerName: '',
      }
    },
    computed: {
      ...mapGetters({
        players: 'players',
        attackOrder: 'attackOrder'
      })
    },
    mounted () {
      this.resetInitiative()
      this.addSortables()
    },
    methods: {
      openPlayerForm () {
        this.addNewPlayerFormOpen = true
        this.$nextTick(() => this.$refs.newPlayerName.focus())
      },
      resetInitiative () {
        this.resetAttackOrder()
        this.players.forEach(player => {
          this.addToAttackOrder({name: player.name, type: 'player', active: false})
        })
      },
      addSortables () {
        jQuery( this.$refs.sortableOrder ).sortable({
          // forcePlaceholderSize: true,
          placeholder: 'sortable-ph',
          delay: 150
        })
      },
      enemyKilled (index) {
        this.removeFromAttackOrder(index)
      },
      addNewPlayer () {
        this.addPlayer(this.newPlayerName)
        this.addToAttackOrder({name: this.newPlayerName, type: 'player', active: false})

        this.newPlayerName = ''
      },
      ...mapActions({
        addToAttackOrder: 'addToAttackOrder',
        removeFromAttackOrder: 'removeFromAttackOrder',
        resetAttackOrder: 'resetAttackOrder',
        addPlayer: 'addPlayer',
        setActiveInAttackOrder: 'setActiveInAttackOrder'
      })
    }
  }
</script>

<style lang="scss">
@import './Initiative';
</style>
