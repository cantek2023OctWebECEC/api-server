import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { GeoJSON } from "../../../utils/types/GeoJSON";
import Trip from "./Trip";

@Entity()
export default class Attraction {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	name: string;

	@Column({ type: "varchar", length: 10, nullable: false })
	postal_code: string;

	@Column({ type: "text", nullable: true })
	description: string | null;

	@Column({ type: "geometry", spatialFeatureType: "Point" })
	location: GeoJSON.Point;

	@Column({ type: "text", nullable: true })
	address_full: string | null;

	@Column({ type: "varchar", length: 255, nullable: true })
	category: string | null;

	@Column({ type: "varchar", length: 255, nullable: true })
	email: string | null;

	@Column({ type: "varchar", length: 50, nullable: true })
	phone: string | null;

	@Column({ type: "varchar", length: 1000, nullable: true })
	website: string | null;

	@ManyToMany((type) => Trip, (trip) => trip.attractions)
	trips: Trip[];
}
