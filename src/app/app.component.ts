import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataToSendService } from './service/data-to-send.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Fantasy-PLK';
  constructor(private dataToSend: DataToSendService, private router: Router) {}
  ngOnInit(): void {
    this.router.navigate([''])
    this.dataToSend.players = this.dataToSend.getAllPlayers();
    this.dataToSend.teams = this.dataToSend.getAllTeams();
    this.dataToSend.fixture = this.dataToSend.getAllRounds();
  }
}
