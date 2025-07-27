import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Room } from "../db/entities/room.entity";
import { Repository } from "typeorm";
import { OverridePrice } from "../db/entities/override-price.entity";
import { faker } from '@faker-js/faker';

@Injectable()
export class RoomsSeederService {
  private ovverridePricesToSeed: number;
  constructor(
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    @InjectRepository(OverridePrice)
    private readonly overridePriceRepo: Repository<OverridePrice>,
  ) {
    this.ovverridePricesToSeed = 10;
  }

  private async seedRooms(quantity: number): Promise<Room[]> {
    const existing = await this.roomRepo.count();
    if (existing >= quantity) return [];

    const tags = [
      'hotel,room',
      'bedroom,interior',
      'luxury,hotel',
      'minimalist,room',
      'cozy,bedroom',
      'modern,hotel',
      'mountain,view,hotel',
      'bright,interior',
      'design,bedroom',
      'hotel,bathroom',
    ];

    const rooms: Room[] = [];

    for (let i = 1; i <= quantity; i++) {
      const tag = tags[i % tags.length];
      const sigBase = i * 10;

      const room = this.roomRepo.create({
        num: i,
        price: parseFloat((100 + Math.random() * 100).toFixed(2)),
        description: faker.lorem.paragraph(),

        img_1: `https://source.unsplash.com/640x480/?${tag}&sig=${sigBase + 1}`,
        img_2: `https://source.unsplash.com/640x480/?${tag}&sig=${sigBase + 2}`,
        img_3: `https://source.unsplash.com/640x480/?${tag}&sig=${sigBase + 3}`,
        img_4: `https://source.unsplash.com/640x480/?${tag}&sig=${sigBase + 4}`,
      });

      rooms.push(room);
    }

    return await this.roomRepo.save(rooms);
  }

  private async seedOverridePrices(rooms: Room[]): Promise<void> {
    const overridePrices: OverridePrice[] = [];

    for (const room of rooms) {
      for (let i = 0; i < this.ovverridePricesToSeed; i++) {
        const futureDate = faker.date.soon({ days: 60 });
        const override = this.overridePriceRepo.create({
          day: futureDate.toISOString().split('T')[0],
          price: parseFloat((room.price + Math.random() * 50).toFixed(2)),
          reason: faker.lorem.words({ min: 1, max: 3 }),
          room: room,
        });
        overridePrices.push(override);
      }
    }

    await this.overridePriceRepo.save(overridePrices);
  }

  public async seed(quantity = 100): Promise<void> {
    try {
      const rooms = await this.seedRooms(quantity);
      if (rooms.length > 0) {
        await this.seedOverridePrices(rooms);
        console.log(`✅ Seeded ${rooms.length} rooms and override prices.`);
      } else {
        console.log('ℹ️ Rooms already exist, skipping seeding.');
      }
    } catch (error) {
      console.error("❌ Rooms seeder error", error);
    }
  }
}
