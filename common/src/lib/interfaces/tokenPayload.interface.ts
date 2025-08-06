import { Role } from "../enums";

export interface ITokenPayload {
  readonly id: number;
  readonly email: string;
  readonly role: Role;
  readonly name: string;
  readonly surname: string;
}
