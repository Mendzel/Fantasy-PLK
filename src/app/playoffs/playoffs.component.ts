import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { PlayoffMatchModel } from '../models/playoffMatch.model';
import { TeamModel } from '../models/team.model';
import { HttpClient } from '@angular/common/http';
import { DataToSendService } from '../service/data-to-send.service';

@Component({
  selector: 'app-playoffs',
  templateUrl: './playoffs.component.html',
  styleUrls: ['./playoffs.component.scss'],
})
export class PlayoffsComponent implements OnInit {
  teams?: TeamModel[];
  fetchingTeam?: Subscription;
  dataSent = new Subject();
  fetchingMatches?: Subscription;
  playoffMatches: any;
  // playOffMatchToSend: any = [];
  constructor(
    private dataToSend: DataToSendService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.dataToSend.getAllPlayoffPairs();
    this.fetchingMatches = this.dataToSend.playoffMatchesFetched.subscribe(
      (fetchedData: any) => {
        this.playoffMatches = fetchedData;
        // console.log(this.playoffMatches);
        // this.dataToSend.getAllTeams();
        // this.fetchingTeam = this.dataToSend.teamFetched.subscribe(
        //   (fetchedData: any) => {
        //     this.teams = fetchedData;
        //     let match: any = [];
        //     match.push(this.playoffMatches[1][0]);
        //     match.push(this.playoffMatches[1][1]);
        //     for (let singleMatch of match) {
        //       let selectedATeam = this.teams?.filter((team) => {
        //         return team.name === singleMatch.team1;
        //       });
        //       if (selectedATeam?.[0]) {
        //         singleMatch.team1Data = selectedATeam[0];
        //       }
        //       let selectedBTeam = this.teams?.filter((team) => {
        //         return team.name === singleMatch.team2;
        //       });
        //       if (selectedBTeam?.[0]) {
        //         singleMatch.team2Data = selectedBTeam[0];
        //       }
        //       this.playOffMatchToSend.push(singleMatch);
        //       console.log(singleMatch);
        //     }
        //   }
        // );
      }
    );
  }

  // sendData(matches: any, key: string) {
  //   console.log(matches);
  //   this.http
  //     .post(
  //       'https://fantasy-plk-default-rtdb.europe-west1.firebasedatabase.app/playoffMatches/' + key + |,
  //       matches
  //     )
  //     .subscribe((responseData) => {
  //       this.dataSent.next(responseData);
  //     });
  // }
}
