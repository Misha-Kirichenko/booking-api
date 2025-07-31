import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ENTITIES } from "@common";
import { Repository } from "typeorm";
import { UTILS } from '@common';

const { RES_MESSAGE } = UTILS;

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(ENTITIES.Room)
    private readonly roomRepository: Repository<ENTITIES.Room>,
  ) { }

  public async getRoomsList(): Promise<ENTITIES.Room[]> {
    const roomsList = await this.roomRepository.find({
      order: {
        num: "ASC",
      },
    });
    return roomsList;
  }


  public async getRoom(num: number): Promise<ENTITIES.Room> {
    const room = await this.roomRepository.findOne({
      where: { num },
      relations: ['overridePrices'],
    });

    if (!room) {
      throw new NotFoundException(RES_MESSAGE.ERROR.NOT_FOUND("Room"));
    }

    return room;

  }
}
