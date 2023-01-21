const crypto = require('node:crypto');

require('dotenv').config();


const algorithm = 'aes-256-ctr'
const secretKey = process.env.SECRET;

const decrypt = hash => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

  return decrpyted.toString()
}


module.exports = decrypt;