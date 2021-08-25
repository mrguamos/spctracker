<template>
  <v-app>
    <v-app-bar app color="black" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          contain
          src="spaceport-3.png"
          transition="scale-transition"
          width="100"
        />
      </div>
    </v-app-bar>
    <v-main>
      <v-container class="py-16">
        <router-view />
      </v-container>
    </v-main>
    <v-footer color="primary lighten-1" padless>
      <v-row justify="center" no-gutters>
        <v-col class="primary lighten-2 py-4 text-center white--text" cols="12">
          {{ new Date().getFullYear() }} —
          <strong
            >Powered by
            <a href="https://github.com/mrguamos/spctracker" target="_blank"
              >iSkramz</a
            ></strong
          >
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import Web3 from "web3";

export default {
  provide() {
    return {
      web3: new Web3(
        Web3.givenProvider || "https://bsc-dataseed1.binance.org:443"
      ),
    };
  },
};
</script>

<style>
</style>