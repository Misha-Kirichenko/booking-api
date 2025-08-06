import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UTILS } from '@common';

const { extractTokenFromHeader } = UTILS;

@Injectable()
export class BaseAuthGuard implements CanActivate {
  private readonly jwtService: JwtService;
  private secret: string;
  constructor(secret: string) {
    this.jwtService = new JwtService();
    this.secret = secret;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request.headers, 'Bearer');

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.secret,
      });
    } catch (_) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
