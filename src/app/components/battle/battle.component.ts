import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/data.service';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit {
  team = [];
  team2 = [];
  isLoading : boolean = false;

  constructor(private getData : DataService) { }

  ngOnInit(): void {
    this.fullfillTeams();
  }

  fullfillTeams(){
    this.isLoading = true;
    this.getData.team.subscribe(res => {
      console.log(res);
      this.isLoading = false;
    });
  }

}
