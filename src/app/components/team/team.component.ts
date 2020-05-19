import { Component, OnInit, Input } from '@angular/core';
import { GetService } from 'src/app/core/get.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DataService } from 'src/app/core/data.service';
import { Router } from '@angular/router';

export interface Pokemon {
  name : string;
  url : string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  myControl = new FormControl();
  filteredPokemons : Observable<Pokemon[]>;
  pokemons : Pokemon[] = [];
  team = [];
  team2 = [];
  isTriggered : boolean = false;
  isReady : boolean = false;
  existsOnTeam : boolean = false;
  @Input() buttonId: number;

  constructor(
    private getService : GetService,
    private passData : DataService,
    private router : Router
  ) { 
    this.filteredPokemons = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(pokemon => pokemon ? this._filterPokemons(pokemon) : this.pokemons.slice())
    );
  }

  ngOnInit(): void {
    this.getService.getData().subscribe(res => {
      this.pokemons = res.results;
    })
  }

  triggerFilter(){
    this.isTriggered = !this.isTriggered;
  }

  existsInTeam(team : any[], value){
    team.forEach(i => {
      if (i.name == value.name){
        alert("Pokémon already on team!");
        this.existsOnTeam = true;
      }
    })
  }

  addToTeam(event) {
    this.getService.getPokemon(event).subscribe(res => {
      if (this.buttonId == 1) {
        this.existsInTeam(this.team,res);
        if(!this.existsOnTeam) {
          this.team.push(res);
        }
        if(this.existsInTeam) {
          this.existsOnTeam = false;
        }
      }
      if (this.buttonId == 2) {
        this.existsInTeam(this.team2,res);
        if(!this.existsOnTeam) {
          this.team2.push(res);
        }
        if(this.existsInTeam) {
          this.existsOnTeam = false;
        }
      }
    });
    this.myControl.reset();
  }

  removeFromTeam(index) {
    if (this.buttonId == 1) {
      this.team.splice(index,1);
    }
    if (this.buttonId == 2){
      this.team2.splice(index,1);
    }
  }

  onSendTeams() {
    this.passData.passData(this.team,1);
    this.passData.passData(this.team2,2);
  }

  onSetReady(){
    this.isReady = !this.isReady;
    this.passData.addToCount(this.isReady);
    if (this.passData.readyCount == 2) {
      this.onSendTeams();
      this.router.navigate(['/battle']);
    }
  }

  private _filterPokemons(value: string) : Pokemon[]{
    const filterValue = value.toLowerCase();

    return this.pokemons.filter(pokemon => pokemon.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
