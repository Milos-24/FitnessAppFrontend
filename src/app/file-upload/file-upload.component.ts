import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent implements OnInit {

  shortLink: string = ""; 
  loading: boolean = false;
  file!: File ; 
  exercises: Exercise[] = [];
  constructor(private fileUploadService: FileUploadService, private router:Router, private http:HttpClient) { } 
  private baseUrl = 'http://localhost:8080';



  ngOnInit(): void {
    this.fetchExercises();
  }

  fetchExercises()
  {
    this.http.get<Exercise[]>(`${this.baseUrl}/exercises`).subscribe(
      (response: Exercise[]) => {
        this.exercises = response; 
      },
      (error: any) => {
        console.error('Error fetching items:', error);
      }
    );
  }


  onChange(event) { 
      this.file = event.target.files[0]; 
  } 

  onUpload() { 
      this.loading = !this.loading; 

      this.fileUploadService.upload(this.file).subscribe( 
          (event: any) => { 
              if (typeof (event) === 'object') { 
                  this.shortLink = event.link; 
                  this.loading = false;
              } 
          } 
      ); 
  } 

  onUploadExercise(id:number, duration:string, repetition:string, link:string)
  {

    const params = new HttpParams()
    .set('duration', duration)
    .set('repetition', repetition)
    .set('link', link)
    .set('fitnessProgramId', sessionStorage.getItem('newFitnessProgramId')!);

    this.http.post(`${this.baseUrl}/programexercise/`+id, null, { params }).subscribe(
      (response: any) => {
        console.log( response); 
      },
      (error: any) => {
        console.error('Error sending items:', error);
      }
    );
  }

  navigateBack(): void {
    this.router.navigate([
      '/main'
    ])
  }
} 

export interface Exercise{
  name: string,
  link: string,
  duration: string,
  repetition: string,
  id: number
}