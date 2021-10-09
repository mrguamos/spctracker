import VueCompositionAPI, { reactive, ref, toRefs } from '@vue/composition-api'
import Vue from 'vue'
import { client, lpQuery } from '../chain/graphql'
import gql from 'graphql-tag'
import { useQuery, provideApolloClient } from '@vue/apollo-composable'

Vue.use(VueCompositionAPI)
const spuUsd = ref(0)
provideApolloClient(client)
const state = reactive({
  spuUsd: spuUsd,
})

const usePrices = () => {
  const getPrices = () => {
    return useQuery(
      gql`
        ${lpQuery}
      `,
      null,
      {
        pollInterval: 5000,
      }
    )

    // return client.watchQuery({
    //   query: gql`
    //     ${lpQuery}
    //   `,
    //   pollInterval: 5000,
    //   fetchPolicy: 'no-cache',
    // })
  }

  return { ...toRefs(state), getPrices }
}

export { usePrices }
