<template>
  <div>
    <v-card class="mx-auto">
      <v-card-title>Accounts</v-card-title>
      <v-card-text>
        <v-text-field
          clearable
          v-model="address"
          label="Address"
          name="address"
        >
          <v-btn slot="append-outer" color="primary" @click="loadAll(address)">
            Load
          </v-btn>
        </v-text-field>
        <v-data-table
          :loading="accountsLoading"
          :headers="headers1"
          :items="accounts"
          disable-pagination
          hide-default-footer
        >
          <!-- <template v-slot:[`item.action`]="{}">
            <v-btn color="primary" @click.stop="openEarnings()">
              EARNINGS
            </v-btn>
          </template> -->
        </v-data-table>
      </v-card-text>
    </v-card>
    <!-- <v-card class="mx-auto mt-4" v-if="referral">
      <v-card-title>Referrals</v-card-title>
      <v-card-text>
        <v-data-table
          :loading="accountsLoading"
          :headers="headers2"
          :items="referrals"
          disable-pagination
          hide-default-footer
        ></v-data-table>
      </v-card-text>
    </v-card> -->

    <v-card class="mx-auto mt-4">
      <v-card-title> Earnings </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers3"
          :items="earnings"
          :items-per-page="20"
          hide-default-footer
          :loading="earningsLoading"
        ></v-data-table>
        <div class="text-center pt-2">
          <v-pagination
            v-model="page"
            :total-visible="10"
            :length="pageCount"
            @input="getEarnings()"
          ></v-pagination>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <!-- <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialog = false"> CLOSE </v-btn>
      </v-card-actions> -->
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    const headers = [
      { text: 'Address', value: 'userAddress' },
      { text: 'Highscore', value: 'userScore' },
      { text: 'Pending Payout', value: 'userBoostedScore' },
      { text: '%', value: 'percentage' },
      { text: 'Total Payout', value: 'userTotalPoints' },
      { text: 'Total SPC', value: 'totalSPC' },
      { text: 'Wallet', value: 'wallet' },
    ]

    const headers1 = Object.assign([], headers)
    //headers1.push({ text: 'Referral', value: 'referral' })
    //headers1.push({ text: 'Action', value: 'action' })
    const headers2 = Object.assign([], headers)

    const headers3 = [
      { text: 'TYPE', value: 'type' },
      { text: 'SPC', value: 'spc' },
      { text: 'USD', value: 'usd' },
      { text: 'DATE', value: 'date' },
    ]

    return {
      headers1,
      headers2,
      headers3,
      accounts: [],
      referrals: [],
      accountsLoading: false,
      address: '',
      dialog: false,
      page: 1,
      pageCount: 100,
      earnings: [],
      earningsLoading: false,
      referral: false,
    }
  },
  mounted() {},
  methods: {
    // openEarnings() {
    //   this.page = 1
    //   this.getEarnings()
    //   this.dialog = true
    // },

    async getEarningsDetails(result) {
      const spc = await this.$getSPC()
      if (this.page === this.pageCount) {
        if (result?.length >= 10) {
          this.pageCount = this.pageCount + 100
        }
      }
      result.forEach((r) => {
        let type = 'Swap'
        if (
          r.from.toLowerCase() !==
            '0xd2fa16a8324018ab09d151a0b6ed8b2ef3815aa0'.toLowerCase() &&
          r.to.toLowerCase() !== '0xd2fa16a8324018ab09d151a0b6ed8b2ef3815aa0' &&
          r.from.toLowerCase() !==
            '0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7' &&
          r.to.toLowerCase() !== '0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7' &&
          r.to.toLowerCase() === this.address.toLowerCase()
        ) {
          type = 'Reward'
        }
        let usd = r.value * spc.data.data.price
        usd /= Math.pow(10, 9)
        const earning = {
          spc: r.value,
          usd: `$${usd.toFixed(2)}`,
          date: new Date(r.timeStamp * 1000).toString(),
          type,
        }
        this.earnings.push(earning)
      })
    },

    async getEarnings() {
      if (this.address) {
        this.earningsLoading = true
        this.earnings = []
        const spc = await this.$getSPC()
        const res = await this.$axios.get(
          `/api/earnings/${this.address}?page=${this.page}`
        )
        const result = res.data.data.result
        this.getEarningsDetails(result)
        this.earningsLoading = false
      }
    },
    async loadAll(address) {
      this.page = 1
      this.accounts = []
      this.referrals = []
      this.earnings = []
      this.accountsLoading = true
      this.earningsLoading = true
      try {
        if (address) {
          const resp = await this.$axios.get(`/api/user/${address}`)
          this.accounts.push(resp.data.data.user)
          //this.referrals = resp.data.data.referrals
          this.getEarningsDetails(resp.data.data.earnings)
        }
      } catch (error) {
      } finally {
        this.accountsLoading = false
        this.earningsLoading = false
      }
    },
  },
}
</script>

<style>
.earnings-row {
  background-color: green;
}
</style>
