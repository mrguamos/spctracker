<template>
  <div>
    <v-card class="mx-auto">
      <v-card-title>Accounts</v-card-title>
      <v-card-text>
        <v-text-field clearable v-model="address" label="Address" x>
          <v-btn
            slot="append-outer"
            color="primary"
            @click="loadAll(address, accounts)"
          >
            Load
          </v-btn>
        </v-text-field>
        <v-data-table :headers="headers1" :items="accounts" hide-default-footer>
          <template v-slot:[`item.referral`]="{}">
            {{ getTotalReferral }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto mt-4">
      <v-card-title>Referrals</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers2"
          :items="referrals"
          hide-default-footer
        ></v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { getSPC } from "../services";

export default {
  data() {
    const headers1 = [
      { text: "Address", value: "userAddress" },
      { text: "Highscore", value: "userScore" },
      { text: "Pending Payout", value: "userBoostedScore" },
      { text: "%", value: "percentage" },
      { text: "Referral", value: "referral" },
      { text: "Total Payout", value: "userTotalPoints" },
      { text: "Wallet", value: "wallet" },
    ];
    const headers2 = [
      { text: "Address", value: "userAddress" },
      { text: "Highscore", value: "userScore" },
      { text: "Pending Payout", value: "userBoostedScore" },
      { text: "%", value: "percentage" },
      { text: "Total Payout", value: "userTotalPoints" },
      { text: "Wallet", value: "wallet" },
    ];
    return {
      headers1: headers1,
      headers2: headers2,
      accounts: [],
      accountsLoading: true,
      address: "",
      referrals: [],
      abi: null,
      contract: null,
    };
  },
  inject: ["web3"],
  mounted() {},
  computed: {
    getTotalReferral() {
      let total = 0;
      this.referrals.forEach((referral) => {
        total = Number(total) + Number(referral.userBoostedScore.substring(1));
      });
      total = total * 0.2;
      return `$${total.toFixed(2)}`;
    },
  },
  methods: {
    async loadAll(address, arr) {
      this.abi = await this.getABI();
      this.contract = new this.web3.eth.Contract(
        JSON.parse(this.abi.data.data.contractABI),
        "0x21EA8618b9168Eb8936c3e02F0809BBE901282ac"
      );
      this.accounts = [];
      this.referrals = [];
      const account = await this.getUser(address, arr);
      await this.getDetails(account, this.accounts);
      account.data.data.userReferrals.forEach(async (user) => {
        this.getUser(user).then((referral) => {
          this.getDetails(referral, this.referrals);
        });
      });
      this.accountsLoading = false;
    },
    async getUser(address) {
      return axios.post("/api/get-user", {
        userAddress: address.toLowerCase(),
      });
    },
    async getABI() {
      return axios.get("/api/get-abi");
    },
    async getDetails(account, arr) {
      account.data.data.wallet = await this.contract.methods
        .balanceOf(account.data.data.userAddress.toLowerCase())
        .call();
      const dec = await this.contract.methods.decimals().call();

      const spc = await getSPC();

      let userBoostedScoreUSD =
        account.data.data.userBoostedScore * spc.data.data.price;
      userBoostedScoreUSD = userBoostedScoreUSD.toFixed(2);
      account.data.data.userBoostedScore = `$${userBoostedScoreUSD}`;

      let userTotalPointsUSD =
        account.data.data.userTotalPoints * spc.data.data.price;
      userTotalPointsUSD = userTotalPointsUSD.toFixed(2);
      account.data.data.userTotalPoints = `$${userTotalPointsUSD}`;

      let walletUSD = account.data.data.wallet * spc.data.data.price;
      walletUSD /= Math.pow(10, dec);
      walletUSD = walletUSD.toFixed(2);
      account.data.data.wallet = `$${walletUSD}`;

      account.data.data.percentage = (
        (userBoostedScoreUSD / walletUSD) *
        100
      ).toFixed(2);

      arr.push(account.data.data);
    },
  },
};
</script>

<style>
</style>