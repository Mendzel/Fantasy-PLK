import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SELECTION_OPTIONS } from 'src/app/constants';
import { TeamModel } from 'src/app/models/team.model';
import { AuthService } from 'src/app/service/auth.service';
import { PlayoffPageService } from 'src/app/service/playoff-page.service';

@Component({
  selector: 'app-playoff-score-page',
  templateUrl: './playoff-score-page.component.html',
  styleUrls: ['./playoff-score-page.component.scss']
})
export class PlayoffScorePageComponent implements OnInit {
  teamsTableData = [];
  @Input() homeTeam!: TeamModel;
  @Input() awayTeam!: TeamModel;
  @Input() matchInfo!: any;
  @Input() selectedGame: any;
  @Input() playersToShow: any;
  @Input() gamesKeys: any;
  isAdmin!: boolean;
  homeTeamTableData!: any;
  awayTeamTableData!: any;
  homeCaptain = '';
  awayCaptain = '';
  homeScore = 0;
  awayScore = 0;
  editHomeMode = false;
  editAwayMode = false;
  editMatchScore = false;
  displayedColumns: string[] = [
    'position',
    'name',
    'realPoints',
    'matchPoints',
  ];
  displayedAwayColumns: string[] = [
    'a_matchPoints',
    'a_realPoints',
    'a_name',
    'a_position',
  ];
  displayedAwayColumnsMobile: string[] = [
    'a_position',
    'a_name',
    'a_realPoints',
    'a_matchPoints',
  ];
  matchPositions = SELECTION_OPTIONS;
  pointsEdited?: Subscription;
  playersSelected?: Subscription;
  constructor(private playoffPageService: PlayoffPageService, private auth: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin;
    if(this.playersToShow){
      this.homeTeamTableData = this.playersToShow[0];
      this.awayTeamTableData = this.playersToShow[1];
    }
    this.playersSelected = this.playoffPageService.selectedPlayers.subscribe((responseData: any) => {
      this.homeTeamTableData = responseData[0];
      this.awayTeamTableData = responseData[1];
    })
    this.pointsEdited = this.playoffPageService.dataChanged.subscribe((responseData: any) => {
      if(responseData[0].teamName === this.homeTeam.name){
        this.homeTeamTableData = responseData[0];
      }
      if(responseData[0].teamName === this.awayTeam.name){
        this.awayTeamTableData = responseData[0];
      }
      this.checkScore();
    })
    if(this.homeTeamTableData && this.awayTeamTableData) {
      this.checkScore();
    }
  }

  checkScore() {
    this.homeScore = 0;
    this.awayScore = 0;
    for (let player of this.homeTeamTableData.playersSelected) {
      this.homeScore += player.realPoints * player.multiplier;
    }
    for (let player of this.awayTeamTableData.playersSelected) {
      this.awayScore += player.realPoints * player.multiplier;
    }
  }

  confirmScore() {
    this.editMatchScore = !this.editMatchScore;
    this.playoffPageService.confirmScore(this.scoreForm.value.winner, this.matchInfo, this.gamesKeys[this.selectedGame - 1]);
  }

  editHomePointsScored() {
    this.editHomeMode = !this.editHomeMode;
    this.setHomeCaptain(this.homePlayersPoints.value.captain);
    for (let i =0; this.homeTeamTableData.playersSelected.length > i; i++ ) {
      this.homeTeamTableData.playersSelected[i] = {
        realPoints: this.homePlayersPoints.value[this.matchPositions[i]],
        multiplier: this.homeTeamTableData.playersSelected[i].player[0].name === this.homeCaptain ? 1.5 : this.homeTeamTableData.playersSelected[i].multiplier,
        position: this.homeTeamTableData.playersSelected[i].position,
        player: this.homeTeamTableData.playersSelected[i].player
      };
    }
    this.playoffPageService.sendEditedPoints(this.homeTeamTableData, this.matchInfo, this.gamesKeys[this.selectedGame - 1], 0);
    this.liveScore();
  }
  editAwayPointsScored() {
    this.editAwayMode = !this.editAwayMode;
    this.setAwayCaptain(this.awayPlayersPoints.value.captain);
    for (let i =0; this.awayTeamTableData.playersSelected.length > i; i++ ) {
      this.awayTeamTableData.playersSelected[i] = {
        realPoints: this.awayPlayersPoints.value[this.matchPositions[i]],
        multiplier: this.awayTeamTableData.playersSelected[i].player[0].name === this.awayCaptain? 1.5 : this.awayTeamTableData.playersSelected[i].multiplier,
        position: this.awayTeamTableData.playersSelected[i].position,
        player: this.awayTeamTableData.playersSelected[i].player
      };
    }
    this.playoffPageService.sendEditedPoints(this.awayTeamTableData, this.matchInfo, this.gamesKeys[this.selectedGame - 1], 1);
    this.liveScore();
  }

  homePlayersPoints = new FormGroup({
    PG: new FormControl(),
    SG: new FormControl(),
    SF: new FormControl(),
    PF: new FormControl(),
    C: new FormControl(),
    '6': new FormControl(),
    '7': new FormControl(),
    '8': new FormControl(),
    '9': new FormControl(),
    '10': new FormControl(),
    R1: new FormControl(),
    R2: new FormControl(),
    captain: new FormControl(),
  });

  awayPlayersPoints = new FormGroup({
    PG: new FormControl(),
    SG: new FormControl(),
    SF: new FormControl(),
    PF: new FormControl(),
    C: new FormControl(),
    '6': new FormControl(),
    '7': new FormControl(),
    '8': new FormControl(),
    '9': new FormControl(),
    '10': new FormControl(),
    R1: new FormControl(),
    R2: new FormControl(),
    captain: new FormControl(),
  });

  scoreForm = new FormGroup({
    winner: new FormControl()
  })

  liveScore(){
    this.checkScore();
    let key = this.gamesKeys[this.selectedGame - 1];
    let editingMatch = this.matchInfo.games[key];
    let matchInfoUpdated: any = {
      ...editingMatch,
        homeScore: this.homeScore,
        awayScore: this.awayScore,
    }
    this.playoffPageService.updateScore(matchInfoUpdated, this.matchInfo, key);
  }

  setHomeCaptain(captain: string){
    this.homeCaptain = captain;
  }
  setAwayCaptain(captain: string){
    this.awayCaptain = captain;
  }

  editHomePoints(){
    this.editHomeMode = !this.editHomeMode;
    this.homePlayersPoints.patchValue({
      PG: this.homeTeamTableData.playersSelected[0].realPoints,
      SG: this.homeTeamTableData.playersSelected[1].realPoints,
      SF: this.homeTeamTableData.playersSelected[2].realPoints,
      PF: this.homeTeamTableData.playersSelected[3].realPoints,
      C: this.homeTeamTableData.playersSelected[4].realPoints,
      '6': this.homeTeamTableData.playersSelected[5].realPoints,
      '7': this.homeTeamTableData.playersSelected[6].realPoints,
      '8': this.homeTeamTableData.playersSelected[7].realPoints,
      '9': this.homeTeamTableData.playersSelected[8].realPoints,
      '10': this.homeTeamTableData.playersSelected[9].realPoints,
      R1: this.homeTeamTableData.playersSelected[10].realPoints,
      R2: this.homeTeamTableData.playersSelected[11].realPoints,
      captain: this.homeCaptain
    })
  }
  editAwayPoints(){
    this.editAwayMode = !this.editAwayMode;
    this.awayPlayersPoints.patchValue({
      PG: this.awayTeamTableData.playersSelected[0].realPoints,
      SG: this.awayTeamTableData.playersSelected[1].realPoints,
      SF: this.awayTeamTableData.playersSelected[2].realPoints,
      PF: this.awayTeamTableData.playersSelected[3].realPoints,
      C: this.awayTeamTableData.playersSelected[4].realPoints,
      '6': this.awayTeamTableData.playersSelected[5].realPoints,
      '7': this.awayTeamTableData.playersSelected[6].realPoints,
      '8': this.awayTeamTableData.playersSelected[7].realPoints,
      '9': this.awayTeamTableData.playersSelected[8].realPoints,
      '10': this.awayTeamTableData.playersSelected[9].realPoints,
      R1: this.awayTeamTableData.playersSelected[10].realPoints,
      R2: this.awayTeamTableData.playersSelected[11].realPoints,
      captain: this.awayCaptain
    })
  }
}
