import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginRequest } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(body: LoginRequest) {
    const { email, password } = body;

    if (!email && !password)
      throw new ConflictException('Email, password is required');

    const userExists = await this.userService.findByEmail(email);

    if (!userExists) throw new NotFoundException('User is not found');

    const isMath = await bcrypt.compare(password, userExists.password);
    
    if (!isMath)
      throw new UnauthorizedException('Email or password is incorrect');

    const { password: passwordHash, ...user } = userExists;
    
    return {
      accessToken: this.jwtService.sign(user),
      user: user,
    };
  }
}
