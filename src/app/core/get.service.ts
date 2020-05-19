import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetService {

  constructor(private http : HttpClient) { }

  getData() : Observable<any>{
    return this.http.get('https://pokeapi.co/api/v2/pokemon/?limit=964');
  }

  getPokemon(pokemon : string) : Observable<any>{
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  }
}
