import { Service } from "typedi";
import { pgDataSource } from "../config/ormconfig";
import { Comment, Trip, User } from "../database/postgres/entities";
import { logAsync } from "../utils/decorators/logDecorator";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { isNil, omitBy } from "lodash";

@Service()
export class CommentService {
	private commentRepo = pgDataSource.getRepository(Comment);
    private tripRepo = pgDataSource.getRepository(Trip);
    private userRepo = pgDataSource.getRepository(User);

	@logAsync()
	async create(comment: {
        userId: string;
        tripId: string;
        content: string;
    }) {
        const trip = await this.tripRepo.findOneBy({ id: comment.tripId });
        const user = await this.userRepo.findOneBy({ id: comment.userId });
		const newComment = Object.assign({}, new Comment(), comment, { user, trip });
		return await this.commentRepo.save(newComment);
	}

	@logAsync()
	async list(opt?: FindManyOptions<Comment>) {
		return await this.commentRepo.find(opt);
	}

	@logAsync()
	async show(opt: FindOneOptions<Comment>) {
		return await this.commentRepo.findOne(opt);
	}

	@logAsync()
	async update(id: string, comment: { userId?: string; tripId?: string;  content?: string; }) {
		const oldComment = await this.show({ where: { id } }) || {};
        let user;
        let trip;
        if (comment.userId) {
            user = this.userRepo.findOneBy({ id: comment.userId });
        }
        if (comment.tripId) {
            trip = await this.tripRepo.findOneBy({ id: comment.tripId });
        }
        const updateComment = omitBy({
            user,
            trip,
            content: comment.content,
            updatedAt: new Date().toISOString(),
        }, isNil);
        return await this.commentRepo.update(id, updateComment)
	}

	@logAsync()
	async remove(id: string) {
		return await this.commentRepo.delete(id);
	}
}
