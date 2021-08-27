import express from 'express'
import axios from 'axios'
import Web3 from 'web3'
const app = express()
;(async () => {
  const apiKey = process.env.API_KEY
  const web3 = new Web3(
    Web3.givenProvider || 'https://bsc-dataseed1.binance.org:443'
  )

  const abi = await axios.get('https://api.spaceport.to/get-abi')
  const contract = new web3.eth.Contract(
    JSON.parse(abi.data.data.contractABI),
    '0x21EA8618b9168Eb8936c3e02F0809BBE901282ac'
  )

  const dec = await contract.methods.decimals().call()

  app.use(express.json())
  app.get('/earnings/:address', async (req, res) => {
    try {
      const address = req.params.address
      const page = req.query.page
      const resp = await axios.get(
        `https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&contractaddress=0x21ea8618b9168eb8936c3e02f0809bbe901282ac&sort=desc&page=${page}&offset=10&apikey=${apiKey}`
      )
      res.json({ data: resp.data })
    } catch (error) {
      console.log(error)
    }
  })

  app.get('/pancake', async (req, res) => {
    const resp = await getSPC()
    res.json({ data: resp.data })
  })

  async function getUser(address: string) {
    return axios.post('https://api.spaceport.to/get-user', {
      userAddress: address,
    })
  }

  async function getUserDetails(user: any, spc: any) {
    const userDetails = {
      userAddress: user.userAddress,
      wallet: '',
      userBoostedScore: '',
      userTotalPoints: '',
      percentage: '',
      userScore: 0,
    }

    const wallet = await contract.methods
      .balanceOf(user.userAddress.toLowerCase())
      .call()

    const userBoostedScoreUSD = (
      user.userBoostedScore * spc.data.data.price
    ).toFixed(2)
    userDetails.userBoostedScore = `$${userBoostedScoreUSD}`

    const userTotalPointsUSD = (
      user.userTotalPoints * spc.data.data.price
    ).toFixed(2)
    userDetails.userTotalPoints = `$${userTotalPointsUSD}`

    let walletUSD = wallet * spc.data.data.price
    walletUSD /= Math.pow(10, dec)
    userDetails.wallet = `$${walletUSD.toFixed(2)}`

    userDetails.percentage = (
      (Number(userBoostedScoreUSD) / walletUSD) *
      100
    ).toFixed(2)

    userDetails.userScore = user.userScore
    return userDetails
  }

  app.get('/user/:address', async (req, res) => {
    const address = req.params.address.toLowerCase()
    const spc = await getSPC()

    const resp = {
      user: {
        userAddress: address,
        wallet: '',
        userBoostedScore: '',
        userTotalPoints: '',
        percentage: '',
        userScore: 0,
        referral: '',
      },
      referrals: [] as any,
    }

    const userResp = await getUser(address)
    const user = userResp.data.data
    const userDetails = await getUserDetails(user, spc)
    resp.user.wallet = userDetails.wallet
    resp.user.userBoostedScore = userDetails.userBoostedScore
    resp.user.userTotalPoints = userDetails.userTotalPoints
    resp.user.percentage = userDetails.percentage
    resp.user.userScore = userDetails.userScore
    user.userReferrals = [...new Set(user.userReferrals)]
    const promises = []
    for (const referral of user.userReferrals) {
      promises.push(getUser(referral))
    }

    const referrals = await Promise.all(promises)

    let referralAmount = 0
    for (const referral of referrals) {
      if (referral.data.status === 'success') {
        const ref = referral.data.data
        const refDetails = await getUserDetails(ref, spc)
        resp.referrals.push(refDetails)
        referralAmount =
          Number(referralAmount) +
          Number(refDetails.userBoostedScore.substring(1))
      }
    }
    referralAmount = referralAmount * 0.2
    resp.user.referral = referralAmount.toFixed(2)
    res.json({ data: resp })
  })

  async function getSPC() {
    return axios.get(
      `https://api.pancakeswap.info/api/v2/tokens/0x21ea8618b9168eb8936c3e02f0809bbe901282ac`
    )
  }
})()
module.exports = app
