export interface MatchModel {
    homeTeam: string,
    awayTeam: string,
    matchID: number,
    homeScore: number,
    awayScore: number,
    winner: string,
    isFinished: boolean,
    playersSelected: string[],
    isLive: boolean,
}