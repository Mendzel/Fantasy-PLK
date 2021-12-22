import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayoffPageService {
  constructor(private http: HttpClient) { }
  dataChanged = new Subject();
  selectedPlayers = new Subject();
  sendSelectedPlayers(players: any, matchInfo: any){
    players = {
      ...players,
      homeScore: 0,
      awayScore: 0,
      winner: 'none'
    }
    this.http.post('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/playoffMatches/' + matchInfo.key + '/' + matchInfo.matchIndex + '/games.json', players).subscribe(responseData => {
      this.selectedPlayers.next(players);
    })
  }

  sendEditedPoints(playersScore: any, matchInfo: any, key: string, whichTeam: number){
    this.http.put('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/playoffMatches/' + matchInfo.key + '/' + matchInfo.matchIndex + '/games/' + key + '/' + whichTeam + '.json', playersScore).subscribe(responseData => {
      let arrayToSend = [];
      arrayToSend = [{...responseData}]
      this.dataChanged.next(arrayToSend);
    })
  }

  updateScore(updateInfo: any, matchInfo: any, key: string) {
    this.http.put('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/playoffMatches/' + matchInfo.key + '/' + matchInfo.matchIndex + '/games/' + key + '.json', updateInfo).subscribe(responseData => {
    })
  }

  confirmScore(winner: string, matchInfo: any, key: string){
    if (winner === matchInfo.team1){
      matchInfo = {
        ...matchInfo,
        team1Wins: matchInfo.team1Wins + 1
      }
    } else if(winner === matchInfo.team2){
      matchInfo = {
        ...matchInfo,
        team2Wins: matchInfo.team2Wins + 1
      }
    }
    this.http.put('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/playoffMatches/' + matchInfo.key + '/' + matchInfo.matchIndex + '.json', matchInfo).subscribe(responseData => {
    })
  }
}
