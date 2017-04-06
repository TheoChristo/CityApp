import { Component } from '@angular/core';

import { Data } from '../../providers/data';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {
  selectedItem: any;
  icons: string[];
  //items: Array<{title: string, note: string, icon: string}>;
	items:  Array<Object>;
	
  constructor(public navCtrl: NavController, public navParams: NavParams,public dataService: Data) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
	this.items = this.dataService.clients;
    
     
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(Page2, {
      item: item
    });
  }
}
