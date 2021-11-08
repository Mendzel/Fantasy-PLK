import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BASKETBALL_POSITIONS, CLUBS, FANTASY_CLUBS } from '../constants';
import { PlayerModel } from '../models/player.model';
import { AppService } from '../service/app.service';
import { AuthService } from '../service/auth.service';
import { DataToSendService } from '../service/data-to-send.service';

@Component({
  selector: 'app-player-modal',
  templateUrl: './player-modal.component.html',
  styleUrls: ['./player-modal.component.scss'],
})
export class PlayerModalComponent implements OnInit {
  isAdmin: boolean = false;
  flagToUse!: string;
  editMode = false;
  clubs = CLUBS;
  fantasyClubs = ['FreeAgent', ...FANTASY_CLUBS];
  positions = BASKETBALL_POSITIONS;
  playerEdition?: Subscription;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PlayerModel,
    private appService: AppService,
    private dataToSend: DataToSendService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.flagToUse = this.appService.assignFlag(this.data.nationality);
    this.isAdmin = this.auth.isAdmin;
    this.playerEdition = this.dataToSend.playerEdited.subscribe((responseData: any) => {
      this.data = responseData;
    })
  }

  editPlayer = new FormGroup({
    position: new FormControl(this.data.position),
    nationality: new FormControl(this.data.nationality),
    age: new FormControl(this.data.age),
    pointsScored: new FormControl(this.data.pointsScored),
    injury: new FormControl(this.data.injury),
    realTeam: new FormControl(this.data.realTeam),
    fantasyTeam: new FormControl(this.data.fantasyTeam),
  });
  onSubmit() {
    this.dataToSend.editPlayer({
      ...this.editPlayer.value,
      name: this.data.name,
      photoURL: this.data.photoURL,
      key: this.data.key,
    });
    this.editMode = false;
  }

  onDelete(){
    this.dataToSend.deletePlayer(this.data.key);
  }
}
