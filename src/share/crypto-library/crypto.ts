import { AES, enc } from 'crypto-js'

const keyCrypto = process.env.CRYPTO_KEY

export default class Crypto {

  encrypt(data: string): string {
    const encrypted = AES.encrypt(data, keyCrypto as string).toString()
    return encrypted
  }

  encryptObject(objectToEncrypt: object, encryptKey = false): {[key: string]: string} {
    const ObjectToReturn: {[key: string]: string} = {}
    Object.entries(objectToEncrypt).forEach(([key, value]) => {
      if(typeof (value) === 'string') {
        const newValue = this.encrypt(value)
        ObjectToReturn[encryptKey ? this.encrypt(key): key] = newValue
      } else {
        ObjectToReturn[encryptKey ? this.encrypt(key): key] = value
      }
    })
    return ObjectToReturn
  }

  decrypt(data: string): string {
    const decrypted = AES.decrypt(data, keyCrypto as string).toString(enc.Utf8)
    return decrypted
  }

  decryptObject(objectToDecrypt: object, decryptKey = false): {[key: string]: string} {
    const ObjectToReturn: {[key: string]: string} = {}
    Object.entries(objectToDecrypt).forEach(([key, value]) => {
      if(typeof (value) === 'string') {
        const newValue = this.decrypt(value)
        ObjectToReturn[decryptKey ? this.decrypt(key): key] = newValue
      } else {
        ObjectToReturn[decryptKey ? this.decrypt(key): key] = value
      }
    })
    return ObjectToReturn
  }

  decryptObjectArry(objectToArray: object[]): [{[key: string]: string}] {
    const ObjectToReturn:[{[key: string]: string}] = [{}]
    for (const obj of objectToArray) {
       if(Object.entries(obj).length !== 0) ObjectToReturn.push(this.decryptObject(obj))
    }
    return ObjectToReturn
  }
}
