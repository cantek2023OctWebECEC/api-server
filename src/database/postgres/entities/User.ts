import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

	@Column({ type: "timestamptz", precision: 6, nullable: true })
	lastLogin: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
export default User;
