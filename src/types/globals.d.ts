/// <reference types="vite/client" />
import type { PlayerState } from './player-types';


declare global {
	var PLAYERS: PlayerState[];

	interface Window {
		THREE?: typeof import('three');
		PLAYERS?: PlayerState[];
	}
}

declare module '*.css' {
	const content: Record<string, string>;
	export default content;
}