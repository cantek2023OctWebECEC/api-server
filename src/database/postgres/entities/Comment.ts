import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import User from "./User";
import Trip from "./Trip";

@Entity()
export class Comment {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "text", nullable: false })
	content: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date | null;

	@ManyToOne((type)=>User, (user)=>user.comments)
	@JoinColumn()
	user:User
	
	@ManyToOne((type)=>Trip,(trip)=>trip.comments)
	@JoinColumn()
	trip:Trip
}
export default Comment;
