import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatchModel } from 'src/app/models/match.model';
import { RoundModel } from 'src/app/models/round.model';
import { DataToSendService } from 'src/app/service/data-to-send.service';

@Component({
  selector: 'app-fixture',
  templateUrl: './fixture.component.html',
  styleUrls: ['./fixture.component.scss']
})
export class FixtureComponent implements OnInit {
  teams!: any;
  fixture!: any;
  defaultRound = 14;
  currentRound: number = 0;
  currentRoundFixture!: RoundModel;
  fetchedTeam!: Subscription;
  fetchedFixture!: Subscription;
  constructor(private dataToSend: DataToSendService) { }

  ngOnInit(): void {
    this.currentRound = this.defaultRound;
    this.dataToSend.getAllRounds();
    this.fetchedTeam = this.dataToSend.teamFetched.subscribe(responseData => {
      this.teams = responseData;
    })
    this.fetchedFixture = this.dataToSend.fixtureFetched.subscribe(responseData => {
      this.fixture = responseData;
      this.currentRoundFixture = this.fixture[this.currentRound - 1];
    })
  }

  roundBack(){
    this.currentRound -= 1;
    this.dataToSend.getAllRounds();
  }

  roundForward(){
    this.currentRound += 1;
    this.dataToSend.getAllRounds();
  }

  assignTeamLogo(teamName: string) {
    switch(teamName){
      case 'My Power':
        return 'https://i.imgur.com/9S1eQlZ.png'
      case 'Coconut Club':
        return 'https://i.imgur.com/LXxywEj.png'
      case 'Dzikie Dziki':
        return 'https://i.imgur.com/AKgK3Du.png'
      case 'BKRL':
        return 'https://i.imgur.com/5pE9z6V.png'
      case 'Orki z Majorki':
        return 'https://i.imgur.com/VXzRtVU.png'
      case 'Raca Squad':
        return 'https://i.imgur.com/gJEixjp.png'
      case 'Alaskańskie Smoki':
        return 'https://i.imgur.com/e9IglWF.png'
      case 'Solidna Trumna':
        return 'https://i.imgur.com/Y2YwseE.png'
    }
    return
  }
}
