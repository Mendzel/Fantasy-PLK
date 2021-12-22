import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  assignFlag(playerNationality: string) {
    switch (playerNationality) {
      case 'Polska':
        return 'flag-icon-pl';
      case 'Stany Zjednoczone':
        return 'flag-icon-us';
      case 'Czechy':
        return 'flag-icon-cz';
      case 'Szwecja':
        return 'flag-icon-se';
      case 'Wielka Brytania':
        return 'flag-icon-gb';
      case 'Serbia':
        return 'flag-icon-rs';
      case 'Grecja':
        return 'flag-icon-gr';
      case 'Litwa':
        return 'flag-icon-lt';
      case 'Łotwa':
        return 'flag-icon-lv';
      case 'Chorwacja':
        return 'flag-icon-hr';
      case 'Kanada':
        return 'flag-icon-ca';
      case 'Dania':
        return 'flag-icon-dk';
      case 'Turcja':
        return 'flag-icon-tr';
      case 'Holandia':
        return 'flag-icon-nl';
      case 'Finlandia':
        return 'flag-icon-fi';
      case 'Brazylia':
        return 'flag-icon-br';
      case 'Meksyk':
        return 'flag-icon-mx';
      case 'Słowenia':
        return 'flag-icon-si';
    }
    return '';
  }
  constructor() {}
}
