const jwt = require('jsonwebtoken')

const token = jwt.sign({ foo: 'hello' }, '555')

console.log(token) // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJoZWxsbyIsImlhdCI6MTY2MjAyMDU0OH0.CCvTScTiz_Ezh5Bn6o1mdGVUhccL3KYWw2d09sJzJDg

const jwts = jwt.verify(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJoZWxsbyIsImlhdCI6MTY2MjAyMDU0OH0.CCvTScTiz_Ezh5Bn6o1mdGVUhccL3KYWw2d09sJzJDg',
  '555'
)

console.log(jwts) // { foo: 'hello', iat: 1662020548 }
