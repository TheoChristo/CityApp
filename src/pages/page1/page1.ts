import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Data } from '../../providers/data';
import { FormControl } from '@angular/forms';
import { Page2 } from '../../pages/page2/page2';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
	
	searchTerm: string = '';
	searchControl: FormControl;
    items:  Array<Object>;
	searching: any = false;
	suggestOrNot: any = true;
	
	constructor(public navCtrl: NavController,public dataService: Data) {
		this.searchControl = new FormControl();
	}
	
    ionViewDidLoad() {
		//Wait for more input-Avoid spam call
        this.searchControl.valueChanges.debounceTime(900)
		.subscribe(search => {
			this.searching = false;
            this.setFilteredItems();
        });
    }
 
    setFilteredItems() {
		if (this.searchTerm == '' || this.suggestOrNot == false){
			this.items = null;
			this.searching = false;
		}else{
			this.items = this.dataService.filterItems(this.searchTerm);
		}
		
    }
	
		//on click from suggestions
	itemSelected(item){
		console.log("Item clicked! \n item id: "+item.id);
		this.suggestOrNot = false;
	}
	
	
	
	onSearchInput(){
        this.searching = true;
		this.suggestOrNot = true;
    }
	
	male(){
		let query="SELECT id,name FROM Clients WHERE 1=1"
		this.dataService.queryListExecuter(query).then(()=>{
			this.navCtrl.push(Page2); 
		});
	}
	
	female(){
		let query="SELECT id,name FROM Clients WHERE gender = 'female'"
		this.dataService.queryListExecuter(query).then(()=>{
			this.navCtrl.push(Page2);
		});
	}
	
	
	
}
