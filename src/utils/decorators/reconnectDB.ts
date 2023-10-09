import { client } from "../../config/cacheconfig";
import { mgDataSource, pgDataSource } from "../../config/ormconfig";

// this decorator ensure DB must be connected prior function call
export function reconnectDB(requirementArr: ("mg" | "pg" | "rd")[]) {
	return function (target: Object, propertyKey: string, descriptor: any) {
		const originalMethod = descriptor.value;
		descriptor.value = async function (...args: any[]) {
			const requiredDS = requirementArr.length === 0 ? ["mg", "pg", "rd"] : requirementArr;
			if (!pgDataSource.isInitialized && requiredDS.includes("pg")) {
				await pgDataSource.initialize();
			}
			if (!mgDataSource.isInitialized && requiredDS.includes("mg")) {
				await mgDataSource.initialize();
			}
			if (!client.isReady && requiredDS.includes("rd")) {
				await client.connect();
			}
			return await originalMethod.apply(this, args);
		};
		return descriptor;
	};
}
