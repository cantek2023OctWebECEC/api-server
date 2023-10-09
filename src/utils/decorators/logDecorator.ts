import { logger } from "../logger";

export function log() {
	return function (target: Object, propertyKey: string, descriptor: any) {
		const originalMethod = descriptor.value;
		descriptor.value = function (...args: any[]) {
			logger.info(`starting:${target.constructor.name}.${propertyKey}`);
			try {
				logger.debug(`${target.constructor.name}.${propertyKey} args: ${args}`);
				const result = originalMethod.apply(this, args);
				logger.debug(`${target.constructor.name}.${propertyKey} result: ${result}`);
				logger.info(`finished:${target.constructor.name}.${propertyKey}`);
				return result;
			} catch (err) {
				logger.error(`error:${target.constructor.name}.${propertyKey}`, err);
				throw err;
			}
		};
		return descriptor;
	};
}
export function logAsync() {
	return function (target: Object, propertyKey: string, descriptor: any) {
		const originalMethod = descriptor.value;
		descriptor.value = async function (...args: any[]) {
			logger.info(`starting:${target.constructor.name}.${propertyKey}`);
			try {
				logger.debug(`${target.constructor.name}.${propertyKey} args: ${args}`);
				const result = await originalMethod.apply(this, args);
				logger.debug(`${target.constructor.name}.${propertyKey} result: ${result}`);
				logger.info(`finished:${target.constructor.name}.${propertyKey}`);
				return result;
			} catch (err) {
				logger.error(`error:${target.constructor.name}.${propertyKey}`, err);
				throw err;
			}
		};
		return descriptor;
	};
}
