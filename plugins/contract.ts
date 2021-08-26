import Web3 from 'web3'

export default async ({ $axios }: any, inject: any) => {
  const web3 = new Web3(
    Web3.givenProvider || 'https://bsc-dataseed1.binance.org:443'
  )
  const abi = await $axios.get('/api/get-abi')
  const contract = new web3.eth.Contract(
    JSON.parse(abi.data.data.contractABI),
    '0x21EA8618b9168Eb8936c3e02F0809BBE901282ac'
  )
  inject('contract', contract)
}
