<template>
  <v-row justify="center">
    <v-col cols="12" sm="12" md="4">
      <Card :content="spcUSD" :title="'SPC'" />
    </v-col>
  </v-row>
</template>

<script>
import Card from './Card.vue'

export default {
  components: { Card },
  async fetch() {
    const res = await this.$getSPC()
    const spc = res.data
    this.spcUSD = Number(spc.data.price).toFixed(12)
  },
  data() {
    return { spcUSD: 0, spcLoading: true }
  },
  mounted() {
    setInterval(() => {
      this.$fetch()
    }, 10000)
  },
  computed: {},
  methods: {},
}
</script>
