export interface BoardSpace {
    id: number,
    name?: string,
    type: SpaceType,
    bounds: BoardBounds,
    centerX: number,
    centerZ: number,
    width: number,
    depth: number
}

export interface BoardBounds {
    xMin: number;
    xMax: number;
    zMin: number;
    zMax: number;
}

export type SpaceType =
    | 'GO'
    | 'TAX'
    | 'REROLL'
    | 'CHANCE'
    | 'COMMUNITY_CHEST'
    | 'JAIL'
    | 'POLITICO'
    | 'GO_TO_JAIL'
    | 'NRA_COMMITTEE'
    | 'MENTAL_HEALTH_COMMITTEE'
    | 'AEA_COMMITTEE'
    | 'SIERRA_CLUB_COMMITTEE'
    | 'GENERAL_COMMITTEE'
    | 'SIERRA_VS_AEA'
    | 'MH_VS_NRA';

export interface SpaceDefinition {
    id: number;
    type: SpaceType;
    name: string;
}