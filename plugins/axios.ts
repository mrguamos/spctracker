export default function ({ $axios, redirect }: any) {
  $axios.defaults.timeout = 30000
}
