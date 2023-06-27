import { config } from "dotenv";
config();
import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const AccessKey = process.env.AWS_BUCKET_ACCESS_KEY;
const SecretAccessKey = process.env.AWS_BUCKET_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: AccessKey,
    secretAccessKey: SecretAccessKey,
  },
  region: bucketRegion,
});

const uploadfileAWS = async (file, name) => {
  const extension = file.mimetype.split("/")[1];

  console.log(extension);

  const params = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: `books/${name}.${extension}`,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);

  await s3.send(command);
};

const readFilesSWS = async (files) => {
  for (const file of files) {
    const getObjectParams = {
      Bucket: bucketName,
      Key: "books/" + file.portada,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 10000 });
    file.imageUrl = url;
  }
};

export const amazonbucketHandler = { uploadfileAWS, readFilesSWS };
