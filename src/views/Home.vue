<template>
  <div>
    <Dashboard />
    <Accounts class="mt-10" />
  </div>
</template>

<script lang="ts">
import Accounts from '@/components/Accounts.vue'
import Dashboard from '@/components/Dashboard.vue'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  components: { Dashboard, Accounts },
})
</script>
