import { MatchModel } from "./match.model";

export interface RoundModel {
    matches: MatchModel[],
    roundNumber: number,
}