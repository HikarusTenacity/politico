/// <reference types="vite/client" />

import type { Player } from './player-types';

declare global {
	let PLAYERS: Player[];

	interface Window {
		THREE?: typeof import('three');
		PLAYERS?: Player[];
	}
}

declare module '*.css' {
	const content: Record<string, string>;
	export default content;
}