import {
	CreateDateColumn,
	Entity,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
	Column,
} from "typeorm";
import Attraction from "./Attraction";
import Todo from "./Todo";
import User from "./User";
import Comment from "./Comment";

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

	@OneToMany((type) => Todo, (todo) => todo.trip)
	todos: Todo[];

	@OneToMany((type) => Comment, (comment) => comment.user)
	comments: Comment[];

	@ManyToMany((type) => User, (user) => user.jointTrip)
	participants: User[];
}
export default Trip;
