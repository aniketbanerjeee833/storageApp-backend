import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import fs from "fs/promises";
// const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY;
const privateKey = await fs.readFile(
  "./private_key.pem",
  "utf8"
);
// const keyPairId = "K39KPNUYO3WDBA";
const keyPairId="K1B3UZ6LF770MV"
const dateLessThan = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // any Date constructor compatible
    // const distributionName = `https://d1atbbb46v8ybv.cloudfront.net`;
const distributionName = `https://d19awpektfd08z.cloudfront.net`;
export const createCloudFrontGetSignedUrl = ({
  key,
  download = false,
  filename,
}) => {
  const url = `${distributionName}/${key}?response-content-disposition=${encodeURIComponent(`${download ? "attachment" : "inline"}; filename=${filename}`)}`;
  const signedUrl = getSignedUrl({
    url,
    keyPairId,
    dateLessThan,
    privateKey,
  });
  return signedUrl;
};

// https://bibwild.wordpress.com/2024/06/18/cloudfront-in-front-of-s3-using-response-content-disposition/
