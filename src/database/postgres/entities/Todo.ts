import {
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	JoinColumn,
	Column,
} from "typeorm";
import Trip from "./Trip";
import User from "./User";

@Entity()
export class Todo {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Trip, (trip) => trip.todos)
	@JoinColumn()
	trip: Trip;

	@ManyToOne(() => User, (user) => user.todos)
	@JoinColumn()
	assignee: User;

	@Column({ type: "varchar", length: 255, nullable: false })
	title: string;

	@Column({ type: "text", nullable: true })
	description: string | null;

	@Column({ type: "boolean", nullable: false, default: false })
	inprogress: boolean;

	@Column({ type: "boolean", nullable: false, default: false })
	done: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date | null;
}
export default Todo;
