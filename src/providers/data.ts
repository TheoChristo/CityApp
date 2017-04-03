import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform} from 'ionic-angular';
import { SQLite,SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Data {
	
	items: any;
	private sqlite: SQLite;
	
	constructor(public platform: Platform, public http: Http) { //
				
        this.items = [
            {title: 'one'},
            {title: 'two'},
            {title: 'three'},
            {title: 'four'},
            {title: 'five'},
            {title: 'six'}
        ]
		
		//Database
		this.sqlite=new SQLite();
		this.platform.ready().then(() => {
			console.log("createTable");
			this.createTable();
		});	
		
	}

	filterItems(searchTerm){
 
        return this.items.filter((item) => {
            return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });     
 
    }
	
	
	createTable(){
		//open database
		this.sqlite.create({
		  name: 'data.db',
		  location: 'default' // the location field is required
		  //iosDatabaseLocation needed for iOs devices
		  
		}).then((db: SQLiteObject) => {
				//create table if not exists 
				db.executeSql('CREATE TABLE IF NOT EXISTS Clients(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(32), gender VARCHAR(32));', {})
				.then(() => {
					console.log("Table created!");
					//Clear table and insert values
					db.executeSql('DELETE FROM Clients;', {})
					.then(() => {
						console.log("Table clear! /n Inserting Data..");
						//insert Client Data
						for(let pop=0; pop<10; pop++) {this.insertClient(db,"John", "male");}						
					}, (error)=>{
						console.log("Unable to clear table: "+error);
					});
				}, (err) => {
					console.log('Unable to execute sql to create  table: ', err);
				});

		}, (err) => {
		  console.error('Unable to open database: ', err);
		});
			
	}

	insertClient(db,name,gender){
		db.executeSql('INSERT  INTO Clients (name, gender) VALUES (?,?,?,?,?,?)' ,[name, gender], {})
		.then(() => {
			console.log("Inserted Client "+name);						
		}, (error)=>{
			console.log("Unable to insert client : "+error);
		});

		
	}
	
	
}





//------------------------------------------------------------------------------------------------------------------
	
/* 	
	insertClient(db,name,gender){
		db.sqlBatch([
			['INSERT  INTO Clients (name, gender) VALUES (?,?,?,?,?,?)' ,[name, gender] ] //,['INSERT  INTO Clients (name, gender) VALUES (?,?,?,?,?,?)' ,[name, gender] ]
		], function() {
			alert('Client Added!');
		}, function(error) {
			console.log('SQL batch ERROR: ' + error.message);
		});
		
	}
*/