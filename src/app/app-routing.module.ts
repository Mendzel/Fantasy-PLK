import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionsComponent } from './auctions/auctions.component';
import { FreeAgentsComponent } from './free-agents/free-agents.component';
import { LoginComponent } from './login/login.component';
import { MatchPageComponent } from './match-page/match-page.component';
import { PlayoffMatchPageComponent } from './playoffs/playoff-match/playoff-match-page/playoff-match-page.component';
import { PlayoffsComponent } from './playoffs/playoffs.component';
import { RulesComponent } from './rules/rules.component';
import { TableAndFixtureComponent } from './table-and-fixture/table-and-fixture.component';
import { TeamPageComponent } from './team-page/team-page.component';

const appRoutes: Routes = [
  { path: 'table-and-fixture', component: TableAndFixtureComponent },
  { path: 'free-agents', component: FreeAgentsComponent },
  { path: 'auctions', component: AuctionsComponent },
  { path: 'playoffs', component: PlayoffsComponent },
  { path: 'team-page/:teamName', component: TeamPageComponent },
  { path: 'match-page/:round/:matchID', component: MatchPageComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'playoff-match-page', component: PlayoffMatchPageComponent },
  { path: '', redirectTo: 'playoffs', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
