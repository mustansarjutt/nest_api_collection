import { v2 as cloudinary } from "cloudinary";
import { ConfigService } from "@nestjs/config";

export const CLOUDINARY_TOKEN = "CLOUDINARY";

export const CloudinaryProvider = {
  provide: CLOUDINARY_TOKEN,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    cloudinary.config({
      cloud_name: configService.getOrThrow<string>("CLOUDINARY_CLOUD_NAME"),
      api_key: configService.getOrThrow<string>("CLOUDINARY_API_KEY"),
      api_secret: configService.getOrThrow<string>("CLOUDINARY_API_SECRET")
    });
    return cloudinary;
  }
};