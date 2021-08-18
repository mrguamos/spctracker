<template>
  <v-row justify="center">
    <v-col cols="12" sm="12" md="4">
      <Card :content="spc.data.price" :title="'SPC'" v-if="!spcLoading" />
    </v-col>
  </v-row>
</template>

<script>
import Card from "./Card.vue";
import axios from "axios";

export default {
  components: { Card },
  data() {
    return { spc: 0, spcLoading: true };
  },
  mounted() {
    this.getSPC();
  },
  computed: {},
  methods: {
    async getSPC() {
      const res = await axios.get(
        "https://api.pancakeswap.info/api/v2/tokens/0x21ea8618b9168eb8936c3e02f0809bbe901282ac"
      );
      this.spc = res.data;
      this.spcLoading = false;
    },
  },
};
</script>

<style>
</style>