import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OverridePrice } from './override-price.entity';
import { Booking } from './booking.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'smallint', nullable: false })
  num: number;

  @Column({ type: 'numeric', nullable: false })
  price: number;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  img_1: string;

  @Column({ type: 'varchar', nullable: true })
  img_2: string;

  @Column({ type: 'varchar', nullable: true })
  img_3: string;

  @Column({ type: 'varchar', nullable: true })
  img_4: string;

  @OneToMany(() => OverridePrice, (overridePrice) => overridePrice.room, {
    cascade: ['remove'],
  })
  override_prices: OverridePrice[];

  @OneToMany(() => Booking, (bookings) => bookings.room, {
    cascade: ['remove'],
  })
  bookings: Booking[];
}
