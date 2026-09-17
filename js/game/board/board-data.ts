import * as BoardTypes from "../types/board-types";
import {SPACE_DEFINITIONS} from "../constants/board-parameters";


export const SPACE_DEFINITIONS_BY_ID: Record<number, BoardTypes.SpaceDefinition> = {};

for (const element of SPACE_DEFINITIONS) {
    const def = element;
    SPACE_DEFINITIONS_BY_ID[def.id] = def;
}