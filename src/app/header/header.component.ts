import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAdmin = false;
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin;
  }

}
