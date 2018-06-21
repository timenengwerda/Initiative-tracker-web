import storage from '../storage'

const state = {
  defaultPlayerList: (storage.get('default-player-list')) ? JSON.parse(storage.get('default-player-list')) : [],
  attackOrder: []
}

const actions = {
  addToAttackOrder(context, dto) {
    context.commit('ADD_TO_ATTACK_ORDER', dto)
  },
  removeFromAttackOrder(context, dto) {
    context.commit('REMOVE_FROM_ATTACK_ORDER', dto)
  },
  resetAttackOrder(context, dto) {
    context.commit('RESET_ATTACK_ORDER')
  },
  setEnemyHealth(context, dto) {
    context.commit('SET_ENEMY_HEALTH', dto)
  },
  addPlayer(context, dto) {
    context.commit('ADD_PLAYER', { name: dto, type: 'player', initiative: 0 })
  },
  setActiveInAttackOrder(context, dto) {
    context.commit('SET_ACTIVE_IN_ATTACK_ORDER', dto)

    // its a group; find the players' index in the group
    if (dto.indexOfGroup) {
      context.commit('SET_ACTIVE_ENEMY_IN_ATTACK_ORDER', dto)
    }
  },
  removePlayerFromList(context, index) {
    context.commit('REMOVE_PLAYER_FROM_STORAGE_AND_LIST', index)
  },
  removeEnemyFromList(context, dto) {
    context.commit('REMOVE_ENEMY_FROM_LIST', dto)
  }
}

// mutations
const mutations = {
  ADD_TO_ATTACK_ORDER(state, dto) {
    state.attackOrder.push(dto)
  },
  ADD_PLAYER(state, dto) {
    state.defaultPlayerList.push(dto)
    storage.set('default-player-list', JSON.stringify(state.defaultPlayerList))
  },
  REMOVE_FROM_ATTACK_ORDER(state, dto) {
    state.attackOrder.splice(dto, 1)
  },
  RESET_ATTACK_ORDER(state) {
    state.attackOrder = []
  },
  SET_ENEMY_HEALTH(state, dto) {
    state.attackOrder[dto.groupIndex].players[dto.enemyIndex].health = dto.health
  },
  SET_ACTIVE_IN_ATTACK_ORDER(state, index) {
    if (state.attackOrder[index]) {
      state.attackOrder.forEach((order, loopIndex) => {
        // dont set the current index' active state
        if (index !== loopIndex) {
          order.active = false
        }

        // if theres a subtree with players(enemies) make them inactive
        if (order.players) {
          order.players.forEach(player => {
            player.active = false
          })
        }
      })

      state.attackOrder[index].active = !state.attackOrder[index].active
    }
  },
  SET_ACTIVE_ENEMY_IN_ATTACK_ORDER(state, dto) {
    if (state.attackOrder[dto.indexOfGroup]) {
      // set all enemy players' to inactive
      state.attackOrder[dto.indexOfGroup].players.forEach((order, loopIndex) => {
        if (dto.indexOfEnemy !== loopIndex) {
          order.active = false
        }
      })

      // set all the players' inactivity
      state.attackOrder.forEach((order, loopIndex) => {
        if (order.type === 'player') {
          order.active = false
        }
      })

      const theEnemy = state.attackOrder[dto.indexOfGroup].players[dto.indexOfEnemy]
      if (theEnemy) {
        theEnemy.active = !theEnemy.active
      }
    }
  },
  REMOVE_PLAYER_FROM_STORAGE_AND_LIST(state, playerIndex) {
    const thePlayerInAttackOrder = state.attackOrder[playerIndex]
    const thePlayerInDefaultList = state.defaultPlayerList.findIndex(player => player.name === thePlayerInAttackOrder.name)
    if (thePlayerInDefaultList >= 0) {
      state.defaultPlayerList.splice(thePlayerInDefaultList, 1)
      let itemToSave = ''
      if (state.defaultPlayerList.length) {
        itemToSave = JSON.stringify(state.defaultPlayerList)
      }

      storage.set('default-player-list', itemToSave)
    }
  },
  REMOVE_ENEMY_FROM_LIST(state, dto) {
    state.attackOrder[dto.groupIndex].players.splice(dto.enemyIndex, 1)

    // if no players are left in this group; remove the group from the attackorder
    if (state.attackOrder[dto.groupIndex].players.length === 0) {
      state.attackOrder.splice(dto.groupIndex, 1)
    }
  }
}

import _ from 'lodash'

const getters = {
  attackOrder: (state) => {
    // return state.attackOrder
    // console.log(_.orderBy(state.attackOrder, ['initiative']))
    return _.orderBy(state.attackOrder, ['initiative'], ['desc'])
  },
  players: state => state.defaultPlayerList,
}

export default {
  state,
  getters,
  actions,
  mutations
}
