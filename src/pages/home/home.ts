import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PhotolistPage } from '../photolist/photolist';

@Component({
  selector: 'page-home', //css selector
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navController: NavController) {
  }

  goPhotoList() {
    this.navController.push(PhotolistPage);
  }

}
