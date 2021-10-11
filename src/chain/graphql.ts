import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client/core'
import VueCompositionAPI, { reactive, ref, toRefs } from '@vue/composition-api'
import Vue from 'vue'
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist'

Vue.use(VueCompositionAPI)

const state = reactive({
  initializing: true,
})

const useGraphQL = () => {
  return { ...toRefs(state) }
}

export const API_KEY = 'BQYvhnv04csZHaprIBZNwtpRiDIwEIW9'
export const url = 'https://graphql.bitquery.io/'

const httpLink = createHttpLink({
  uri: url,
  headers: {
    'X-API-KEY': API_KEY,
  },
})

// Cache implementation
const cache = new InMemoryCache()

export let client: any

persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
}).then(() => {
  client = new ApolloClient({
    link: httpLink,
    cache,
  })
  state.initializing = false
})

export const lpQuery = `query GetSpuUsd($time: ISO8601DateTime!, $date: ISO8601DateTime!){
  ethereum(network: bsc) {
    bnbBusd: dexTrades(
      baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
      quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}
      exchangeName: {in: ["Pancake v2"]}
      options: {desc: ["block.height", "transaction.index"], limit: 1}
      time: {between: [$date, $time]}
    ) {
      block {
        height
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
      }
      transaction {
        index
      }
      baseCurrency {
        symbol
      }
      quoteCurrency {
        symbol
      }
      quotePrice
    }
    spuBnb: dexTrades(
      baseCurrency: {is: "0x7f60375245cbf30a4f1ffd1278e3601fadca2c4d"}
      quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
      exchangeName: {in: ["Pancake v2"]}
      options: {desc: ["block.height", "transaction.index"], limit: 1}
      time: {between: [$date, $time]}
    ) {
      block {
        height
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
      }
      transaction {
        index
      }
      baseCurrency {
        symbol
      }
      quoteCurrency {
        symbol
      }
      quotePrice
    }
  }
}
`
export { useGraphQL }
