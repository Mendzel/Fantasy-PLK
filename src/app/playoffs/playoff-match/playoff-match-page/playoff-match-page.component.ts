import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlayoffPageService } from 'src/app/service/playoff-page.service';
import { SELECTION_OPTIONS } from '../../../constants';
import { PlayerModel } from '../../../models/player.model';
import { TeamModel } from '../../../models/team.model';
import { AuthService } from '../../../service/auth.service';
import { DataToSendService } from '../../../service/data-to-send.service';

@Component({
  selector: 'app-playoff-match-page',
  templateUrl: './playoff-match-page.component.html',
  styleUrls: ['./playoff-match-page.component.scss'],
})
export class PlayoffMatchPageComponent implements OnInit {
  isAdmin!: boolean;
  showScorePage = false;
  roundNumber!: string | null;
  homeTeam?: any;
  awayTeam?: any;
  matchInfo?: any;
  playersToShow?: any;
  teamsTableData: any;
  positions = SELECTION_OPTIONS;
  games = [1, 2, 3, 4, 5];
  selectedGame = 1;
  playersSelected: any;
  gamesKeys: any;
  constructor(
    private _Activatedroute: ActivatedRoute,
    private playoffPageService: PlayoffPageService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin;
    this._Activatedroute.paramMap.subscribe((params) => {
      let obj = params.get('my_Obj');
      if (obj && typeof obj === 'string') {
        this.matchInfo = JSON.parse(obj);
      }
    });
    this.homeTeam = this.matchInfo.team1Data;
    this.awayTeam = this.matchInfo.team2Data;
    this.roundNumber = this.setRoundName(this.matchInfo.roundNumber.toString());
    if (this.matchInfo.games){
      if (
        this.matchInfo.games[
          Object.keys(this.matchInfo.games)[this.selectedGame - 1]
        ][0].playersSelected.length === 12 &&
        this.matchInfo.games[
          Object.keys(this.matchInfo.games)[this.selectedGame - 1]
        ][1].playersSelected.length === 12
      ) {
        this.showScorePage = true;
      }
    this.gamesKeys = Object.keys(this.matchInfo.games);
    this.playersToShow = this.matchInfo.games[Object.keys(this.matchInfo.games)[this.selectedGame - 1]];
    }
  }

  setRoundName(number: string | null) {
    switch (number) {
      case '1':
        return 'Ćwierćfinał';
      case '2':
        return 'Półfinał';
      case '3':
        return 'Mecz o 3 miejsce';
      case '4':
        return 'Finał';
      default:
        return 'Playoffs';
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
    this.playersSelected = this.playersSelection.value;
    this.showScorePage = !this.showScorePage;
    let selectionToSend = [
      this.createTeamTableData(this.homeTeam),
      this.createTeamTableData(this.awayTeam),
    ];
    this.playoffPageService.sendSelectedPlayers(
      selectionToSend,
      this.matchInfo
    );
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
      let awayPositions = 'a' + positions;
      let playerObject = {
        position: positions,
        multiplier: multiplier,
        realPoints: 0,
        player: team.playerList.filter((player: PlayerModel) => {
          return (
            player.name === this.playersSelected[positions] ||
            player.name === this.playersSelected[awayPositions]
          );
        }),
      };
      letsSelectPlayers.push(playerObject);
    }

    let teamTableData = {
      teamName: team.name,
      playersSelected: letsSelectPlayers,
    };
    return teamTableData;
  }

  onSelectionChange(ev: any){
    this.showScorePage = false;
    this.playersToShow = this.matchInfo.games[Object.keys(this.matchInfo.games)[this.selectedGame - 1]];
    let displayChange = setInterval(() => {
      if(!this.playersToShow) {
        this.showScorePage = false;
        clearInterval(displayChange);
      } else {
        this.showScorePage = true;
        clearInterval(displayChange);
      }
    }, 10)
  }
}
