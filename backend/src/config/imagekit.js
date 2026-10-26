require("dotenv").config();
const ImageKit = require("@imagekit/nodejs").default;

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

if (!publicKey || !privateKey || !urlEndpoint) {
  throw new Error(
    "Missing ImageKit configuration. Check IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT."
  );
}

const imagekit = new ImageKit({
  privateKey,
});

module.exports = {
  imagekit,
  publicKey,
  urlEndpoint,
};
