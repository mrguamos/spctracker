<template>
  <div>
    <v-card class="mx-auto">
      <v-card-title>Accounts</v-card-title>
      <v-card-text>
        <v-row justify="center">
          <v-col cols="12" md="5">
            <v-text-field
              v-model="account.address"
              label="Address"
              clearable
              required
              name="address"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="5">
            <v-text-field
              v-model="account.name"
              label="Account Name"
              clearable
              required
              name="name"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="4">
            <v-btn block color="primary" @click="addAccount()"> Submit </v-btn>
          </v-col>
        </v-row>
        <v-data-table
          disable-sort
          class="pt-10 table-cursor"
          :loading="accountsLoading"
          :headers="accountHeaders"
          :items="accounts"
          disable-pagination
          hide-default-footer
          item-key="address"
        >
          <template v-slot:[`item.address`]="{ item }">
            <div class="font-weight-bold short-address">{{ item.address }}</div>
          </template>
          <template v-slot:[`item.spuUsd`]="{ item }">
            {{
              item.spuUsd.value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })
            }}
          </template>
          <template v-slot:[`item.action`]="{ item, index }">
            <div class="text-no-wrap">
              <v-btn
                color="primary"
                outlined
                @click.stop.prevent="removeAccount(item, index)"
              >
                <v-icon color="grey">mdi-delete</v-icon>
              </v-btn>
              <v-btn
                class="ml-1"
                color="primary"
                outlined
                @click.stop.prevent="refreshAccount(item, index)"
              >
                <v-icon color="grey">mdi-refresh</v-icon>
              </v-btn>
              <router-link :to="`/history/${item.address}`">
                <v-btn class="ml-1" color="primary" outlined>
                  <v-icon color="grey">mdi-receipt</v-icon>
                </v-btn>
              </router-link>
            </div>
          </template>
        </v-data-table>
      </v-card-text></v-card
    >
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  inject,
  ref,
  computed,
} from '@vue/composition-api'
import { useAccounts } from '../store/accounts'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { usePrices } from '../store/prices'

export default defineComponent({
  setup() {
    const { spuUsd } = usePrices()
    const accountHeaders = [
      { text: 'Address', value: 'address' },
      { text: 'Name', value: 'name' },
      { text: 'SPU', value: 'walletSpu' },
      { text: 'SPU / USD', value: 'spuUsd' },
      { text: 'Action', value: 'action' },
    ]

    const web3 = inject('web3') as Web3
    const spu = inject('spu') as Contract
    const snackbar = ref(false)
    const accountsLoading = ref(false)
    const account = reactive({
      name: '',
      address: '',
    })
    const { accounts } = useAccounts()
    const storedAccounts: any[] =
      JSON.parse(localStorage.getItem('addresses')!) || []

    const fetchAccounts = async () => {
      accounts.value = []
      accountsLoading.value = true
      const accs = await Promise.all(
        storedAccounts.map(async (item) => {
          return await fetchAccount(item)
        })
      )
      accounts.value = accs
      accountsLoading.value = false
      //setTimeout(refreshAccounts, 30000)
    }

    async function fetchAccount(item: any, index: number | null = null) {
      try {
        let walletSpu = Number(await spu.methods.balanceOf(item.address).call())
        walletSpu /= Math.pow(10, 9)
        item.walletSpu = walletSpu

        item.spuUsd = computed(() => {
          return item.walletSpu * spuUsd.value
        })

        return item
      } catch (error) {
        console.log('Invalid Address', error)
      }
    }

    async function addAccount() {
      if (web3.utils.isAddress(account.address)) {
        const exists = accounts.value.some(
          (a) =>
            String(a['address']).toLowerCase() === account.address.toLowerCase()
        )
        if (!exists) {
          accountsLoading.value = true
          const acc = await fetchAccount({ ...account })
          accounts.value.push(acc)
          accountsLoading.value = false
          const sa = accounts.value.map((a) => {
            return { address: a.address, name: a.name }
          })
          localStorage.setItem('addresses', JSON.stringify(sa))
        }
        account.name = ''
        account.address = ''
      } else {
        snackbar.value = true
      }
    }

    async function removeAccount(item: any, index: number) {
      try {
        await item.subscription.unsubscribe()
        console.log('Unsubscribed', item.address)
      } catch (error) {
        console.log(error)
      }

      accounts.value.splice(index, 1)
      const sa = accounts.value.map((a) => {
        return { address: a.address, name: a.name }
      })
      localStorage.setItem('addresses', JSON.stringify(sa))
    }

    async function refreshAccount(item: any, index: number) {
      accountsLoading.value = true
      const account = await fetchAccount(item, index)
      accounts.value[index] = account
      accountsLoading.value = false
    }

    async function init() {
      fetchAccounts()
    }
    init()

    return {
      account,
      accounts,
      addAccount,
      accountHeaders,
      accountsLoading,
      removeAccount,
      refreshAccount,
    }
  },
})
</script>

<style></style>
