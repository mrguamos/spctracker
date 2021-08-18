<template>
  <div>
    <Dashboard />
    <Accounts class="mt-10" />
  </div>
</template>

<script>
import Accounts from "../components/Accounts.vue";
import Dashboard from "../components/Dashboard.vue";

export default {
  components: { Accounts, Dashboard },
};
</script>

<style>
</style>