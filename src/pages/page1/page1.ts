import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Data } from '../../providers/data';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
	
	searchTerm: string = '';
    items: any;
	searchControl: FormControl;
	searching: any = false;
	 
	constructor(public navCtrl: NavController,public dataService: Data) {
		this.searchControl = new FormControl();
	}
	
    ionViewDidLoad() {
 
        this.setFilteredItems();
		
		//Wait for more input-Avoid spam call
        this.searchControl.valueChanges.debounceTime(900)
		.subscribe(search => {
			this.searching = false;
            this.setFilteredItems();
        });
 
 
    }
 
    setFilteredItems() {
 
        this.items = this.dataService.filterItems(this.searchTerm);
 
    }
	
	onSearchInput(){
        this.searching = true;
    }
	
	male(){
		alert("male");
	}
	
	female(){
		alert("female");
	}
	
	
	
}
