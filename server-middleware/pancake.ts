import express from 'express'
import axios from 'axios'

const app = express()

app.use(express.json())
app.get('/', async (req, res) => {
  const resp = await axios.get(
    `https://api.pancakeswap.info/api/v2/tokens/0x21ea8618b9168eb8936c3e02f0809bbe901282ac`
  )
  res.json({ data: resp.data })
})

module.exports = app
