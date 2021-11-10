import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from './material.module';
import { TableAndFixtureComponent } from './table-and-fixture/table-and-fixture.component';
import { FixtureComponent } from './table-and-fixture/fixture/fixture.component';
import { FreeAgentsComponent } from './free-agents/free-agents.component';
import { AppRoutingModule } from './app-routing.module';
import { TeamPageComponent } from './team-page/team-page.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { DataToSendService } from './service/data-to-send.service';
import { ReactiveFormsModule } from '@angular/forms';
import { PlayerModalComponent } from './player-modal/player-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MatchPageComponent } from './match-page/match-page.component';
import { ScorePageComponent } from './match-page/score-page/score-page.component';
import { RulesComponent } from './rules/rules.component';
import { LoginComponent } from './login/login.component';
import { PlayoffsComponent } from './playoffs/playoffs.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { PlayoffMatchComponent } from './playoffs/playoff-match/playoff-match.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TableAndFixtureComponent,
    FixtureComponent,
    FreeAgentsComponent,
    TeamPageComponent,
    FooterComponent,
    PlayerModalComponent,
    MatchPageComponent,
    ScorePageComponent,
    RulesComponent,
    LoginComponent,
    PlayoffsComponent,
    AuctionsComponent,
    PlayoffMatchComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [DataToSendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
