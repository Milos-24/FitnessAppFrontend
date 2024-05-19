import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
  styleUrl: './program-details.component.css'
})
export class ProgramDetailsComponent implements OnInit{
  images: Image[] = [];
  fitnessProgram:FitnessProgram | undefined;
  private baseUrl = 'http://localhost:8080';
  exercises: Exercise[] = [];
  constructor(private router:Router, private sanitizer: DomSanitizer, private http: HttpClient ){

  }


  ngOnInit(): void {
    let id = sessionStorage.getItem('fitnessProgramId') || '';
    this.fetchFitnessProgram(id);
    this.fetchImages(id);
    this.fetchExercises(id);
  }

  fetchExercises(id:string)
  {
    this.http.get<Exercise[]>(`${this.baseUrl}/exercises/`+id).subscribe(
      (response: Exercise[]) => {
        this.exercises = response; 
      },
      (error: any) => {
        console.error('Error fetching dropdown items:', error);
      }
    );
  }

  fetchFitnessProgram(id:string)
  {
    this.http.get<FitnessProgram>(`${this.baseUrl}/fitnessprograms/`+id).subscribe(
      (response: FitnessProgram) => {
        this.fitnessProgram = response; 
      },
      (error: any) => {
        console.error('Error fetching dropdown items:', error);
      }
    );
  }

  getImageUrl(image: string): SafeUrl {  
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
    + image);
  }

  fetchImages(id:string)
  {
    this.http.get<Image[]>(`${this.baseUrl}/image/all/`+id).subscribe(
      (response: Image[]) => {
        this.images = response;
      },
      (error: any) => {
        console.error('Error fetching images:', error);
      }
    ); 
  }


  getFirstImage()
  {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
    + this.images[0]?.image);
  }

  navigateBack(): void {
    this.router.navigate([
      '/main'
    ])
  }
}

export interface Exercise{
  name: string,
  duration: string,
  repetition: string
}

export interface Image{
  image: string;
  alt: string;
}

export interface FitnessProgram {
  id: number;
  name: string;
  price: number;
  duration: string;
  description: string;
  level: number;
  active: boolean;
  creator_id: number;
  location: string;
  category_id: number;
}