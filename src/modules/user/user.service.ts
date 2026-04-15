import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { CreateNewUserRequest } from './dto/create-new-user.dto';
import { GetListUser } from './dto/get-list-user.dto';
import { IResponse, IResponseListData } from 'types/interface/api.interface';
import { User } from '@prisma/client';
import { HTTP_RESPONSE } from 'types/constant/api.constant';

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

  async getListUser(data: GetListUser): Promise<IResponseListData<User>> {
    const { userName } = data;
    const page = data.page || 1;
    const pageSize = data.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      await this.prisma.user.findMany({
        where: {
          userName: {
            startsWith: userName,
            mode: 'insensitive',
          },
          status: true,
        },
        skip,
        take: pageSize,
        orderBy: { createAt: 'desc' },
      }),

      await this.prisma.user.count({ where: { userName, status: true } }),
    ]);

    const totalPage = Math.ceil(total / pageSize);
    const nextPage = page < totalPage;
    const previousPage = page > 1;

    return HTTP_RESPONSE.OK({
      items: users,
      pagination: {
        page,
        pageSize,
        total: total,
        totalPage,
        nextPage,
        previousPage,
      },
    });
  }

  async getUserById(id: string): Promise<IResponse<User | null>> {
    if (typeof Number(id) !== 'number') {
      throw new ConflictException('Type ID is Number');
    }

    return HTTP_RESPONSE.OK(
      await this.prisma.user.findUnique({ where: { id: Number(id) } }),
    );
  }
}
