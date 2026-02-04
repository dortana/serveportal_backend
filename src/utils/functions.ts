import { createS3Client } from "@/config/aws";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { ZodError } from "zod";

export const formatZodError = (error: ZodError) => {
  return error.issues.map((issue) => ({
    field: issue.path.length ? issue.path.join(".") : "body",
    message: issue.message,
  }));
};

export async function uploadToS3(file: File, path: string = "uploads") {
  const awsS3 = createS3Client();
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const fileHashName = generateFileName(file);
    const key = `${path}/${fileHashName}-${Date.now()}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };

    const command = new PutObjectCommand(params);
    await awsS3.send(command);

    const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return publicUrl;
  } catch (error: any) {
    console.error("Upload error:", error);
    throw new Error(error?.message ?? "Failed to upload file to storage");
  }
}

export async function deleteFromS3(fileUrl?: string | null) {
  if (!fileUrl) return;

  const awsS3 = createS3Client();

  try {
    const bucket = process.env.AWS_S3_BUCKET_NAME!;
    const region = process.env.AWS_REGION!;

    const prefix = `https://${bucket}.s3.${region}.amazonaws.com/`;

    if (!fileUrl.startsWith(prefix)) {
      // safety check – don't delete unknown URLs
      return;
    }

    const key = fileUrl.replace(prefix, "");

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await awsS3.send(command);
  } catch (error: any) {
    console.error("Delete S3 error:", error);
  }
}

export const generateFileName = (file: File) => {
  // Get extension from MIME type → jpg/jpeg/png
  const ext = file.type.split("/")[1] || "bin";
  // Remove dashes to get a cleaner long hash
  const uuid = crypto.randomUUID().replace(/-/g, "");
  return `${uuid}.${ext}`;
};
