module.exports = function (req: any, res: any, next: any) {
  const host = req.headers.host

  const url = req.url

  const env = process.env.NODE_ENV

  const canonicalDomain = 'www.spctracker.com'

  if (env === 'production' && host !== canonicalDomain) {
    res.writeHead(301, { Location: 'https://' + canonicalDomain + url })
    return res.end()
  }

  return next()
}
