<template>
  <div>
    <v-row justify="center">
      <v-col cols="6" sm="6" md="4">
        <Card :content="totalSpu" :title="'Total SPU'" />
      </v-col>
      <v-col cols="6" sm="6" md="4">
        <Card :content="`${totalSpuUsd}`" :title="'Total SPU / USD'" />
      </v-col>
      <v-col cols="6" sm="6" md="4">
        <Card :content="`$${spuUsd}`" :title="'SPU / USD'" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  inject,
  reactive,
  watch,
} from '@vue/composition-api'
import Card from './Card.vue'
import axios from 'axios'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { useAccounts } from '../store/accounts'
import { usePrices } from '../store/prices'

export default defineComponent({
  components: { Card },
  setup() {
    const lpSpu = inject('lpSpu') as Contract
    const lpBnb = inject('lpBnb') as Contract
    const web3 = inject('web3') as Web3
    const { accounts } = useAccounts()
    const { spuUsd, getPrices } = usePrices()

    const totalSpu = computed(() => {
      let total = 0
      accounts.value.map((item) => {
        if (!isNaN(item.walletSpu)) {
          total = total + item.walletSpu
        }
      })
      return total.toString()
    })

    const totalSpuUsd = computed(() => {
      return (Number(totalSpu.value) * Number(spuUsd.value)).toLocaleString(
        'en-US',
        {
          style: 'currency',
          currency: 'USD',
        }
      )
    })

    async function getSpuUsd0x() {
      try {
        const res: any = await axios.get(
          `https://bsc.api.0x.org/swap/v1/quote?buyToken=0xe9e7cea3dedca5984780bafc599bd69add087d56&sellToken=0x7f60375245cbf30a4f1ffd1278e3601fadca2c4d&sellAmount=1000000000`
        )
        spuUsd.value = Number(Number(res.data.price).toFixed(4))
      } catch (error) {
        //
      } finally {
        setTimeout(getSpuUsd0x, 5000)
      }
    }
    //getSpuUsd0x()

    // const { result } = getPrices()
    // watch(result, (result, prevResult) => {
    //   if (result) {
    //     spuUsd.value = Number(
    //       (
    //         result.ethereum.spuBnb[0].quotePrice *
    //         result.ethereum.bnbBusd[0].quotePrice
    //       ).toFixed(4)
    //     )
    //   }
    // })

    return {
      totalSpu,
      totalSpuUsd,
      spuUsd,
    }
  },
})
</script>
