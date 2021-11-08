import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BASKETBALL_POSITIONS, CLUBS, FANTASY_CLUBS } from '../constants';
import { PlayerModel } from '../models/player.model';
import { PlayerModalComponent } from '../player-modal/player-modal.component';
import { AuthService } from '../service/auth.service';
import { DataToSendService } from '../service/data-to-send.service';

@Component({
  selector: 'app-free-agents',
  templateUrl: './free-agents.component.html',
  styleUrls: ['./free-agents.component.scss'],
})
export class FreeAgentsComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  isAdmin = false;
  displayedColumns: string[] = [
    'position',
    'photoURL',
    'name',
    'realTeam',
    'pointsScored',
  ];
  dataSource: any = new MatTableDataSource(this.dataToSend.players);

  clubsToFilter = ['Dowolny', ...CLUBS];
  showOnlyClubFilter = false;
  showOnlyPositionFilter = false;
  positionsToFilter = ['Dowolna', ...BASKETBALL_POSITIONS];

  clubs = CLUBS;
  fantasyClubs = ['FreeAgent', ...FANTASY_CLUBS];
  positions = BASKETBALL_POSITIONS;
  showForm = false;

  fetchingPlayer?: Subscription;
  constructor(
    private dataToSend: DataToSendService,
    public dialog: MatDialog,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin;
    this.dataToSend.getAllPlayers();
    this.dataSource.filterPredicate = function (
      data: any,
      filter: string
    ): boolean {
      return (
        data.position.toLowerCase() === filter ||
        data.realTeam.toLowerCase() === filter
      );
    };
    this.fetchingPlayer = this.dataToSend.playerFetched.subscribe(
      (fetchedData: any) => {
        this.dataSource.data = fetchedData.filter((player: PlayerModel) => {
          return player.fantasyTeam === "FreeAgent"
        });
      }
    );

  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyClubFilter(event: Event) {
    this.showOnlyClubFilter = true;
    this.filterTable('Dowolny', event);
  }
  applyPositionFilter(event: Event) {
    this.showOnlyPositionFilter = true;
    this.filterTable('Dowolna', event);
  }

  filterTable(defaultName: string, event: Event) {
    const filterValue = (event.target as HTMLInputElement).innerText;
    if (filterValue === defaultName) {
      this.dataSource.filter = '';
      this.showOnlyClubFilter = false;
      this.showOnlyPositionFilter = false;
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  newPlayer = new FormGroup({
    name: new FormControl(''),
    photoURL: new FormControl(''),
    position: new FormControl(''),
    nationality: new FormControl(''),
    age: new FormControl(''),
    pointsScored: new FormControl(''),
    realTeam: new FormControl(''),
    fantasyTeam: new FormControl(''),
  });

  onSubmit() {
    this.dataToSend.sendNewPlayer(this.newPlayer.value);
    this.newPlayer.patchValue({
      name: '',
      photoURL: '',
      position: '',
      nationality: '',
      age: '',
      pointsScored: '',
      realTeam: '',
      fantasyTeam: '',
    });
  }

  openDialog(playerInfo: PlayerModel) {
    let dialogRef = this.dialog.open(PlayerModalComponent, {
      height: '550px',
      width: '600px',
      data: playerInfo,
    });
  }
}
