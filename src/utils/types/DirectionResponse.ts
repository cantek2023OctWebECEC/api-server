export interface OpenRouteServiceDirectionResponse {
	type: string;
	metadata: Metadata;
	bbox: number[];
	features: Feature[];
	timestamp: string;
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

export interface Feature {
	bbox: number[];
	type: string;
	properties: Properties;
	geometry: Geometry;
}

export interface Properties {
	transfers: number;
	fare: number;
	segments: Segment[];
	way_points: number[];
	summary: Summary;
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

export interface Summary {
	distance: number;
	duration: number;
}

export interface Geometry {
	coordinates: number[][];
	type: string;
}
