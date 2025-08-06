import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ENTITIES, INTERFACES, CONSTANTS, UTILS } from '@common';
import { JwtService } from '@nestjs/jwt';
import { ITokensPair } from './interfaces';


const { extractTokenFromHeader, RES_MESSAGE } = UTILS;
const { RES_MESSAGES } = CONSTANTS;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(ENTITIES.User) private userRepository: Repository<ENTITIES.User>,
    private readonly jwtService: JwtService
  ) { }

  private async generateTokenPairs(user: INTERFACES.ITokenPayload | ENTITIES.User): Promise<ITokensPair> {
    const { id, email, role, name, surname } = user;

    const accessToken = await this.jwtService.signAsync(
      { id, email, role, name, surname },
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

  private getTokenPayload(headers: Record<string, any>): INTERFACES.ITokenPayload {
    const token = extractTokenFromHeader(headers, "Bearer");
    const tokenPayload = this.jwtService.decode(token);
    return tokenPayload;
  }

  public async login(email: string, password: string): Promise<ITokensPair> {
    const foundUser = await this.userRepository.findOneBy({ email });

    if (!foundUser) {
      throw new UnauthorizedException(RES_MESSAGES.ERROR.CREDENTIALS);
    }

    if (foundUser.blocked) {
      const blockMessage = foundUser.blockReason ? RES_MESSAGE.ERROR.BLOCKED(foundUser.blockReason) : RES_MESSAGES.ERROR.BLOCKED;
      throw new ForbiddenException(blockMessage);
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

  public async refreshToken(
    headers: Record<string, any>
  ): Promise<ITokensPair> {

    const tokenPayload = this.getTokenPayload(headers);
    const foundUser = await this.userRepository.findOneBy({ id: tokenPayload.id });

    if (foundUser.blocked) {
      const blockMessage = foundUser.blockReason ? RES_MESSAGE.ERROR.BLOCKED(foundUser.blockReason) : RES_MESSAGES.ERROR.BLOCKED;
      throw new ForbiddenException(blockMessage);
    }

    foundUser.lastLogin = Date.now();
    await this.userRepository.save(foundUser);

    const tokensPair = await this.generateTokenPairs(tokenPayload);
    return tokensPair;
  }
}
