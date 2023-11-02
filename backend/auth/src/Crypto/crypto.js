const crypto = require("crypto");

class Crypto {
  /*
  Function to generate key pair (Public Key and Private Key)
*/
  static generateKeyPair = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });
    return {
      publicKey: publicKey.toString("base64"),
      privateKey: privateKey.toString("base64"),
    };
  };

  /*
  Function to sign a message
*/
  static generateSignature = (message, privateKey) => {
    const signer = crypto.createSign("SHA256");
    signer.update(message);
    const signature = signer.sign(
      {
        key: privateKey,
        format: "pem",
        type: "pkcs8",
      },
      "base64"
    );
    return signature;
  };

  /*
  Function to verify signature with message
*/
  static verifySignature = (message, signature, publicKey) => {
    try {
      const verifier = crypto.createVerify("SHA256");
      verifier.update(message);
      const isVerified = verifier.verify(
        {
          key: publicKey,
          format: "pem",
          type: "spki",
        },
        Buffer.from(signature, "base64")
      );
      return isVerified;
    } catch (err) {
      return false;
    }
  };

  // Function to encrypt data using public key
  static encrypt = (message, publicKey) => {
    const encryptData = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "SHA256",
      },
      Buffer.from(message)
    );
    return encryptData.toString("base64");
  };

  // Function to decrypt data using private key
  static decrypt = (encryptedMessage, privateKey) => {
    const decryptData = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "SHA256",
      },
      encryptedMessage
    );

    return decryptData.toString();
  };
}

module.exports = Crypto;
