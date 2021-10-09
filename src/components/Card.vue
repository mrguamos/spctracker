<template>
  <v-card class="mx-auto dashboard-card">
    <v-card-title style="color: white" class="text-subtitle-1 text-no-wrap">{{
      title
    }}</v-card-title>
    <v-card-text style="color: white"> {{ content }}</v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
  },
})
</script>

<style lang="scss" scoped>
.dashboard-card {
  background: rgb(2, 0, 36);
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(9, 9, 121, 1) 35%,
    rgba(0, 212, 255, 1) 100%
  );
}
</style>
