import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SELECTION_OPTIONS } from '../constants';
import { MatchModel } from '../models/match.model';
import { PlayerModel } from '../models/player.model';
import { RoundModel } from '../models/round.model';
import { TeamModel } from '../models/team.model';
import { AuthService } from '../service/auth.service';
import { DataToSendService } from '../service/data-to-send.service';
import { ScorePageService } from '../service/score-page.service';

@Component({
  selector: 'app-match-page',
  templateUrl: './match-page.component.html',
  styleUrls: ['./match-page.component.scss'],
})
export class MatchPageComponent implements OnInit {
  isAdmin!: boolean;
  showScorePage = false;
  roundNumber!: string | null;
  teams: TeamModel[] = [];
  matchID!: string | null;
  homeTeam?: any;
  awayTeam?: any;
  matchInfo?: any;
  roundInfo?: any;
  fixture?: any;
  positions = SELECTION_OPTIONS;
  fetchingFixture?: Subscription;
  fetchedTeam?: Subscription;
  teamsTableData = [];
  fetchedTableData?: Subscription;
  constructor(
    private _Activatedroute: ActivatedRoute,
    private dataToSend: DataToSendService,
    private scorePageService: ScorePageService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin;
    this.dataToSend.getAllTeams();
    this.dataToSend.getAllRounds();
    this.scorePageService.getAllTableData();
    this.fixture = this.dataToSend.fixture;
    this._Activatedroute.paramMap.subscribe((params) => {
      this.roundNumber = params.get('round');
      this.matchID = params.get('matchID');
    });
    this.fetchingFixture = this.dataToSend.fixtureFetched.subscribe(
      (responseData: any) => {
        this.fixture = responseData;
        this.filterForMatch(this.fixture);
      }
    );
    this.fetchedTeam = this.dataToSend.teamFetched.subscribe(
      (responseData: any) => {
        this.teams = responseData;
        this.dataToSend.getAllRounds();
      }
    );
    this.fetchedTableData = this.scorePageService.tableDataFetched.subscribe((responseData: any) => {
      this.teamsTableData = responseData.filter((data: any) => {
        return data.matchID === this.matchID;
      })
      if (this.teamsTableData.length == 2) {
        this.showScorePage = true;
      }
    })
  }

  filterTeams(matchData: any, teams: TeamModel[]) {
    this.homeTeam = teams.filter((team) => {
      return this.matchInfo[0].homeTeam == team.name;
    });
    this.awayTeam = teams.filter((team) => {
      return this.matchInfo[0].awayTeam == team.name;
    });
    this.dataToSend.getTeamPlayers(this.homeTeam[0].name);
    this.dataToSend.getTeamPlayers(this.awayTeam[0].name);
  }

  filterForMatch(fixtureData: RoundModel[]) {
    let findRound = fixtureData.filter((round: RoundModel) => {
      return round.roundNumber.toString() == this.roundNumber;
    });
    this.roundInfo = findRound;
    this.matchInfo = findRound[0].matches.filter((match: MatchModel) => {
      return match.matchID.toString() == this.matchID;
    });
    if (this.teams.length > 1) {
      this.filterTeams(this.matchInfo[0], this.teams);
    }
  }

  playersSelection = new FormGroup({
    PG: new FormControl(''),
    SG: new FormControl(''),
    SF: new FormControl(''),
    PF: new FormControl(''),
    C: new FormControl(''),
    '6': new FormControl(''),
    '7': new FormControl(''),
    '8': new FormControl(''),
    '9': new FormControl(''),
    '10': new FormControl(''),
    R1: new FormControl(''),
    R2: new FormControl(''),
    aPG: new FormControl(''),
    aSG: new FormControl(''),
    aSF: new FormControl(''),
    aPF: new FormControl(''),
    aC: new FormControl(''),
    a6: new FormControl(''),
    a7: new FormControl(''),
    a8: new FormControl(''),
    a9: new FormControl(''),
    a10: new FormControl(''),
    aR1: new FormControl(''),
    aR2: new FormControl(''),
  });

  onSubmit() {
    this.matchInfo.playersSelected = this.playersSelection.value;
    this.showScorePage = !this.showScorePage;
    this.createTeamTableData(this.homeTeam[0]);
    this.createTeamTableData(this.awayTeam[0]);

    let editingMatch = this.matchInfo[0];
    let matchInfoUpdated: any = {
      ...editingMatch,
      isLive: true,
    };
    this.scorePageService.updateMatchInfo(this.roundInfo[0], matchInfoUpdated);
  }

  createTeamTableData(team: TeamModel) {
    let letsSelectPlayers = [];
    for (let positions of this.positions) {
      let multiplier = 0;
      switch (positions) {
        case 'PG':
        case 'SG':
        case 'SF':
        case 'PF':
        case 'C':
          multiplier = 1;
          break;
        case '6':
        case '7':
        case '8':
        case '9':
        case '10':
          multiplier = 0.5;
          break;
        case 'R1':
        case 'R2':
          multiplier = 0;
      }
      let awayPositions = 'a'+positions;
      let playerObject = {
        position: positions,
        multiplier: multiplier,
        realPoints: 0,
        player: team.playerList.filter((player: PlayerModel) => {
          return player.name === this.matchInfo.playersSelected[positions] || player.name === this.matchInfo.playersSelected[awayPositions];
        }),
      };
      letsSelectPlayers.push(playerObject);
    }

    let teamTableData = {
      matchID: this.matchID,
      teamName: team.name,
      playersSelected: letsSelectPlayers,
    };
    this.scorePageService.sendTeamTableData(teamTableData);
  }

  ngOnDestroy(): void {
    this.fetchingFixture?.unsubscribe();
    this.fetchedTeam?.unsubscribe();
    this.fetchedTableData?.unsubscribe();
  }
}
