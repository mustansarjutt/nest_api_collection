import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { StringValue } from "ms";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.getOrThrow<StringValue>("JWT_SECRET_EXPIRY"),
        }
      })
    }),
    CloudinaryModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}