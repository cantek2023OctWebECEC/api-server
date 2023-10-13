export interface OpenRouteServiceDirectionResponse {
	bbox: number[];
	routes: Route[];
	metadata: Metadata;
	timestamp: string;
}

export interface Route {
	summary: Summary;
	segments: Segment[];
	bbox: number[];
	geometry: string;
	way_points: number[];
	legs: any[];
}

export interface Summary {
	distance: number;
	duration: number;
}

export interface Segment {
	distance: number;
	duration: number;
	steps: Step[];
}

export interface Step {
	distance: number;
	duration: number;
	type: number;
	instruction: string;
	name: string;
	way_points: number[];
}

export interface Metadata {
	attribution: string;
	service: string;
	timestamp: number;
	query: Query;
	engine: Engine;
}

export interface Query {
	coordinates: number[][];
	profile: string;
	format: string;
}

export interface Engine {
	version: string;
	build_date: string;
	graph_date: string;
}
