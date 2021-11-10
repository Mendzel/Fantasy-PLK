import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlayoffMatchModel } from '../models/playoffMatch.model';
import { TeamModel } from '../models/team.model';
import { DataToSendService } from '../service/data-to-send.service';

@Component({
  selector: 'app-playoffs',
  templateUrl: './playoffs.component.html',
  styleUrls: ['./playoffs.component.scss']
})
export class PlayoffsComponent implements OnInit {
  teams?: TeamModel[];
  fetchingTeam?: Subscription;
  playoffMatches = [
    [
      {
        team1: 'Mokebe Power',
        team1Wins: 0,
        team2: 'Raca Squad',
        team2Wins: 0,
        roundNumber: 1,
        team1Data: {},
        team2Data: {},
      },
      {
        team1: 'Orki z Majorki',
        team1Wins: 0,
        team2: 'Dzikie Dziki',
        team2Wins: 0,
        roundNumber: 1,
        team1Data: {},
        team2Data: {},
      },
      {
        team1: 'Coconut Club',
        team1Wins: 0,
        team2: 'Alaskańskie Smoki',
        team2Wins: 0,
        roundNumber: 1,
        team1Data: {},
        team2Data: {},
      },
      {
        team1: 'Solidna Trumna',
        team1Wins: 0,
        team2: 'Białe Kaski Robią Laski',
        team2Wins: 0,
        roundNumber: 1,
        team1Data: {},
        team2Data: {},
      },
    ],
    [
      {
        team1: '?',
        team1Wins: 0,
        team2: '?',
        team2Wins: 0,
        roundNumber: 2,
        team1Data: {},
        team2Data: {},
      },
      {
        team1: '?',
        team1Wins: 0,
        team2: '?',
        team2Wins: 0,
        roundNumber: 2,
        team1Data: {},
        team2Data: {},
      },
    ],
    [
      {
        team1: '?',
        team1Wins: 0,
        team2: '?',
        team2Wins: 0,
        roundNumber: 3,
        team1Data: {},
        team2Data: {},
      }
    ],
    [
      {
        team1: '?',
        team1Wins: 0,
        team2: '?',
        team2Wins: 0,
        roundNumber: 4,
        team1Data: {},
        team2Data: {},
      }
    ]
  ]
  constructor(private dataToSend: DataToSendService) { }

  ngOnInit(): void {
    this.dataToSend.getAllTeams();
    this.fetchingTeam = this.dataToSend.teamFetched.subscribe((fetchedData: any) => {
      this.teams = fetchedData;
      for(let singleMatch of this.playoffMatches[0]){
        let selectedATeam = this.teams?.filter(team => {
          return team.name === singleMatch.team1;
        })
        if(selectedATeam?.[0]){
          singleMatch.team1Data = selectedATeam[0]
        };
        let selectedBTeam = this.teams?.filter(team => {
          return team.name === singleMatch.team2;
        })
        if(selectedBTeam?.[0]){
          singleMatch.team2Data = selectedBTeam[0]
        };
      }

    })
  }

}
