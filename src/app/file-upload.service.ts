import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService { 
    
  // API url 
  private baseUrl = 'http://localhost:8080';
    
  constructor(private http:HttpClient) { } 
  
  // Returns an observable 
  upload(file):Observable<any> { 
  
      const formData = new FormData();  
        
      formData.append("image", file, file.name); 
        
      var id = sessionStorage.getItem('newFitnessProgramId')

      return this.http.post(`${this.baseUrl}`+`/image/`+id, formData) 
  } 
} 