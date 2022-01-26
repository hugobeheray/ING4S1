
const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')

const fetchKeyFromOpenIDServer = async (jwks_uri, token) => {
  const header = JSON.parse( Buffer.from(
      token.split('.')[0], 'base64'
    ).toString('utf-8')
  )
  const {publicKey, rsaPublicKey} = await jwksClient({
    jwksUri: jwks_uri
  }).getSigningKey(header.kid)
  return publicKey || rsaPublicKey
}

module.exports = ({jwks_uri, test_payload_email} = {}) => {
  if(test_payload_email){
    return async (req, res, next) => {
      req.user = {
        iss: 'http://127.0.0.1:5556/dex',
        sub: 'CiQwOGE4Njg0Yi1kYjg4LTRiNzMtOTBhOS0zY2QxNjYxZjU0NjYSBWxvY2Fs',
        aud: 'webtech-frontend',
        exp: 1637152646,
        iat: 1637066246,
        at_hash: 'gc-2mLPMU8PY2pN5Smcueg',
        email: test_payload_email,
        email_verified: true
      }
      next()
    }
    
  }
  if(!jwks_uri){
    throw Error('Invalid Settings: jwks_uri is required')
  }
  return async (req, res, next) => {
    if(! req.headers['authorization'] ){
      res.status(401).send('Missing Access Token')
      return
    }
    const header = req.headers['authorization']
    const [type, access_token] = header.split(' ')
    if(type !== 'Bearer'){
      res.status(401).send('Authorization Not Bearer')
      return
    }
    const key = await fetchKeyFromOpenIDServer(jwks_uri, access_token)
    // Validate the payload
    try{
      const payload = jwt.verify(access_token, key)
      req.user = payload
      next()
    }catch(err){
      res.status(401).send('Invalid Access Token')
    }
  }
}
