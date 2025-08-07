import { Role } from "../enums";

export interface ITokenPayload {
  readonly id: string;
  readonly email: string;
  readonly role: Role;
  readonly name: string;
  readonly surname: string;
}
