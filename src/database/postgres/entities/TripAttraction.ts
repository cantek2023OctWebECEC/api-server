import { Column, Entity, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity("TripAttractions_pivot_table")
export default class TripAttraction {
	@CreateDateColumn({ type: "timestamp" })
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamp" })
	updatedAt: Date;

	@Column({ type: "int", nullable: false, default: 0 })
	order: number;

	@Column({ type: "varchar", primary: true, nullable: false })
	tripid: string;

	@Column({ type: "varchar", primary: true, nullable: false })
	attractionid: string;
}
