import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from "@nestjs/typeorm";
import { faker } from '@faker-js/faker';
import { Repository } from "typeorm";
import { ENTITIES, ENUMS, INTERFACES } from "@common";


@Injectable()
export class UsersSeederService implements INTERFACES.ISeederService {
  constructor(
    @InjectRepository(ENTITIES.User)
    private readonly usersRepository: Repository<ENTITIES.User>
  ) { }

  private async generateAdmins(): Promise<ENTITIES.User[]> {
    const adminsEntities = [];
    const password = 'Admin_password_123';
    const salt = await bcrypt.genSalt(Number(process.env.PASSWORD_SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(
      password,
      salt,
    );
    const admins = [
      { name: "John", surname: "Doe", email: "john.doe@example.com", password: hashedPassword, role: ENUMS.Role.ADMIN },
      { name: "Jane", surname: "Doe", email: "jane.doe@example.com", password: hashedPassword, role: ENUMS.Role.ADMIN }
    ];
    for (const admin of admins) {
      const adminEntity = this.usersRepository.create(admin);
      adminsEntities.push(adminEntity);
    }
    return adminsEntities;
  }

  private async generateUsers(quantity: number): Promise<ENTITIES.User[]> {
    const password = 'User_password_123';
    const salt = await bcrypt.genSalt(Number(process.env.PASSWORD_SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(
      password,
      salt,
    );
    const usersEntities = Array.from({ length: quantity }, () => {
      const name = faker.person.firstName().replace(/'/g, "");
      const surname = faker.person.lastName().replace(/'/g, "");
      const email = faker.internet.email({ firstName: name, lastName: surname, allowSpecialCharacters: false }).toLowerCase();
      return this.usersRepository.create({
        name,
        surname,
        email,
        password: hashedPassword,
        role: ENUMS.Role.USER,
      });
    });
    return usersEntities;
  }

  public async getGeneratedRows<T>(quantity: number): Promise<T> {
    const admins = await this.generateAdmins();
    const users = await this.generateUsers(quantity - admins.length);
    return [...admins, ...users] as T;
  }

  public async seed(quantity: number): Promise<void> {
    try {
      const existingCount = await this.usersRepository.count();
      if (existingCount >= quantity) return;

      const generatedRows = await this.getGeneratedRows<ENTITIES.User[]>(quantity);

      await this.usersRepository.save(generatedRows);
    } catch (error) {
      console.error('Error during seeding users:', error);
    }
  }
}
