import { S3 } from 'aws-sdk';
import { Logger, Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

/**
 * fileUpload service a service for uploading the document to AWS s3 bucket 
 */
@Injectable()
export class FileUploadService {

    /**
     * set up the file name and s3 bucket
     * @param file 
     * @param folderName 
     * @returns 
     */
    async upload(file, folderName: string): Promise<any> {
        const fileName = `${folderName}/${uuidv4()}-${file.originalname}`;
        const bucketS3 = process.env.AWS_BUCKET_NAME;
        return await this.uploadS3(file.buffer, bucketS3, fileName);
    }

    /**
     * config the s3 and upload the document to s3 and return the data
     * @param file 
     * @param bucket 
     * @param name 
     * @returns 
     */
    async uploadS3(file, bucket, name) {
        const s3 = this.getS3();
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
        };
        const imageData = await new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    Logger.error(err);
                    reject(err.message);
                }
                resolve(data);
            });
        });
        return imageData
    }

    /**
     * Remove the document form s3
     * @param key 
     */
    async removeS3(key: string) {
        const s3 = this.getS3();
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        };
        await new Promise((resolve, reject) => {
            s3.deleteObject(params, (err, data) => {
                if (err) {
                    Logger.error(err);
                    reject(err.message);
                }
                resolve(data);
            });
        });
    }

    /**
     * set new s3 service
     * @returns 
     */
    getS3() {
        return new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }
}