<template>
  <div class="spell-finder">
    <modal name="spell-finder__modal" height="auto" width="90%" :scrollable="true" :adaptive="true" :maxWidth="700">
      <div class="spell-finder__header">
        <h2 class="spell-finder__title">Find spells</h2>
        <!--<div class="spell-finder__phb-toggle">
          <input id="phb_check" type="checkbox" v-model="onlyPhbSpells">
          <label for="phb_check">Only PHB spells</label>
        </div>-->
        <div class="spell-finder__phb-toggle">
          <a href="#" @click.prevent="hideSpellFinderModal">
            <i class="fa fa-times"></i>
          </a>
        </div>
      </div>
      <div class="autocomplete-search" v-if="modalIsOpen">
        <div class="form-text-select">
          <input type="text" placeholder="Search for a spell" v-model="searchWord" class="form-control form-text-select__input">
          <select v-model="classToSearch" class="form-control form-text-select__select">
            <option value="">Choose class</option>
            <option value="Bard">Bard</option>
            <option value="Cleric">Cleric</option>
            <option value="Druid">Druid</option>
            <option value="Paladin">Paladin</option>
            <option value="Ranger">Ranger</option>
            <option value="Ritual Caster">Ritual Caster</option>
            <option value="Sorcerer">Sorcerer</option>
            <option value="Wizard">Wizard</option>
          </select>
        </div>
        <div class="autocomplete-search__results spell-finder__search-result">
          <spell-collapse :spell="spell" v-for="(spell, index) in filteredSpells" :key="index" />
        </div>
      </div>

      <div class="text--center" style="margin-top: 1rem;">
        <a href="#" @click.prevent="hideSpellFinderModal" class="button button--primary">Close</a>
      </div>
    </modal>

    <i class="icon icon--spell-finder fas fa-magic"  @click.prevent="showSpellFinderModal"></i>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import SpellCollapse from '@/components/SpellFinder/SpellCollapse'
  export default {
    name: 'SpellFinder',
    components: {
      SpellCollapse
    },
    data () {
      return {
        modalIsOpen: false,
        searchWord: '',
        classToSearch: ''
      }
    },
    computed: {
      filteredSpells () {
        let spells = []
        let definitiveSpells = []

        if (this.searchWord.length > 1) {
          spells = this.spells.filter(spell => {
            const spellName = spell.name.toLowerCase()
            const searchWord = this.searchWord.toLowerCase()

            if (spellName.indexOf(searchWord) > -1) {
              return spell.name
            }

            return false
          })
        }

        if (this.classToSearch !== '') {
          // if searchWord isnt entered get all the spells to filter
          // if the searchWord IS used, then we already have a spells array
          if (this.searchWord.length < 2) {
            spells = this.spells
          }

          definitiveSpells = spells.filter(spell => {
            return (spell.class.indexOf(this.classToSearch) >= 0) ? spell : false
          })

        } else {
          definitiveSpells = spells
        }

        return definitiveSpells
      },
      onlyPhbSpells: {
        get () {
          return this.$store.state.spellfinder.showOnlyPhbSpells
        },
        set (value) {
          this.$store.commit('TOGGLE_PHB_SPELLS', value)
        }
      },
      ...mapGetters(['spells'])
    },
    methods: {
      showSpellFinderModal () {
        this.modalIsOpen = true
        this.searchWord = ''
        this.$modal.show('spell-finder__modal')
      },
      hideSpellFinderModal () {
        this.modalIsOpen = false
        this.$modal.hide('spell-finder__modal')
      },
    }
  }
</script>
<style lang="scss">
@import './SpellFinder';

.icon--spell-finder {
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 51px;
}
</style>
