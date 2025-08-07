import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, BeforeInsert } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';
import { IOverridePriceEntry } from '../interfaces';

@Index('IDX_room_user_datefrom_dateto', ['room_id', 'user_id', 'day_from', 'day_to'])
@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'date', nullable: false })
  day_from: string;

  @Column({ type: 'date', nullable: false })
  day_to: string;

  @Column({ type: 'integer', nullable: false })
  room_id: number;

  @Column({ type: 'string', nullable: false })
  user_id: string;

  @ManyToOne(() => User, (user) => user.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Room, (room) => room.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column({ type: 'bigint', nullable: false })
  created_at: number;

  @Column({ type: 'numeric', nullable: false })
  snapshot_price: number;

  @Column({ type: 'numeric', nullable: false })
  total_price: number;

  @Column({ type: 'jsonb', nullable: true })
  override_prices: IOverridePriceEntry[];

  @BeforeInsert()
  setCreatedAt() {
    this.created_at = Date.now();
  }
}
