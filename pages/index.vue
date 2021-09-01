<template>
  <div>
    <v-alert type="info" elevation="24" dismissible>
      Prices are based on PancakeSwap, may fluctuate anytime.
    </v-alert>
    <v-alert type="warning" color="orange darken-4" elevation="24" dismissible>
      This tracker only needs wallet address. Never give your seed / key phrase
      to anyone.
    </v-alert>
    <v-alert type="warning" color="orange darken-4" elevation="24" dismissible>
      Disabled referral tracking for the meantime to lesssen spaceport server
      load.
    </v-alert>
    <Dashboard />
    <Accounts class="mt-10" />
  </div>
</template>

<script>
import Accounts from '~/components/Accounts.vue'
import Dashboard from '~/components/Dashboard.vue'
export default {
  components: { Dashboard, Accounts },
}
</script>
Accounts
