import { Request } from 'express';
import { ITokenPayload } from './tokenPayload.interface';

export interface IAuthorizedRequest extends Request {
  user: ITokenPayload;
}
