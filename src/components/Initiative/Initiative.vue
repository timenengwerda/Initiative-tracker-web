<template>
  <div class="initiative grid">
    <div class="row">
      <div class="col initiative__title-col">
        <h1><i class="fab fa-d-and-d"></i> Initiative tracker</h1>
        <a href="#" class="button button--link" style="margin-left: auto;" @click.prevent="showOrderingList">Set Initiative order</a>

        <modal name="initiative-ordering-modal" height="auto" :scrollable="true">
          <form @submit.prevent="setInitiativeOrder">
              <h2>Set the initiative for each PC and Enemy</h2>
              <ul class="initiative-ordering-modal">
                <li v-for="item in initiativeOrderingList" class="initiative-ordering-modal__item">
                  <span class="initiative-ordering-modal__item__title" v-if="item.type === 'player'">{{item.name}}</span>
                  <span class="initiative-ordering-modal__item__title" v-else>{{item.players[0].name.replace('#1', '')}}</span>

                  <input type="number" placeholder="#" v-model="item.initiative" class="form-control initiative-ordering-modal__item__form-control">
                  <a class="initiative-ordering-modal__item__roll-button" href="#" v-if="item.type !== 'player'" @click.prevent="rollForInitiative(item)">roll</a>
                  <span class="initiative-ordering-modal__item__roll-button" v-else>&nbsp;</span>
                </li>
              </ul>
              <button type="submit" @click.prevent="setInitiativeOrder" class="button button--primary">Set order</button>
              <a href="#" @click.prevent="hideOrderingList" class="button button--link">Cancel</a>
            </form>
        </modal>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <draggable :element="'ul'" :options="{animation: 100, handle: '.dragger'}" class="sortable initiative__list" ref="">
          <template v-for="(order, orderIndex) in attackOrder">
            <player-list
              @deleted="resetInitiative"
              :key="orderIndex"
              :indexOfPlayer="orderIndex"
              v-if="order.type === 'player'"
              class="draggable" />
            <li class="initiative__list__item enemy draggable" v-if="order.type === 'group'">
              <div class="dragger">
                <i class="fa fa-arrows-alt enemy__dragger"></i>
              </div>
              <ul class="initiative__list" style="flex: 1;">
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
        </draggable>
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
  import draggable from 'vuedraggable'
  import _ from 'lodash'

  export default {
    name: 'initiative',
    components: {
      EnemyList,
      PlayerList,
      EnemyForm,
      draggable
    },
    data () {
      return {
        enemyFormOpen: false,
        addNewPlayerFormOpen: false,
        newPlayerName: '',
        initiativeOrderingList: [] // a clone of attackorder but with the purpose of setting initiative and ordering the actual attackOrder
      }
    },
    watch: {
      'attackOrder': function (a) {
        // every time the attack order changes. Update the initiativeOrderingList
        this.initiativeOrderingList = _.cloneDeep(a)
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
      // this.addSortables()
    },
    methods: {
      rollForInitiative (item) {
        const initiative = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
        item.initiative = initiative
      },
      showOrderingList () {
        // this.resetInitiative()
        this.$modal.show('initiative-ordering-modal')
      },
      hideOrderingList () {
        this.$modal.hide('initiative-ordering-modal')
      },
      openPlayerForm () {
        this.addNewPlayerFormOpen = true
        this.$nextTick(() => this.$refs.newPlayerName.focus())
      },
      resetInitiative () {
        this.resetAttackOrder()
        this.players.forEach(player => {
          this.addToAttackOrder({name: player.name, type: 'player', active: false, initiative: 0})
        })
      },
      setInitiativeOrder () {
        this.resetAttackOrder()
        this.initiativeOrderingList.forEach(player => {
          if (player.type === 'player') {
            this.addToAttackOrder({name: player.name, type: player.type, active: player.active, initiative: parseInt(player.initiative)})
          } else {
            this.addToAttackOrder({name: player.name, players: player.players, type: player.type, active: player.active, initiative: parseInt(player.initiative)})
          }
        })

        this.hideOrderingList()
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
.sortable-ghost {
  overflow: hidden;
  height: 45px;
  background: rgba($black, .3);
}

.sortable-drag {
  overflow: hidden;
  max-height: 125px;
  background: $white;
  opacity: .99;
  // beats the shit out of me:
  // But when I put the opacity on 1 the enemy item shows too much of the rest of the dom
}

.v--modal-box {
  padding: 20px;
}
.modal-content {
  height: 100%;
  overflow: auto;
}
</style>
