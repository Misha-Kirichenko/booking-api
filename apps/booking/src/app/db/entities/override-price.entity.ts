import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Room } from './room.entity';


@Index('IDX_room_day', ['room_id', 'day'])
@Entity('override_prices')
export class OverridePrice {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'date', nullable: false })
  day: string;

  @Column({ type: 'numeric', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: false, length: 100 })
  reason: string;

  @Column()
  room_id: number;

  @ManyToOne(() => Room, (room) => room.overridePrices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
