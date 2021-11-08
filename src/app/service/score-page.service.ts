import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeamModel } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class ScorePageService {
  allTableData: any = [];
  tableDataFetched = new Subject();
  dataChanged = new Subject();
  constructor(private http: HttpClient) { }

  getAllTableData(){
    this.http.get('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/tableData.json').pipe(
      map((responseData: any) => {
        const objectsArray = [];
        for (const key in responseData) {
          objectsArray.push({ ...responseData[key],key: key});
        }
        return objectsArray;
      })
    )
    .subscribe((response) => {
      this.allTableData = response;
      this.tableDataFetched.next(response);
    });
  }

  sendTeamTableData(tableData: any){
    this.http.post('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/tableData.json', tableData).subscribe(responseData => {
    })
  }

  sendEditedPoints(dataToSend: any){
    this.http.put('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/tableData/' + dataToSend[0].key + '.json', dataToSend[0]).subscribe(responseData => {
      let arrayToSend = [];
      arrayToSend = [{...responseData}]
      this.dataChanged.next(arrayToSend);
    })
  }

  updateMatchInfo(round: any, updatedData: any){
    let index = round.matches.findIndex((match: any) => {
      return match.matchID == updatedData.matchID
    });
    round.matches[index] = updatedData;
    this.http.put('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/fixture/'+round.key + '.json', round).subscribe(responseData => {
    })
  }

  updateTeam(team: any){
    this.http.put('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/teams/'+team.key + '.json', team).subscribe(responseData => {
    })
  }

  updatePlayerPoints(player: any){
    this.http.put('https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/players/'+player[0].key + '.json', player[0]).subscribe(responseData => {
    });
  }
}
