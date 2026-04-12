import { ConflictException, Injectable } from '@nestjs/common';
import { CreateNewUserRequest } from './dto/create-new-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(data: CreateNewUserRequest) {
    const { userName, email, password } = data;

    if (!userName && !email && !password) {
      throw new ConflictException('username, email, password is required');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const newUser = await this.prisma.user.create({ data });

    return { newUser };
  }
}
