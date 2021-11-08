import { PlayerModel } from "./player.model";

export interface TeamModel {
    name: string;
    logoURL: string;
    colorPrimary: string;
    colorSecondary: string;
    playerList: PlayerModel[];
    pointInTheLeague: number;
    wins: number;
    loses: number;
    pointsScored: number;
    pointsConceded: number;
    coach: string;
    transfersLeft: number;
}