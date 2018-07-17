<template>
  <li class="initiative__list__player initiative__list__item player" :class="{'active': player.active}" @click.prevent="setActive()">
    <span class="player__title">{{ player.name }}</span>
    <a href="#" @click.prevent="removePlayer()">
      <i class="fa fa-trash"></i>
    </a>
  </li>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: 'PlayerList',
    props: ['indexOfPlayer'],
    computed: {
      player () {
        return this.$store.getters.attackOrder[this.indexOfPlayer]
      }
    },
    methods: {
      setActive () {
        this.setActiveInAttackOrder(this.indexOfPlayer)
      },
      removePlayer () {
        this.removePlayerFromList(this.indexOfPlayer)
        this.$emit('deleted')
      },
      ...mapActions({
        setActiveInAttackOrder: 'setActiveInAttackOrder',
        removePlayerFromList: 'removePlayerFromList'
      })
    },
  }
</script>
<style lang="scss">
@import './Player';
</style>
