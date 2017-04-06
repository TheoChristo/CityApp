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
	
	

	private sqlite: SQLite;
	private items: Array<{id: number, name: string}> ;
	public clients: Array<{id: number, name: string, gender: string}> ;
	
	constructor(public platform: Platform, public http: Http) { 

		//Database
		this.sqlite=new SQLite();
		this.platform.ready().then(() => {
			console.log("createTable");
			this.createTable();
		});	
		
	}

	filterItems(searchTerm){
		return this.items.filter((item) => {
            return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
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
						this.magic(db).then(()=>{ this.closeDB(db); });
					}, (error)=>{
						console.log("Unable to clear table: "+error);
					});
				}, (err) => {
					console.log('Unable to to create  table: ', err);
				});
				

		}, (err) => {
		  console.error('Unable to open database: ', err);
		});
			
	}
	
    insertClient(db,name,gender){
        db.executeSql('INSERT  INTO Clients (name, gender) VALUES (?,?)' ,[name, gender], {})
        .then(() => {
            console.log("Inserted Client "+name);                        
        }, (error)=>{
            console.log("Unable to insert client : "+error);
        });
    }
	
	
	magic(db){
		return new Promise((resolve, reject) => {
			this.items=[];
			this.getClientNames(db)
			.then((result) => {
				for (let x in result) {
					this.items.push({
						id:  result[x].id,
						name:  result[x].name
					});	
				}
				resolve();
			},(error) => {
				console.log("ERROR: ", error);
				reject(error);
			});
		});
	}
	
	
	
	
	
	getClientNames(db) {
        return new Promise((resolve, reject) => {
			console.log("getClientNames");
			db.executeSql("SELECT id,name FROM Clients WHERE 1=1", [])
			.then((resultSet) => {
				let searchRs = [];
				if(resultSet.rows.length > 0) {
					for(let x = 0; x < resultSet.rows.length; x++) {
						searchRs.push({
							id:  resultSet.rows.item(x).id,
							name:  resultSet.rows.item(x).name
						});	
					}
				}
				console.log("getClientNames Resolve");
				resolve(searchRs);
			},(error) => {
				console.log("getClientNames ERROR: ", error);
				reject(error);
			});
		
        });
    }
	
		
	closeDB(db) {
        db.close(function() {
            console.log("DB closed!");
        }, function (error) {
            console.log("Error closing DB:" + error.message);
        });
    }
	
	
	
	
	queryListExecuter(query){
		
		return new Promise((resolve, reject) => {
			this.sqlite.create({
			  name: 'data.db',
			  location: 'default' 
			  
			}).then((db: SQLiteObject) => {
				db.executeSql(query, [])
				.then((resultSet) => {
					this.clients = [];
					if(resultSet.rows.length > 0) {
						for(let x = 0; x < resultSet.rows.length; x++) {
							this.clients.push({
								id:  resultSet.rows.item(x).id,
								name:  resultSet.rows.item(x).name,
								gender: resultSet.rows.item(x).gender
							});	
						}
					}
					console.log("queryExecuter Resolved! query:"+query);
					this.closeDB(db);
					resolve();
				}, (error)=>{
					console.log("Unable to exequte "+query+" , error :"+error);
					reject(error);
				});
			},(err) => {
			  console.error('Unable to open database: ', err);
			  reject(err);
			});
		
		});
		
	}
	
	checkUpdate(){
		
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