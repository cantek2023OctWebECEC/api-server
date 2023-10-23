import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Trip } from ".";

@Entity()
class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 255 })
	username: string;

	@Column({ type: "varchar", length: 255 })
	email: string;

	@Column({ type: "varchar", length: 255 })
	password: string;

	@OneToMany(() => Trip, (trip) => trip.organizer)
	trips: Trip[];

	@Column({ type: "timestamptz", precision: 6, nullable: true })
	lastLogin: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
export default User;
