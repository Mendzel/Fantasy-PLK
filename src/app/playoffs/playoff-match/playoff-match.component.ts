import { Component, Input, OnInit } from '@angular/core';
import { PlayoffMatchModel } from 'src/app/models/playoffMatch.model';
import { TeamModel } from 'src/app/models/team.model';

@Component({
  selector: 'app-playoff-match',
  templateUrl: './playoff-match.component.html',
  styleUrls: ['./playoff-match.component.scss']
})
export class PlayoffMatchComponent implements OnInit {
  @Input() matchInfo?: any;
  @Input() sideOfBracket?: string;
  teamA?: TeamModel;
  teamB?: TeamModel;
  stringifyMatchInfo?: any;
  constructor() { }

  ngOnInit(): void {
    this.stringifyMatchInfo = JSON.stringify(this.matchInfo);
  }

}
