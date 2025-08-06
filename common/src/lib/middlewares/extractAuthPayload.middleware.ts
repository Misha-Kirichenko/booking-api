import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';
import { extractTokenFromHeader } from '../utils';
import { IAuthorizedRequest, ITokenPayload } from '../interfaces';

@Injectable()
export class ExtractAuthPayload implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) { }
  use(request: IAuthorizedRequest, res: Response, next: NextFunction) {
    const token = extractTokenFromHeader(request.headers, 'Bearer');
    const tokenPayload: ITokenPayload = this.jwtService.decode(token as string);

    if (tokenPayload) {
      request["user"] = tokenPayload;
    }

    next();
  }
}
