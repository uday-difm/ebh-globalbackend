import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

console.log("Uploading to bucket:", process.env.BUCKET);


const endpoint = "https://s3-eu-central-2.ionoscloud.com";
const s3Client = new S3Client({
  endpoint: endpoint,
  credentials: {
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETKEY,
  },
  region: process.env.REGION,
});
console.log("Uploading to bucket:", process.env.BUCKET);


async function uploadToS3(keyPrefix, file) {
  console.log("Uploading to bucket:", process.env.BUCKET);

 
  try {
    const s3Object = {
      Bucket: process.env.BUCKET,
      Key: `${keyPrefix}/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read',
    };

    await s3Client.send(new PutObjectCommand(s3Object));
    const imageUrl = await getObjectUrl(s3Object.Key);

    return imageUrl;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Error uploading to S3");
  }
}

async function getObjectUrl(key) {
  const bucketUrl = `https://${process.env.BUCKET}.s3-eu-central-2.ionoscloud.com/`;
  // console.log('Bucket URL:', bucketUrl);
  const formattedKey = key.replace(/ /g, "+");
  const imageUrl = `${bucketUrl}${formattedKey}`;
  // console.log('Image URL:', imageUrl);
  return imageUrl;
}

export { uploadToS3, getObjectUrl };
