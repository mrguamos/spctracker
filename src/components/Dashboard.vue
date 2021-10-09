<template>
  <div>
    <v-row justify="center">
      <v-col cols="6" sm="6" md="3">
        <Card :content="totalSpu" :title="'Total SPU'" />
      </v-col>
      <v-col cols="6" sm="6" md="3">
        <Card :content="`${totalSpuUsd}`" :title="'Total SPU / USD'" />
      </v-col>
      <v-col cols="6" sm="6" md="3">
        <Card :content="`$${spuUsd}`" :title="'SPU / USD'" />
      </v-col>
      <v-col cols="6" sm="6" md="3">
        <Card :content="rpBalance" :title="'Rewards Pool'" />
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
import { rpAddress } from '../chain/chain'

export default defineComponent({
  components: { Card },
  setup() {
    const web3 = inject('web3') as Web3
    const spu = inject('spu') as Contract
    const { accounts } = useAccounts()
    const { spuUsd, getPrices } = usePrices()
    const rpBalance = ref('0')

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

    async function getRPBalance() {
      try {
        rpBalance.value = (
          (await spu.methods.balanceOf(rpAddress).call()) / Math.pow(10, 9)
        ).toLocaleString('en-US', { minimumFractionDigits: 9 })
      } catch (error) {
        console.log(error)
      } finally {
        setTimeout(getRPBalance, 5000)
      }
    }

    getRPBalance()

    return {
      totalSpu,
      totalSpuUsd,
      spuUsd,
      rpBalance,
    }
  },
})
</script>
