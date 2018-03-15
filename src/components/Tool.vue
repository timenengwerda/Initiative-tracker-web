<template>
  <div class="tracker-wrapper">
    <initiative/>
    <dice-roller/>
  </div>
</template>

<script>
  import Initiative from '@/components/Initiative/Initiative'
  import DiceRoller from '@/components/DiceRoller/DiceRoller'

  export default {
    name: 'tool',
    components: {
      Initiative,
      DiceRoller
    },
    data () {
      return {}
    },
    methods: {
    }
  }
</script>
<style>
  .tracker-wrapper {
    margin: 0 auto;
    max-width: 500px;
  }
</style>
