import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  toUser : {toUserId: string, toUserName: string};
  constructor() {
    this.toUser = {
      toUserId:'210000198410281948',
      toUserName:'Hancock'
    }
  }

}
