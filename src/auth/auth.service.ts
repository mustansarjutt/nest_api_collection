import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterUserDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private cloudinaryService: CloudinaryService
  ) {}

  async register(dto: RegisterUserDto, file?: Express.Multer.File) {
    const { firstName, lastName, email, username, password } = dto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });
    if (existingUser) {
      if (existingUser.email === email && existingUser.username === username) {
        throw new ConflictException("Email and username already taken");
      } else if (existingUser.email === email) {
        throw new ConflictException("Email already taken");
      } else if (existingUser.username === username) {
        throw new ConflictException("Username already taken");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarUrl: string | null = null;
    if (file) {
      try {
        const uploadResult: any = await this.cloudinaryService.uploadFile(file, "avatar");
        avatarUrl = uploadResult.secure_url;
      } catch (error) {
        throw new InternalServerErrorException("Failed to upload avatar image");
      }
    }

    const newUser = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        avatar: avatarUrl
      }
    });

    const { password: _password, ...result } = newUser;

    return {
      message: "User created successfully",
      data: result
    };
  }

  async login(dto: LoginDto) {
    const { username, email, password } = dto;

    const orConditions: any[] = [];
    if (username) orConditions.push({ username });
    if (email) orConditions.push({ email });

    const user = await this.prisma.user.findFirst({
      where: {
        OR: orConditions,
      }
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email
    }
    const token = this.jwtService.sign(payload);

    const { password: _password, ...result } = user;

    return {
      message: "Login successful",
      data: result,
      token
    };
  }
}