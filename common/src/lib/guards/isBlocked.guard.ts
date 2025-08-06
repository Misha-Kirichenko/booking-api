import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RES_MESSAGE } from '../utils';
import { ITokenPayload } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities';
import { Repository } from 'typeorm';
import { RES_MESSAGES } from '../constants';
import { Role } from '../enums';


@Injectable()
export class IsBlockedGuard implements CanActivate {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { id, role } = request.user as ITokenPayload;

    if (role === Role.ADMIN) return true;

    const foundUser = await this.userRepository.findOneBy({ id });

    if (!foundUser) {
      throw new UnauthorizedException();
    }

    if (foundUser.blocked) {
      const blockMessage = foundUser.blockReason ? RES_MESSAGE.ERROR.BLOCKED(foundUser.blockReason) : RES_MESSAGES.ERROR.BLOCKED;
      throw new ForbiddenException(blockMessage);
    }

    return true;
  }
}
