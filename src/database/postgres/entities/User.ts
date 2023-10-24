import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToOne,
	ManyToMany,
} from "typeorm";
import Todo from "./Todo";
import Trip from "./Trip";
import Comment from "./Comment";

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

	@OneToMany(() => Todo, (todo) => todo.assignee)
	todos: Todo[];

	@Column({ type: "timestamptz", precision: 6, nullable: true })
	lastLogin: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
	
	@ManyToOne(() => Trip, (trip) => trip.organizer)
	hostedTrip: Trip[];

	@ManyToMany(() => Trip, (trip) => trip.participants)
	jointTrip: Trip[];

	@OneToMany(() => Comment, (comment) => comment.user)
	comments: Comment[];
}
export default User;
