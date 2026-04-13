import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { CreateNewUserRequest } from './dto/create-new-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createNewUser(data: CreateNewUserRequest) {
    const { userName, email, password } = data;

    if (!userName && !email && !password) {
      throw new ConflictException('username, email, password is required');
    }
    
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    const passwordHash = await bcrypt.hash(password, 10);

    const payload: CreateNewUserRequest = {
      ...data,
      password: passwordHash,
    };

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const newUser = await this.prisma.user.create({ data: payload });

    return { newUser };
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
