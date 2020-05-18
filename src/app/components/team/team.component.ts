import { Component, OnInit } from '@angular/core';
import { GetService } from 'src/app/core/get.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  pokemons : Pokemon[] = [];
  isTriggered : boolean = false;
  myControl = new FormControl();
  filteredPokemons : Observable<Pokemon[]>;
  team = [];

  constructor(private getService : GetService) { 
    this.filteredPokemons = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(pokemon => pokemon ? this._filterPokemons(pokemon) : this.pokemons.slice())
    );
  }

  ngOnInit(): void {
    this.getService.getData().subscribe(res => {
      this.pokemons = res.results;
      console.log(this.pokemons);
    })
  }

  triggerFilter(){
    this.isTriggered = !this.isTriggered;
  }

  addToTeam(event) {
    this.getService.getPokemon(event).subscribe(res => {
      this.team.push(res);
      console.log(this.team);
    });
    this.myControl.reset();
  }

  removeFromTeam(index) {
    this.team.splice(index);
    console.log(this.team);
  }

  private _filterPokemons(value: string) : Pokemon[]{
    const filterValue = value.toLowerCase();

    return this.pokemons.filter(pokemon => pokemon.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
