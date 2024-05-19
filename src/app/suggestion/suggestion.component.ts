import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrl: './suggestion.component.css'
})
export class SuggestionComponent {

  API_KEY = '192xCeqgWoVBvh8fG0Lr6Q==J0vjqp2DUPYZS1ra'

  exercises: any[]=[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const header = new HttpHeaders({'x-api-key': this.API_KEY});

    this.http.get<any[]>('https://api.api-ninjas.com/v1/exercises', {headers: header}).subscribe(data => {
      this.exercises = data;
    });
  }
}
