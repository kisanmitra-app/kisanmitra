import { PutObjectCommand } from "@aws-sdk/client-s3";
import { IUpload, Upload } from "@kisan-mitra/schemas";
import { env } from "~/config";
import { s3Client } from "~/lib";

export class UploadService {
  /**
   * Uploads a file and returns the upload details
   * @param file - The file to be uploaded
   */
  uploadFile: (userId: string, file: File) => Promise<IUpload> = async (
    userId: string,
    file: File
  ) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const upload = await Upload.create({
      filename: file.name,
      size: file.size,
      mimetype: file.type,
      uploadedBy: userId,
    });

    const s3Key = `/uploads/${upload._id}_${file.name}`;
    const s3Url = `${env.S3_ENDPOINT}/${env.S3_BUCKET_NAME}${s3Key}`;

    const params = {
      Bucket: env.S3_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: file.type,
    };

    upload.s3Key = s3Key;
    upload.url = s3Url;
    await upload.save();

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      const uploadId = upload.id.toString();

      //##TODO: enqueue the upload for pest detection processing

      return upload;
    } catch (error) {
      await upload.deleteOne();
      throw error;
    }
  };
}
