import { Component, OnInit } from '@angular/core';
import { BASKETBALL_POSITIONS } from '../constants';
import { PlayerModel } from '../models/player.model';
import { TeamModel } from '../models/team.model';
import { DataToSendService } from '../service/data-to-send.service';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../service/app.service';
import { PlayerModalComponent } from '../player-modal/player-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styleUrls: ['./team-page.component.scss'],
})
export class TeamPageComponent implements OnInit {
  team: TeamModel = this.dataToSend.teams[0];
  dataSource: PlayerModel[] = [];
  bestPlayerOnEachPosition: PlayerModel[] = [];
  displayedColumns: string[] = ['position', 'name', 'pointsScored'];
  constructor(
    private dataToSend: DataToSendService,
    private _Activatedroute: ActivatedRoute,
    public appService: AppService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe(params => {
      let teamToDiplsay = this.dataToSend.teams.filter((team: TeamModel) => {
        return team.name.replace(/ /g, '').toLowerCase() === params.get('teamName');
      })
      this.team = teamToDiplsay[0];
    })
    this.dataToSend.getTeamPlayers(this.team.name);
    this.dataSource = this.team.playerList;
    for (let position of BASKETBALL_POSITIONS) {
      this.getBestOnPosition(position);
    }
  }

  getBestOnPosition(position: string) {
    let playersOnPosition = this.dataSource.filter((player) => {
      return player.position === position;
    });
    this.bestPlayerOnEachPosition.push(
      this.calculateBestOnPosition(playersOnPosition)
    );
  }

  calculateBestOnPosition(players: PlayerModel[]) {
    let currentBest: PlayerModel = players[0];
    for (let player of players) {
      if (player.pointsScored > currentBest.pointsScored) {
        currentBest = player;
      }
    }
    return currentBest;
  }

  openDialog(playerInfo: PlayerModel) {
    let dialogRef = this.dialog.open(PlayerModalComponent, {
      height: '550px',
      width: '600px',
      data: playerInfo,
    });
  }
}
