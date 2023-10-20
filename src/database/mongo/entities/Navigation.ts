import { Entity, ObjectId, ObjectIdColumn , Column, Point, Index } from "typeorm"
import { Metadata, Feature } from "../../../utils/types/DirectionResponse";


@Entity()
export class Navigation {
    @ObjectIdColumn ()
    _id: ObjectId;

    @Index ()
    @Column ({ unique: true })
    coordinates: string;

    @Column ()
    profile: string;

    @Column ()
    type: string;

    @Column ()
	metadata: object;

    @Column ()
	bbox: number[];

    @Column ()
	features: Array<object>;

    @Column ()
	timestamp: string;
}

export default Navigation;