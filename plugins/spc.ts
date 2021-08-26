export default ({ $axios }: any, inject: any) => {
  inject('getSPC', async () => {
    return $axios.get('/pancake')
  })
}
