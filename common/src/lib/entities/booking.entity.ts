import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Index('IDX_room_user_datefrom_dateto', ['room_id', 'user_id', 'dayFrom', 'dayTo'])
@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'date', nullable: false })
  dayFrom: string;

  @Column({ type: 'date', nullable: false })
  dayTo: string;

  @Column({ type: 'integer', nullable: false })
  room_id: number;

  @Column({ type: 'integer', nullable: false })
  user_id: number;

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
}
