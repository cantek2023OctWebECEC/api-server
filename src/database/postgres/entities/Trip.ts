import { CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Attraction from "./Attraction";
import Todo from "./Todo";
import User from "./User";
import Comment from "./Comment";

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

	@OneToMany((type) => Todo, (todo) => todo.trip)
	todos: Todo[];

	@OneToMany((type) => Comment, (comment) => comment.user)
	comments: Comment[];

	@ManyToMany((type) => User, (user) => user.jointTrip)
	participants: User[];
}
export default Trip;
