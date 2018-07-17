<template>
  <div class="search-collapse"  :class="{ 'is--uncollapsed' : !isCollapsed } ">
      <div class="search-collapse__title" @click.prevent="isCollapsed = !isCollapsed">
        <div class="spell-finder__search-result__name">
          <i class="fa fa-chevron-down icon icon--collapsed"></i>
          <i class="fa fa-chevron-up icon icon--uncollapsed"></i>
          {{ spell.name }}
          <small style="font-size: 9px; margin-left: .25rem;">({{spell.level }})</small>
          <span v-if="spell.ritual !== 'no'" class="spell-symbol">R</span>
          <span v-if="spell.concentration !== 'no'" class="spell-symbol">C</span>
        </div>
        <div class="spell-finder__search-result__quickbar" v-if="spell.components">
          {{ spell.components }}<br>
          <small>{{ spell.class }}</small>
        </div>
      </div>
      <div class="search-collapse__item" v-if="!isCollapsed">
        <div v-html="spell.desc"></div>
        <div v-if="spell.material">
          <strong>Material</strong><br>
          <p>{{ spell.material }}</p>
        </div>
        <div v-if="spell.domains">
          <strong>Domains</strong>: {{ spell.domains }}
        </div>
        <div v-if="spell.casting_time">
          <strong>Casting time</strong>: {{ spell.casting_time }}
        </div>
        <div v-if="spell.duration">
          <strong>Duration</strong>: {{ spell.duration }}
        </div>
        <div v-if="spell.school">
          <strong>School</strong>: {{ spell.school }}
        </div>
        <div v-if="spell.range">
          <strong>Range</strong>: {{ spell.range }}
        </div>
        <div v-if="spell.page">
          <br>
          <strong>Source</strong>: {{ spell.page }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SpellCollapse',
    props: ['spell'],
    data () {
      return {
        isCollapsed: true
      }
    },
    methods: {

    }
  }
</script>
