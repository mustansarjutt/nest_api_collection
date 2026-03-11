import { Injectable, Inject } from "@nestjs/common";
import { v2 as Cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { CLOUDINARY_TOKEN } from "./cloudinary.provider";

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(CLOUDINARY_TOKEN) private cloudinary: typeof Cloudinary
  ) {}

  async uploadFile(file: Express.Multer.File, folder: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result as UploadApiResponse);
        }
      ).end(file.buffer);
    });
  }
}