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
	JoinTable,
} from "typeorm";
import Attraction from "./Attraction";
import Todo from "./Todo";
import User from "./User";
import Comment from "./Comment";

@Entity()
export class Trip {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => User, (user) => user.hostedTrip, {})
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

	@ManyToMany((type) => Attraction, (attraction) => attraction.trips, { onDelete: "CASCADE" })
	@JoinTable({
		name: "TripAttractions_pivot_table",
		joinColumn: {
			name: "tripid",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "attractionid",
			referencedColumnName: "id",
		},
	})
	attractions: Attraction[];

	@OneToMany((type) => Todo, (todo) => todo.trip, {})
	todos: Todo[];

	@OneToMany((type) => Comment, (comment) => comment.user, {})
	comments: Comment[];

	@ManyToMany((type) => User, (user) => user.jointTrip, { onDelete: "CASCADE" })
	@JoinTable()
	participants: User[];
}
export default Trip;
