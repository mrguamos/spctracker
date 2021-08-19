<template>
  <v-row justify="center">
    <v-col cols="12" sm="12" md="4">
      <Card :content="spcUSD" :title="'SPC'" v-if="!spcLoading" />
    </v-col>
  </v-row>
</template>

<script>
import Card from "./Card.vue";
import axios from "axios";

export default {
  components: { Card },
  data() {
    return { spcUSD: 0, spcLoading: true };
  },
  mounted() {
    this.getSPC();
    setInterval(() => {
      this.getSPC();
    }, 10000);
  },
  computed: {},
  methods: {
    async getSPC() {
      const res = await axios.get(
        "https://api.pancakeswap.info/api/v2/tokens/0x21ea8618b9168eb8936c3e02f0809bbe901282ac"
      );
      const spc = res.data;
      this.spcUSD = Number(spc.data.price).toFixed(12);
      this.spcLoading = false;
    },
  },
};
</script>

<style>
</style>