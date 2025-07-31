import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from '../enums';
import { Booking } from './booking.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  surname: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false, unique: false })
  password: string;

  @Column({ type: 'enum', enum: Role, nullable: false, default: Role.USER })
  role: Role;

  @Column({ type: 'boolean', nullable: true, default: null })
  blocked: boolean | null;

  @Column({ type: 'varchar', nullable: true, unique: false, default: null })
  blockReason: string;

  @OneToMany(() => Booking, (booking) => booking.user, {
    cascade: ['remove'],
  })
  bookings: Booking[];

  @Column({ type: 'bigint', nullable: false, default: 0 })
  lastLogin: number;
}
