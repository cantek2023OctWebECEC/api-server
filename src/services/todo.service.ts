import { Service } from "typedi";
import { pgDataSource } from "../config/ormconfig";
import { Todo, Trip, User } from "../database/postgres/entities";
import { logAsync } from "../utils/decorators/logDecorator";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { isNil, omitBy } from "lodash";

@Service()
export class TodoService {
	private todoRepo = pgDataSource.getRepository(Todo);
    private tripRepo = pgDataSource.getRepository(Trip);
    private userRepo = pgDataSource.getRepository(User);

	@logAsync()
	async create(todo: {
        assigneeId: string;
        tripId: string;
        title: string;
        description?: string;
    }) {
        const trip = await this.tripRepo.findOneBy({ id: todo.tripId });
        const user = await this.userRepo.findOneBy({ id: todo.assigneeId });
		const newTodo = Object.assign({}, new Todo(), todo, { assignee: user, trip, inprogress: false, done: false });
		return await this.todoRepo.save(newTodo);
	}
	@logAsync()
	async list(opt?: FindManyOptions<Todo>) {
		return await this.todoRepo.find(opt);
	}

	@logAsync()
	async show(opt: FindOneOptions<Todo>) {
		return await this.todoRepo.findOne(opt);
	}

	@logAsync()
	async update(id: string, todo: { assigneeId?: string; tripId?: string;  title?: string; description?: string, inprogress?: boolean; done?: boolean }) {
		const oldTodo = await this.show({ where: { id } }) || {};
        let user;
        let trip;
        if (todo.assigneeId) {
            user = this.userRepo.findOneBy({ id: todo.assigneeId });
        }
        if (todo.tripId) {
            trip = await this.tripRepo.findOneBy({ id: todo.tripId });
        }
        const updateTodo = omitBy({
            assignee: user,
            trip,
            title: todo.title,
            inprogress: todo.inprogress,
            done: todo.done,
            updatedAt: new Date().toISOString(),
        }, isNil);
        return await this.todoRepo.update(id, updateTodo)
	}

	@logAsync()
	async remove(id: string) {
		return await this.todoRepo.delete(id);
	}
}
