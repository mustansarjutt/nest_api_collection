import { Global, Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { join } from "path";
import { MailService } from "./mail.service";

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow("SMTP_HOST"),
          port: configService.getOrThrow("SMTP_PORT"),
          secure: configService.getOrThrow("SMTP_PORT") == 465,
          auth: {
            user: configService.getOrThrow("SMTP_USER"),
            pass: configService.getOrThrow("SMTP_PASSWORD"),
          }
        },
        defaults: {
          from: `"Mustansar Jutt" <${configService.getOrThrow("SMTP_FROM_EMAIL")}>`,
        },
        template: {
          dir: join(__dirname, "template"),
          adapter: new EjsAdapter(),
          options: {
            strict: false
          }
        }
      })
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}