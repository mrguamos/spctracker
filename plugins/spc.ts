export default ({ $axios }: any, inject: any) => {
  inject('getSPC', async () => {
    return $axios.get(
      'https://api.pancakeswap.info/api/v2/tokens/0x21ea8618b9168eb8936c3e02f0809bbe901282ac',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
        },
      }
    )
  })
}
