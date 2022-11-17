import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAdmin: boolean = false;
  constructor(private router: Router) { }
  login(data: any){
    if(data.login === 'admin@gmail.com' && data.password === 'BabyShark123'){
      this.isAdmin = true;
      this.router.navigate(['']);
      return true;
    }
    return false;
  }
}
