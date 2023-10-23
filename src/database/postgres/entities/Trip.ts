import Attraction from "./Attraction";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from ".";

@Entity()
export class Trip {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => User, (user) => user.trips)
	@JoinColumn()
	organizer: User;

	@Column({ type: "varchar", length: 255 })
	name: string;

	@Column({ type: "timestamptz", precision: 6, nullable: true })
	startDate: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date | null;

	@ManyToMany((type) => Attraction, (attraction) => attraction.trips)
	attractions: Attraction[];
}
export default Trip;
