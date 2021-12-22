import { Injectable } from '@angular/core';
import { PlayerModel } from '../models/player.model';
import { TeamModel } from '../models/team.model';
import { HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BASKETBALL_POSITIONS } from '../constants';
@Injectable({
  providedIn: 'root',
})
export class DataToSendService {
  databaseURL = 'http://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app'
  positions = BASKETBALL_POSITIONS;
  teams: any = [];
  players: any = [];
  fixture: any = [];
  playoffMatches: any = [];
  playerFetched = new Subject();
  teamFetched = new Subject();
  fixtureFetched = new Subject();
  playerEdited = new Subject();
  playoffMatchesFetched = new Subject();
  constructor(private http: HttpClient) { }

  getAllPlayers() {
    this.http.get('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/players.json').pipe(
      map((responseData: any) => {
        const objectsArray = [];
        for (const key in responseData) {
          objectsArray.push({ ...responseData[key],key: key});
        }
        return objectsArray;
      })
    )
    .subscribe((response) => {
      this.players = response;
      this.playerFetched.next(response);
    });
  }

  getAllTeams() {
    this.http.get('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/teams.json').pipe(
      map((responseData: any) => {
        const objectsArray = [];
        for (const key in responseData) {
          objectsArray.push({ ...responseData[key], key: key});
        }
        return objectsArray;
      })
    )
    .subscribe((response) => {
      this.teams = response;
      this.teamFetched.next(response);
    });
  }

  getAllRounds() {
    this.http.get('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/fixture.json').pipe(
      map((responseData: any) => {
        const objectsArray = [];
        for (const key in responseData) {
          objectsArray.push({ ...responseData[key], key: key});
        }
        return objectsArray;
      })
    )
    .subscribe((response) => {
      this.fixture = response;
      this.fixtureFetched.next(response);
    });
  }

  getAllPlayoffPairs() {
    this.http.get('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/playoffMatches.json').pipe(
      map((responseData: any) => {
        const objectsArray = [];
        for (const key in responseData) {
          objectsArray.push({ ...responseData[key], key: key});
        }
        return objectsArray;
      })
    )
    .subscribe((response) => {
      this.playoffMatches = response;
      this.playoffMatchesFetched.next(response);
    })
  }

  getTeamPlayers(teamName: string) {
    let teamIndex = this.teams.findIndex( (filteredTeam: TeamModel) => {
      return filteredTeam.name === teamName;
    })
    let playersArray: PlayerModel[] = [];
    for(let position of this.positions){
      let player = this.players.filter((player: PlayerModel) => {
        return player.fantasyTeam === teamName && player.position == position;
      });
      for(let i = 0; i < player.length; i++){
        playersArray.push(player[i])
      }
    }
    this.teams[teamIndex].playerList = playersArray;
  }

  sendNewPlayer(player: PlayerModel) {
    this.http.post('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/players.json', player).subscribe(responseData => {
      this.playerEdited.next(responseData);
    })
  }

  editPlayer(playerData: PlayerModel){
    const URL = 'https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/players/' + playerData.key + '.json';
    this.http.put(URL, playerData).subscribe(responseData => {
      this.playerEdited.next(responseData);
    });
    this.getAllPlayers();
  }

  deletePlayer(playerKey: string){
    this.http.delete('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/players/' + playerKey + '.json').subscribe(responseData => {
      this.playerEdited.next(responseData);
    })
  }
}
