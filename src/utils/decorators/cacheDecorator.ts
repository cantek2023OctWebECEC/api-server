import { client } from "../../config/cacheconfig";
import { logger } from "../logger";

// this will setup cache in redis if cache is empty or return cache from redis if there is cache ttl in s
export function useCache(key: string, ttl?: number) {
	return function (target: Object, propertyKey: string, descriptor: any) {
		const originalMethod = descriptor.value;
		descriptor.value = async function (...args: any[]) {
			if (!(await client.exists(key))) {
				const result = await originalMethod.apply(this, args);
				await client.set(key, JSON.stringify(result), { EX: ttl ?? 3600 * 24 }); //default cache for 1 day if no set
			}
			return JSON.parse((await client.get(key)) || "null");
		};
		return descriptor;
	};
}

// this will invalidate cache with keys
export function invalidateCache(key: string) {
	return function (target: Object, propertyKey: string, descriptor: any) {
		const originalMethod = descriptor.value;
		descriptor.value = async function (...args: any[]) {
			const result = await originalMethod.apply(this, args);
			await client.del(key);
			return result;
		};
		return descriptor;
	};
}
