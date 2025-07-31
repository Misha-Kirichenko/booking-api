import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { INTERFACES } from '@common';

@Injectable()
export class BaseAuthGuard implements CanActivate {
  private readonly jwtService: JwtService;
  private secret: string;
  constructor(secret: string) {
    this.jwtService = new JwtService();
    this.secret = secret;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    let payload: INTERFACES.ITokenPayload;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request, 'Bearer');

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.secret,
      });
    } catch (_) {
      throw new UnauthorizedException();
    }

    request['user'] = payload;

    return true;
  }

  private extractTokenFromHeader(
    request: Request,
    requestedType: string,
  ): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === requestedType ? token : undefined;
  };
}
