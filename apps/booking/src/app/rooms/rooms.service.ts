import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Room } from "../db/entities/room.entity";
import { Repository } from "typeorm";
import { UTILS } from '@common';

const { RES_MESSAGE } = UTILS;

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
  ) { }

  public async getRoomsList(): Promise<Room[]> {
    const roomsList = await this.roomRepo.find({
      order: {
        num: "ASC",
      },
    });
    return roomsList;
  }


  public async getRoom(num: number): Promise<Room> {
    const room = await this.roomRepo.findOne({
      where: { num },
      relations: ['overridePrices'],
    });

    if (!room) {
      throw new NotFoundException(RES_MESSAGE.ERROR.NOT_FOUND("Room"));
    }

    return room;

  }
}
