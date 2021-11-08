import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DataToSendService } from '../service/data-to-send.service';

@Component({
  selector: 'app-table-and-fixture',
  templateUrl: './table-and-fixture.component.html',
  styleUrls: ['./table-and-fixture.component.scss']
})
export class TableAndFixtureComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: any = new MatTableDataSource(this.dataToSend.teams);
  displayedColumns: string[] = ['logoURL', 'name', 'result', 'scoredPoints', 'pointsDiff',  'points'];
  fetchingTeam?: Subscription;
  constructor(public dataToSend: DataToSendService) { }

  ngOnInit(): void {
    this.dataToSend.getAllTeams();
    this.fetchingTeam = this.dataToSend.teamFetched.subscribe((fetchedData: any) => {
      this.dataSource.data = fetchedData;
    })
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
