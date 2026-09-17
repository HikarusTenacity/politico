import {SpaceDefinition} from "../types/board-types";

export const TOTAL_SPACES = 40; //36 normal, 4 corners
export const CORNER_MULT = 1.6;
export const PROPERTY_WIDTH = 1;
export const SCALE_MULTIPLIER = (
    2 * CORNER_MULT + //will always be 2 corners
    ((TOTAL_SPACES / 4) - 1) * PROPERTY_WIDTH
);
export const SCALE = 20 / SCALE_MULTIPLIER;
export const CORNER_SIZE = CORNER_MULT * SCALE;
export const PROPERTY_SIZE = PROPERTY_WIDTH * SCALE;

export const SPACE_DEFINITIONS: SpaceDefinition[] = [
    { id: 0, type: 'GO', name: 'Appropriations Committee' }, //bottom right
    { id: 1, type: 'TAX', name: 'Tax Bracket' },
    { id: 2, type: 'REROLL', name: 'Reroll Time' },
    { id: 3, type: 'NRA_COMMITTEE', name: 'House Judiciary Committee on Crime/Federal Government Surveillance' },
    { id: 4, type: 'CHANCE', name: 'Chance Space' },
    { id: 5, type: 'GENERAL_COMMITTEE', name: 'House Committee on Judiciary' },
    { id: 6, type: 'COMMUNITY_CHEST', name: 'Lobbyist/Fund Space' },
    { id: 7, type: 'NRA_COMMITTEE', name: 'Senate Judiciary Committee on Federal Rights' },
    { id: 8, type: 'NRA_COMMITTEE', name: 'Senate Judiciary Committee on Crime and Counterterrorism' },
    { id: 9, type: 'NRA_COMMITTEE', name: 'House Judiciary Committee on Constitution and Civil Crime' },
    { id: 10, type: 'JAIL', name: 'Conference Committee' }, //bottom left
    { id: 11, type: 'SIERRA_VS_AEA', name: 'House Committee on Energy and Commerce' },
    { id: 12, type: 'REROLL', name: 'Reroll Time' },
    { id: 13, type: 'MENTAL_HEALTH_COMMITTEE', name: 'Senate Committee on Health, Education, Labor, and Pensions' },
    { id: 14, type: 'CHANCE', name: 'Chance Space' },
    { id: 15, type: 'GENERAL_COMMITTEE', name: 'House Committee on Armed Services' },
    { id: 16, type: 'COMMUNITY_CHEST', name: 'Lobbyist/Fund Space' },
    { id: 17, type: 'MENTAL_HEALTH_COMMITTEE', name: 'House\'s Congressional Mental Health Caucus' },
    { id: 18, type: 'MENTAL_HEALTH_COMMITTEE', name: 'House Ways and Means Committee on Health' },
    { id: 19, type: 'MENTAL_HEALTH_COMMITTEE', name: 'Senate Mental Health Caucus' },
    { id: 20, type: 'POLITICO', name: 'POLITICO!' }, //top left
    { id: 21, type: 'TAX', name: 'Tax Bracket' },
    { id: 22, type: 'REROLL', name: 'Reroll Time' },
    { id: 23, type: 'SIERRA_CLUB_COMMITTEE', name: 'House Committee on Natural Resources: Water, Wildlife, and Fisheries' },
    { id: 24, type: 'CHANCE', name: 'Chance Space' },
    { id: 25, type: 'GENERAL_COMMITTEE', name: 'Senate Committee on Agriculture, Nutrition, and Forestry' },
    { id: 26, type: 'COMMUNITY_CHEST', name: 'Lobbyist/Fund Space' },
    { id: 27, type: 'SIERRA_CLUB_COMMITTEE', name: 'Senate Committee on Environment and Public Works: Waste Management, Environmental Justice, and Regulatory Oversight' },
    { id: 28, type: 'SIERRA_CLUB_COMMITTEE', name: 'House Committee on Transportation and Infrastructure: Water Resources and Environment' },
    { id: 29, type: 'SIERRA_CLUB_COMMITTEE', name: 'Senate Committee on Environment and Public Works: Water, Wildlife and Fisheries' },
    { id: 30, type: 'GO_TO_JAIL', name: 'Filibuster (Go to Conference Committee)' }, //top right
    { id: 31, type: 'MH_VS_NRA', name: 'House Committee on Natural Resources: Energy and Mineral Resources' },
    { id: 32, type: 'TAX', name: 'Tax Bracket' },
    { id: 33, type: 'AEA_COMMITTEE', name: 'House Committee on Ways and Means: Trade' },
    { id: 34, type: 'CHANCE', name: 'Chance Space' },
    { id: 35, type: 'GENERAL_COMMITTEE', name: 'House Committee on Education and Workforce' },
    { id: 36, type: 'COMMUNITY_CHEST', name: 'Lobbyist/Fund Space' },
    { id: 37, type: 'AEA_COMMITTEE', name: 'House Committee on Energy and Commerce, Subcommittee on Commerce, Manufacturing, and Trade' },
    { id: 38, type: 'AEA_COMMITTEE', name: 'Senate Committee on Commerce, Science, and Transportation: Surface Transportation, Freight, Pipelines, and Safety' },
    { id: 39, type: 'AEA_COMMITTEE', name: 'Senate Committee on Commerce, Science, and Transportation: Coast Guard, Maritime, and Fisheries' }
];

