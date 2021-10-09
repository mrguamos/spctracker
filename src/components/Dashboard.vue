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

    return {
      totalSpu,
      totalSpuUsd,
      spuUsd,
    }
  },
})
</script>
