import { MatchModel } from "./match.model";
import { TeamModel } from "./team.model";

export interface PlayoffMatchModel {
    team1: string,
    team1Wins: number,
    team2: string,
    team2Wins: number,
    roundNumber: number,
    team1Data: TeamModel,
    team2Data: TeamModel,
    // allMatches: MatchModel[],
}