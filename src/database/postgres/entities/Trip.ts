import { CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Attraction from "./Attraction";

@Entity()
export class Trip {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date | null;

	@ManyToMany((type) => Attraction, (attraction) => attraction.trips)
	attractions: Attraction[];
}
export default Trip;
