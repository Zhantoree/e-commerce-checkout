import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';

@Injectable()
export class S3StorageService extends StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    super();

    this.client = new S3Client({
      endpoint: config.getOrThrow('S3_ENDPOINT'),
      region: config.getOrThrow('S3_REGION'),
      credentials: {
        accessKeyId: config.getOrThrow('S3_ACCESS_KEY_ID'),
        secretAccessKey: config.getOrThrow('S3_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true,
      requestChecksumCalculation: 'WHEN_REQUIRED',
    });

    this.bucket = config.getOrThrow('S3_BUCKET');
    this.publicUrl = config.getOrThrow('S3_PUBLIC_URL');
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }

  async upload(key: string, body: Buffer, contentType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await this.client.send(command);
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.client.send(command);
  }
}
