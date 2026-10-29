require("dotenv").config();
const ImageKit = require("@imagekit/nodejs").default;

const getPublicKey = () =>
  (
    process.env.IMAGEKIT_PUBLIC_KEY ||
    process.env.IMAGEKIT_PUBLICKEY ||
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    ""
  ).trim();

const getPrivateKey = () =>
  (
    process.env.IMAGEKIT_PRIVATE_KEY ||
    process.env.IMAGEKIT_PRIVATEKEY ||
    ""
  ).trim();

const getUrlEndpoint = () =>
  (
    process.env.IMAGEKIT_URL_ENDPOINT ||
    process.env.IMAGEKIT_ENDPOINT_URL ||
    process.env.IMAGEKIT_URL ||
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
    ""
  ).trim();

let imagekitInstance = null;

function getImageKit() {
  if (imagekitInstance) return imagekitInstance;

  const pub = getPublicKey();
  const priv = getPrivateKey();
  const url = getUrlEndpoint();

  if (!pub || !priv || !url) {
    const missing = [];
    if (!pub) missing.push("IMAGEKIT_PUBLIC_KEY");
    if (!priv) missing.push("IMAGEKIT_PRIVATE_KEY");
    if (!url) missing.push("IMAGEKIT_URL_ENDPOINT");
    throw new Error(
      `ImageKit storage is not configured. Missing environment variable(s): ${missing.join(
        ", "
      )}. Please set them in your deployment environment.`
    );
  }

  imagekitInstance = new ImageKit({
    privateKey: priv,
  });

  return imagekitInstance;
}

// Proxied imagekit export so calls like imagekit.files.upload(...) work smoothly,
// but key validation happens ONLY when upload/delete is actually called.
// This prevents server boot crashes if keys are not yet injected.
const imagekit = new Proxy(
  {},
  {
    get(target, prop) {
      const client = getImageKit();
      const val = client[prop];
      if (typeof val === "function") {
        return val.bind(client);
      }
      return val;
    },
  }
);

module.exports = {
  imagekit,
  get publicKey() {
    return getPublicKey();
  },
  get urlEndpoint() {
    return getUrlEndpoint();
  },
  isConfigured: () =>
    Boolean(getPublicKey() && getPrivateKey() && getUrlEndpoint()),
};
