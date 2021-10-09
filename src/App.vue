<template>
  <v-app>
    <v-app-bar app color="black" dark>
      <div class="d-flex align-center">
        <router-link to="/">
          <v-img
            alt="Logo"
            contain
            src="/img/spaceport.png"
            transition="scale-transition"
            width="120"
          />
        </router-link>
      </div>
    </v-app-bar>
    <v-main>
      <VuePullRefresh :on-refresh="onRefresh" :config="config">
        <v-container class="py-16" fluid>
          <router-view />
        </v-container>
      </VuePullRefresh>
    </v-main>
    <v-footer color="primary lighten-1" padless>
      <v-row justify="center" no-gutters>
        <v-col class="primary lighten-2 py-4 text-center white--text" cols="12">
          {{ new Date().getFullYear() }} —
          <strong
            >Powered by
            <a href="https://github.com/mrguamos" target="_blank"
              >iSkramz</a
            ></strong
          >
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { provide } from '@vue/composition-api'
import Web3 from 'web3'
import VuePullRefresh from 'vue-pull-refresh'
import {
  rpc,
  rpcWS,
  lpSpuAddress,
  lpBnbAddress,
  spuAddress,
  SPU,
  LP,
} from './chain/chain'
import { usePrices } from './store/prices'

export default defineComponent({
  components: {
    VuePullRefresh,
  },
  setup() {
    const { spuUsd } = usePrices()
    const config = {
      errorLabel: 'Error while reloading...',
      startLabel: 'Pull to refresh...',
      readyLabel: 'Release to update...',
      loadingLabel: 'Loading...',
      pullDownHeight: 150,
    }
    function onRefresh() {
      return new Promise(function () {
        setTimeout(function () {
          window.location.reload()
        }, 100)
      })
    }
    const options = {
      reconnect: {
        auto: true,
      },
    }

    const provider = new Web3.providers.WebsocketProvider(rpcWS, options)
    const web3ws = new Web3(provider)
    provide('web3ws', web3ws)
    const web3 = new Web3(rpc)
    provide('web3', web3)
    const lpSpu = new web3.eth.Contract(LP as any, lpSpuAddress)
    provide('lpSpu', lpSpu)
    const lpBnb = new web3.eth.Contract(LP as any, lpBnbAddress)
    provide('lpBnb', lpBnb)
    const spu = new web3.eth.Contract(SPU as any, spuAddress)
    provide('spu', spu)

    async function getSpuUsd() {
      try {
        const rr: any[] = await Promise.all([
          lpSpu.methods.getReserves().call(),
          lpBnb.methods.getReserves().call(),
        ])
        const lpSpuReserves = rr[0]
        const lpBnbReserves = rr[1]
        const spuBnb = Number(lpSpuReserves[1] / lpSpuReserves[0])
        const bnbBusd = Number(lpBnbReserves[1] / lpBnbReserves[0])
        let spuUsdValue = spuBnb * bnbBusd
        spuUsdValue /= Math.pow(10, 9)
        spuUsd.value = Number(spuUsdValue.toFixed(4))
      } catch (error) {
        console.log(error)
      } finally {
        setTimeout(getSpuUsd, 5000)
      }
    }

    getSpuUsd()

    return { onRefresh, config }
  },
})
</script>
<style lang="scss">
@media (max-width: 1200px) {
  .short-address {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 200px;
  }
}
</style>
