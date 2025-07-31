import { Injectable } from '@nestjs/common';
import { BaseAuthGuard } from './baseAuth.guard';

@Injectable()
export class RefreshAuthGuard extends BaseAuthGuard {
  constructor() {
    super(process.env["REFRESH_TOKEN_SECRET"] as string);
  }
}
