import axios from 'axios'

export default ({}: any, inject: any) => {
  inject('getSPC', async () => {
    return axios.get(
      'https://api.pancakeswap.info/api/v2/tokens/0x21ea8618b9168eb8936c3e02f0809bbe901282ac'
    )
  })
}
