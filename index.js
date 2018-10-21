const Koa = require('koa')
const aesjs = require('aes-js')
const pbkdf2 = require('pbkdf2')
const BN = require('bn.js')
const { words } = require('./words.json')

const app = new Koa()
const salt = 'random salt!'

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
=======
>>>>>>> c272c6dd7592c5cce302b989429c534f70ac84a6
const twilio = require('twilio')
require('dotenv').load()

const twilioInstance = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

<<<<<<< HEAD
const numbers = ["+447508794055", "+447895331096"]

>>>>>>> Stashed changes
=======

>>>>>>> c272c6dd7592c5cce302b989429c534f70ac84a6
const stringToWords = (text, password) => {
  // set up encryption
  const key = pbkdf2.pbkdf2Sync(password, salt, 1, 256 / 8, 'sha512')
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))

  // text to encrypted hex
  const textBytes = aesjs.utils.utf8.toBytes(text)
  const encryptedBytes = aesCtr.encrypt(textBytes)
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)

  // split into array of 11 bits
  const splitBits = (new BN(encryptedHex, 16)).toString(2).match(/.{1,11}/g)

  // convert to array of words
  const converted = []
  for (const bits of splitBits) {
    // 11 bits to decimal as index
    converted.push(words[parseInt(bits, 2)])
  }
  
  return converted
}

const wordsToString = (inputWords, password) => {
  // set up description
  const key = pbkdf2.pbkdf2Sync(password, salt, 1, 256 / 8, 'sha512')
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))

  // array of words to string of bits
  let bits = ''
  for (const word of inputWords) {
    // pad to ensure always 11 bits added to string
    bits += words.indexOf(word).toString(2).padStart(11, '0')
  }
  
  // bitstring to hexstring
  const encryptedHex = (new BN(bits, 2)).toString(16)

  // hex to bytes, decrypt
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)
  const decryptedBytes = aesCtr.decrypt(encryptedBytes)

  // bytes to utf8 string
  return aesjs.utils.utf8.fromBytes(decryptedBytes)
}

app.use(async ctx => {
  const str = 'String to encrypt!'
  const pass = 'password123'
  const encrypted = stringToWords(str, pass)
  const decrypted = wordsToString(encrypted, pass)
  ctx.body = `Input: ${str}\nPassword: ${pass}\nEncrypted: ${encrypted}\nDecrypted: ${decrypted}`
  sendTextToNumbers(encrypted)
})

app.listen(3000)

function sendTextToNumbers(words) {
  const wordsPerNumber = Math.ceil(words.length / numbers.length)
  let wordsoffset = 0
  for(let i = 0; i <= numbers.length; i++) {
    let buffer = ""
    for(let j = 0 + wordsoffset; j <= wordsPerNumber; j++) {
      buffer += words[j]
    }
    sendText(buffer += i, numbers[i])
    buffer = ""
    wordsoffset++
  }
}

function sendText(textString, num) {
  twilioInstance.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: num,
    body: textString}).then((message) => console.log(message.sid));
}
