<template>
  <div>
    <v-alert
      type="warning"
      color="primary darken-4"
      elevation="24"
      dismissible
      class="text-center"
    >
      This covers the latest 1,000 transactions of your account. If it's not on
      the list, try next page.
    </v-alert>
    <v-card class="mx-auto">
      <v-card-title>Combat History</v-card-title>
      <v-card-text>
        <v-data-table
          disable-sort
          :loading="getClaimHistoryLoading"
          :headers="claimHistoryHeaders"
          :items="claims"
          disable-pagination
          hide-default-footer
          item-key="hash"
        >
          <template v-slot:[`item.hash`]="{ item }">
            <div class="font-weight-bold short-address">{{ item.hash }}</div>
          </template>
          <template v-slot:[`item.spuUsd`]="{ item }">
            {{ item.spuUsd.value }}
          </template>
        </v-data-table>
        <div class="text-center pt-2">
          <v-pagination
            v-model="page"
            :total-visible="10"
            :length="pageCount"
            @input="getClaimHistory()"
          ></v-pagination>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
  inject,
  computed,
} from '@vue/composition-api'
import axios from 'axios'
import { SPU, rpAddress } from '../chain/chain'
import Web3 from 'web3'
import { ethers } from 'ethers'
import { usePrices } from '../store/prices'
import { client, lpQuery } from '../chain/graphql'
import gql from 'graphql-tag'

export default defineComponent({
  setup() {
    const web3 = inject('web3') as Web3
    const vm: any = getCurrentInstance()
    const { spuUsd, getPrices } = usePrices()
    const claims = ref([] as any)
    const ISpu = new ethers.utils.Interface(SPU)
    const page = ref(1)
    const pageCount = ref(100)
    const getClaimHistoryLoading = ref(false)
    const encodedRPAddress = web3.eth.abi.encodeParameter('address', rpAddress)
    const claimHistoryHeaders = [
      { text: 'Txn Hash', value: 'hash' },
      { text: 'SPU', value: 'spu' },
      { text: 'Current SPU / USD', value: 'spuUsd' },
      { text: 'Transaction SPU / USD ', value: 'prevSpuUsd' },
      { text: 'Date', value: 'date' },
    ]

    async function getClaimHistory() {
      claims.value = []
      getClaimHistoryLoading.value = true
      const response: any = await axios.get(
        `https://api.bscscan.com/api?module=account&action=txlist&address=${vm.proxy.$route.params.address}&sort=desc&apikey=8E3SKX2J341PIMG1NKF2QS1GA51DPWX27S&page=${page.value}&offset=1000`
      )
      const result = response.data.result
      if (result) {
        const transactions = await Promise.all(
          result.map(async (r: any) => {
            if (r.to === '0x7f60375245cbf30a4f1ffd1278e3601fadca2c4d') {
              const transaction: any = await web3.eth.getTransactionReceipt(
                r.hash
              )
              const tx: any = await web3.eth.getTransaction(r.hash)
              const t: any = {}
              t.hash = r.hash
              t.date = new Date(r.timeStamp * 1000).toLocaleString()
              if (transaction.logs) {
                try {
                  for (const log of transaction.logs) {
                    if (
                      log.topics[0] ===
                        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' &&
                      log.topics[1] === encodedRPAddress
                    ) {
                      const data = ISpu.parseLog(log)
                      const { value } = data.args
                      t.spu = value / Math.pow(10, 9)
                      t.spuUsd = computed(() => {
                        return (t.spu * spuUsd.value).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        })
                      })

                      const isoDate = new Date(r.timeStamp * 1000).toISOString()
                      const result: any = await client.query({
                        query: gql`
                          ${lpQuery}
                        `,
                        variables: { time: isoDate },
                      })
                      const spuBnb = result.data.ethereum.spuBnb[0]?.quotePrice
                      const bnbBusd =
                        result.data.ethereum.bnbBusd[0]?.quotePrice
                      const prevSpuUsd = spuBnb * bnbBusd
                      t.prevSpuUsd = (t.spu * prevSpuUsd).toLocaleString(
                        'en-US',
                        {
                          style: 'currency',
                          currency: 'USD',
                        }
                      )
                      return t
                    }
                  }
                } catch (error) {
                  console.log(error)
                }
              }
            }
          })
        )

        claims.value = transactions.filter((t) => {
          if (t) return t
        })
      }
      getClaimHistoryLoading.value = false
    }

    getClaimHistory()
    return {
      claims,
      page,
      pageCount,
      claimHistoryHeaders,
      getClaimHistoryLoading,
      getClaimHistory,
    }
  },
})
</script>

<style></style>
