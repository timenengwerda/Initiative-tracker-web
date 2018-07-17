import spells from '../spells'

const state = {
  showOnlyPhbSpells: false,
  spells
}

const actions = {

}

// mutations
const mutations = {
  TOGGLE_PHB_SPELLS(context, dto) {
    state.showOnlyPhbSpells = dto
  }
}

const getters = {
  showOnlyPhbSpells: state => state.showOnlyPhbSpells,
  spells: state => {
    if (state.showOnlyPhbSpells) {
      return state.spells.filter(spell => {
        return (spell.page.indexOf('phb') === 0) ? spell : false
      })
    }

    return _.sortBy(state.spells, ['level']); // sort by 1stlevel, 2ndlevel etc.etc. cantrip
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
