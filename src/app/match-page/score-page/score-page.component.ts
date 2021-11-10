import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SELECTION_OPTIONS } from 'src/app/constants';
import { PlayerModel } from 'src/app/models/player.model';
import { TeamModel } from 'src/app/models/team.model';
import { AuthService } from 'src/app/service/auth.service';
import { DataToSendService } from 'src/app/service/data-to-send.service';
import { ScorePageService } from 'src/app/service/score-page.service';

@Component({
  selector: 'app-score-page',
  templateUrl: './score-page.component.html',
  styleUrls: ['./score-page.component.scss'],
})
export class ScorePageComponent implements OnInit {
  @Input() teamsTableData!: any;
  @Input() homeTeam!: TeamModel;
  @Input() awayTeam!: TeamModel;
  @Input() matchInfo!: any;
  @Input() roundInfo!: any;
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
  constructor(private scorePageService: ScorePageService, private dataToSend: DataToSendService, private auth: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin;
    this.homeTeamTableData = this.teamsTableData.filter((object: any) => {
      return object.teamName === this.homeTeam.name;
    });
    this.awayTeamTableData = this.teamsTableData.filter((object: any) => {
      return object.teamName === this.awayTeam.name;
    });
    this.pointsEdited = this.scorePageService.dataChanged.subscribe((responseData: any) => {
      if(responseData[0].teamName === this.homeTeam.name){
        this.homeTeamTableData = responseData;
      }
      if(responseData[0].teamName === this.awayTeam.name){
        this.awayTeamTableData = responseData;
      }
      this.checkScore();
    })
    this.checkScore();
  }

  checkScore() {
    this.homeScore = 0;
    this.awayScore = 0;
    for (let player of this.homeTeamTableData[0].playersSelected) {
      this.homeScore += player.realPoints * player.multiplier;
    }
    for (let player of this.awayTeamTableData[0].playersSelected) {
      this.awayScore += player.realPoints * player.multiplier;
    }
  }

  confirmScore() {
    this.editMatchScore = !this.editMatchScore;
    this.calculateMatchInfo();
    this.newTeamValues(this.homeTeam, this.scoreForm.value.winner);
    this.newTeamValues(this.awayTeam, this.scoreForm.value.winner);
    this.newPlayerValues(this.homeTeamTableData[0].playersSelected);
    this.newPlayerValues(this.awayTeamTableData[0].playersSelected);
  }
  editHomePointsScored() {
    this.editHomeMode = !this.editHomeMode;
    this.setHomeCaptain(this.homePlayersPoints.value.captain);
    for (let i =0; this.homeTeamTableData[0].playersSelected.length > i; i++ ) {
      this.homeTeamTableData[0].playersSelected[i] = {
        realPoints: this.homePlayersPoints.value[this.matchPositions[i]],
        multiplier: this.homeTeamTableData[0].playersSelected[i].player[0].name === this.homeCaptain ? 1.5 : this.homeTeamTableData[0].playersSelected[i].multiplier,
        position: this.homeTeamTableData[0].playersSelected[i].position,
        player: this.homeTeamTableData[0].playersSelected[i].player
      };
    }
    this.scorePageService.sendEditedPoints(this.homeTeamTableData);
    this.liveScore('home');
  }
  editAwayPointsScored() {
    this.editAwayMode = !this.editAwayMode;
    this.setAwayCaptain(this.awayPlayersPoints.value.captain);
    for (let i =0; this.awayTeamTableData[0].playersSelected.length > i; i++ ) {
      this.awayTeamTableData[0].playersSelected[i] = {
        realPoints: this.awayPlayersPoints.value[this.matchPositions[i]],
        multiplier: this.awayTeamTableData[0].playersSelected[i].player[0].name === this.awayCaptain? 1.5 : this.awayTeamTableData[0].playersSelected[i].multiplier,
        position: this.awayTeamTableData[0].playersSelected[i].position,
        player: this.awayTeamTableData[0].playersSelected[i].player
      };
    }
    this.scorePageService.sendEditedPoints(this.awayTeamTableData);
    this.liveScore('away');
  }

  homePlayersPoints = new FormGroup({
    PG: new FormControl(''),
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
    winner: new FormControl(),
    isFinished: new FormControl(),
    isLive: new FormControl(),
  })

  liveScore(side: string){
    this.checkScore();
    let editingMatch = this.matchInfo[0];
    let matchInfoUpdated;
    if(side === 'home'){
      matchInfoUpdated = {
        ...editingMatch,
        homeScore: this.homeScore,
      };
    } else if (side === 'away') {
      matchInfoUpdated = {
        ...editingMatch,
        awayScore: this.awayScore,
      };
    }
    this.scorePageService.updateMatchInfo(this.roundInfo[0], matchInfoUpdated);
  }

  calculateMatchInfo(){
    let editingMatch = this.matchInfo[0];
    let matchInfoUpdated: any = {
      ...editingMatch,
      awayScore: this.awayScore,
      homeScore: this.homeScore,
      isFinished: this.scoreForm.value.isFinished,
      winner: this.scoreForm.value.winner,
      isLive: this.scoreForm.value.isLive,
  
    };
    this.scorePageService.updateMatchInfo(this.roundInfo[0], matchInfoUpdated);
  }

  newTeamValues(team: TeamModel, winner: string){
    let addWinValue = 0;
    let addLoseValue = 0;
    let addPointsValue = 0;
    let myScore = this.homeTeam.name === team.name ? this.homeScore : this.awayScore;
    let enemyScore = this.homeTeam.name === team.name ? this.awayScore : this.homeScore;
    if(winner ===  team.name){
      addWinValue = 1;
      addPointsValue = 2;
    } else {
      addLoseValue = 1;
      addPointsValue = 1;
    }
    let newTeam = {
      ...team,
      wins: team.wins +  addWinValue,
      loses: team.loses + addLoseValue,
      pointInTheLeague: team.pointInTheLeague + addPointsValue,
      pointsConceded: team.pointsConceded + enemyScore,
      pointsScored: team.pointsScored + myScore,
    }
    this.scorePageService.updateTeam(newTeam);
  }

  newPlayerValues(data: any){
    let availablePlayers = this.dataToSend.players;
    for(let player of data){
      let changingPlayer = availablePlayers.filter((playerPool: PlayerModel) => {
        return playerPool.name === player.player[0].name;
      })
      changingPlayer[0] = {
        ...changingPlayer[0],
        pointsScored: parseInt(changingPlayer[0].pointsScored) + parseInt(player.realPoints),
      }
      this.scorePageService.updatePlayerPoints(changingPlayer);
    }
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
      PG: this.homeTeamTableData[0].playersSelected[0].realPoints,
      SG: this.homeTeamTableData[0].playersSelected[1].realPoints,
      SF: this.homeTeamTableData[0].playersSelected[2].realPoints,
      PF: this.homeTeamTableData[0].playersSelected[3].realPoints,
      C: this.homeTeamTableData[0].playersSelected[4].realPoints,
      '6': this.homeTeamTableData[0].playersSelected[5].realPoints,
      '7': this.homeTeamTableData[0].playersSelected[6].realPoints,
      '8': this.homeTeamTableData[0].playersSelected[7].realPoints,
      '9': this.homeTeamTableData[0].playersSelected[8].realPoints,
      '10': this.homeTeamTableData[0].playersSelected[9].realPoints,
      R1: this.homeTeamTableData[0].playersSelected[10].realPoints,
      R2: this.homeTeamTableData[0].playersSelected[11].realPoints,
      captain: this.homeCaptain
    })
  }
  editAwayPoints(){
    this.editAwayMode = !this.editAwayMode;
    this.awayPlayersPoints.patchValue({
      PG: this.awayTeamTableData[0].playersSelected[0].realPoints,
      SG: this.awayTeamTableData[0].playersSelected[1].realPoints,
      SF: this.awayTeamTableData[0].playersSelected[2].realPoints,
      PF: this.awayTeamTableData[0].playersSelected[3].realPoints,
      C: this.awayTeamTableData[0].playersSelected[4].realPoints,
      '6': this.awayTeamTableData[0].playersSelected[5].realPoints,
      '7': this.awayTeamTableData[0].playersSelected[6].realPoints,
      '8': this.awayTeamTableData[0].playersSelected[7].realPoints,
      '9': this.awayTeamTableData[0].playersSelected[8].realPoints,
      '10': this.awayTeamTableData[0].playersSelected[9].realPoints,
      R1: this.awayTeamTableData[0].playersSelected[10].realPoints,
      R2: this.awayTeamTableData[0].playersSelected[11].realPoints,
      captain: this.awayCaptain
    })
  }
}
