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
          <v-btn
            slot="append-outer"
            color="primary"
            @click="loadAll(address, accounts)"
          >
            Load
          </v-btn>
        </v-text-field>
        <v-data-table
          :headers="headers1"
          :items="accounts"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:[`item.referral`]="{}">
            {{ getTotalReferral }}
          </template>
          <template v-slot:[`item.action`]="{}">
            <v-btn color="primary" @click.stop="openEarnings()">
              EARNINGS
            </v-btn>
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
          disable-pagination
          hide-default-footer
        ></v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title> Earnings </v-card-title>

        <v-card-text>
          <v-data-table
            dense
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

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog = false"> CLOSE </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      { text: 'Wallet', value: 'wallet' },
    ]

    const headers1 = Object.assign([], headers)
    headers1.push({ text: 'Referral', value: 'referral' })
    headers1.push({ text: 'Action', value: 'action' })
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
      accountsLoading: true,
      address: '',
      referrals: [],
      abi: null,
      contract: null,
      dec: 0,
      dialog: false,
      page: 1,
      pageCount: 100,
      earnings: [],
      totalDesserts: 0,
      earningsLoading: true,
    }
  },
  mounted() {},
  computed: {
    getTotalReferral() {
      let total = 0
      this.referrals.forEach((referral) => {
        total = Number(total) + Number(referral.userBoostedScore.substring(1))
      })
      total = total * 0.2
      return `$${total.toFixed(2)}`
    },
  },
  methods: {
    openEarnings() {
      this.page = 1
      this.getEarnings()
      this.dialog = true
    },

    async getEarnings() {
      if (this.address) {
        this.earningsLoading = true
        this.earnings = []
        const spc = await this.$getSPC()
        const res = await this.$axios.get(
          `/server/earnings/${this.address}?page=${this.page}`
        )
        const result = res.data.data.result
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
            r.to.toLowerCase() !==
              '0xd2fa16a8324018ab09d151a0b6ed8b2ef3815aa0' &&
            r.from.toLowerCase() !==
              '0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7' &&
            r.to.toLowerCase() !== '0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7'
          ) {
            type = 'Reward'
          }
          let usd = r.value * spc.data.data.data.price
          usd /= Math.pow(10, this.dec)

          const earning = {
            spc: r.value,
            usd: `$${usd.toFixed(2)}`,
            date: new Date(r.timeStamp * 1000).toString(),
            type,
          }
          this.earnings.push(earning)
        })
        this.earningsLoading = false
      }
    },
    async loadAll(address, arr) {
      try {
        if (address) {
          address = address.toLowerCase()
          const spc = await this.$getSPC()
          this.dec = await this.$contract.methods.decimals().call()
          this.accounts = []
          this.referrals = []
          const account = await this.getUser(address, arr)
          this.address = account.data.data.userAddress.toLowerCase()
          await this.getDetails(account, this.accounts, spc.data)
          account.data.data.userReferrals.forEach((user) => {
            this.getUser(user)
              .then((referral) => {
                this.getDetails(referral, this.referrals, spc.data)
                  .then()
                  .catch((e) => {
                    console.log(e)
                  })
              })
              .catch((e) => {
                console.log(e)
              })
          })
        }
      } catch (error) {}

      this.accountsLoading = false
    },
    getUser(address) {
      return this.$axios.post(
        '/api/get-user',
        {
          userAddress: address.toLowerCase(),
        },
        {
          origin: 'https://play.spaceport.to',
          ':authority': 'api.spaceport.to',
          referer: 'https://play.spaceport.to/',
        }
      )
    },
    async getDetails(account, arr, spc) {
      account.data.data.wallet = await this.$contract.methods
        .balanceOf(account.data.data.userAddress.toLowerCase())
        .call()

      let userBoostedScoreUSD =
        account.data.data.userBoostedScore * spc.data.data.price
      userBoostedScoreUSD = userBoostedScoreUSD.toFixed(2)
      account.data.data.userBoostedScore = `$${userBoostedScoreUSD}`

      let userTotalPointsUSD =
        account.data.data.userTotalPoints * spc.data.data.price
      userTotalPointsUSD = userTotalPointsUSD.toFixed(2)
      account.data.data.userTotalPoints = `$${userTotalPointsUSD}`

      let walletUSD = account.data.data.wallet * spc.data.data.price
      walletUSD /= Math.pow(10, this.dec)
      walletUSD = walletUSD.toFixed(2)
      account.data.data.wallet = `$${walletUSD}`

      account.data.data.percentage = (
        (userBoostedScoreUSD / walletUSD) *
        100
      ).toFixed(2)

      arr.push(account.data.data)
    },
  },
}
</script>

<style>
.earnings-row {
  background-color: green;
}
</style>
