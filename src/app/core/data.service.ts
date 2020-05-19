import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public team = new EventEmitter<any>();
  public team2 = new EventEmitter<any>();
  public isReady = new Subject<boolean>();
  readyCount : number = 0;

  constructor() { }

  passData(team,id : number) {
    if (id == 1) {
      return this.team.emit(team);
    }
    if (id == 2) {
      return this.team2.emit(team);
    }
  }

  // getTeams(id : number) : Observable<any>{
  //   if (id == 1) {
  //     return this.team.asObservable();
  //   }
  //   if (id == 2) {
  //     return this.team2.asObservable();
  //   }
  // }

  addToCount(isReady : boolean){
    this.isReady.next(isReady);
    if (this.isReady) {
      this.readyCount++;
    }
    if (!this.isReady) {
      this.readyCount--;
    }
  }
}
