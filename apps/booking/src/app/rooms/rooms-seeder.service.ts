import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ENTITIES, INTERFACES } from "@common";
import { Repository } from "typeorm";
import { faker } from '@faker-js/faker';


@Injectable()
export class RoomsSeederService implements INTERFACES.ISeederService {
  private ovverridePricesToSeed: number;
  constructor(
    @InjectRepository(ENTITIES.Room)
    private readonly roomRepo: Repository<ENTITIES.Room>,
    @InjectRepository(ENTITIES.OverridePrice)
    private readonly overridePriceRepo: Repository<ENTITIES.OverridePrice>,
  ) {
    this.ovverridePricesToSeed = 10;
  }

  private async generateRooms(quantity: number): Promise<ENTITIES.Room[]> {
    const existing = await this.roomRepo.count();
    if (existing >= quantity) return [];

    const roomsEntities: ENTITIES.Room[] = [];

    for (let i = 1; i <= quantity; i++) {

      const room = this.roomRepo.create({
        num: i,
        price: parseFloat((100 + Math.random() * 100).toFixed(2)),
        description: faker.lorem.paragraph(),

        img_1: faker.image.urlLoremFlickr({ category: 'city' }),
        img_2: faker.image.urlLoremFlickr({ category: 'city' }),
        img_3: faker.image.urlLoremFlickr({ category: 'city' }),
        img_4: faker.image.urlLoremFlickr({ category: 'city' }),
      });

      roomsEntities.push(room);
    }

    return roomsEntities;
  }

  private async generateOverridePrices(rooms: ENTITIES.Room[]): Promise<ENTITIES.OverridePrice[]> {
    const overridePriceEntities: ENTITIES.OverridePrice[] = [];

    for (const room of rooms) {
      for (let i = 0; i < this.ovverridePricesToSeed; i++) {
        const futureDate = faker.date.soon({ days: 60 });
        const override = this.overridePriceRepo.create({
          day: futureDate.toISOString().split('T')[0],
          price: parseFloat((room.price + Math.random() * 50).toFixed(2)),
          reason: faker.lorem.words({ min: 1, max: 3 }),
          room: room,
        });
        overridePriceEntities.push(override);
      }
    }

    return overridePriceEntities;
  }

  public async getGeneratedRows<T>(quantity: number): Promise<T> {
    let overridePriceEntities: ENTITIES.OverridePrice[] = [];
    const roomsEntities = await this.generateRooms(quantity);
    if (roomsEntities.length === 0) {
      overridePriceEntities = await this.generateOverridePrices(roomsEntities);
    }
    return { roomsEntities, overridePriceEntities } as T;
  }

  public async seed(quantity: number): Promise<void> {
    try {
      const { roomsEntities, overridePriceEntities } = await this.getGeneratedRows<{ roomsEntities: ENTITIES.Room[], overridePriceEntities: ENTITIES.OverridePrice[] }>(quantity);
      if (roomsEntities.length) await this.roomRepo.save(roomsEntities);
      if (overridePriceEntities.length) await this.overridePriceRepo.save(overridePriceEntities);
    } catch (error) {
      console.error("❌ Rooms seeder error", error);
    }
  }
}
