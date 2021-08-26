import express from 'express'
import axios from 'axios'

const app = express()
const apiKey = process.env.API_KEY

app.use(express.json())
app.get('/earnings/:address', async (req, res) => {
  const address = req.params.address
  const page = req.query.page
  const resp = await axios.get(
    `https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&contractaddress=0x21ea8618b9168eb8936c3e02f0809bbe901282ac&sort=desc&page=${page}&offset=10&apikey=${apiKey}`
  )
  res.json({ data: resp.data })
})

module.exports = app
