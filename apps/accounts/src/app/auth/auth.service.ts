import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ENTITIES } from '@common';
import { INTERFACES } from '@common';
import { JwtService } from '@nestjs/jwt';
import { ITokensPair } from './interfaces';
import { CONSTANTS } from '@common';

const { RES_MESSAGES } = CONSTANTS;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(ENTITIES.User) private userRepository: Repository<ENTITIES.User>,
    private readonly jwtService: JwtService
  ) { }

  private async generateTokenPairs(user: INTERFACES.ITokenPayload): Promise<ITokensPair> {
    const { id, email, role } = user;

    const accessToken = await this.jwtService.signAsync(
      { id, email, role },
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
        secret: process.env.ACCESS_TOKEN_SECRET,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { id, email, role },
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
        secret: process.env.REFRESH_TOKEN_SECRET,
      },
    );

    return { accessToken, refreshToken };
  }

  public async login(email: string, password: string): Promise<ITokensPair> {
    const foundUser = await this.userRepository.findOneBy({ email });

    if (!foundUser) {
      throw new UnauthorizedException(RES_MESSAGES.ERROR.CREDENTIALS);
    }

    const passwordsMatch = await bcrypt.compare(password, foundUser.password);

    if (passwordsMatch) {
      const tokensPair = await this.generateTokenPairs(foundUser);
      foundUser.lastLogin = Date.now();
      await this.userRepository.save(foundUser);
      return tokensPair;
    }

    throw new UnauthorizedException(RES_MESSAGES.ERROR.CREDENTIALS);
  }

  public async generateRefreshToken(
    userData: INTERFACES.ITokenPayload,
  ): Promise<ITokensPair> {
    const tokensPair = await this.generateTokenPairs(userData);
    return tokensPair;
  }
}
