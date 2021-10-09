import VueCompositionAPI, { reactive, ref, toRefs } from '@vue/composition-api'
import Vue from 'vue'

Vue.use(VueCompositionAPI)
const accounts = ref([] as any[])

const state = reactive({
  accounts: accounts,
})

const useAccounts = () => {
  return { ...toRefs(state) }
}

export { useAccounts }
