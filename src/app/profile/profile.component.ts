import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {  Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { error } from 'console';
import { response } from 'express';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  firstName: string='';
  lastName: string='';
  username: string='';
  password: string='';
  email: string='';
  city: string='';
confirmPassword: any;
private baseUrl = 'http://localhost:8080';
  memberships: any[]=[];
  journal: any[]=[];
  public chart: any;
  public entryDates:any;
  public weights:any;
  weight!: number;
exerciseEntry: string='';
progressEntry: string='';
constructor(private http: HttpClient, private router: Router){


}
createChart(){
  this.chart = new Chart("MyChart", {
    type: 'line', 
    data: {
      labels: this.entryDates, 
       datasets: [
        {
          label: "Weight",
          data: this.weights,
          backgroundColor: 'blue'
        }
      ]
    },
    options: {
      aspectRatio:2.5
    }
    
  });
}

ngOnInit(): void {


  this.http.get<User>(`${this.baseUrl}/users/username/`+ sessionStorage.getItem('loggedInUser')).subscribe(
    (user: User) => {
      this.firstName = user.firstname;
      this.lastName = user.lastname;
      this.username = user.username;
      this.email = user.email
      this.city = user.city
    },
    (error: any) => {
      console.error('Error fetching user for comment:', error);
    }
  );  

  const id = sessionStorage.getItem('loggedInUserId') || null;
  this.getData(id);

}
getData(id:any) {

    this.getMembership(id),
    this.getJournal(id)
  
}

getMembership(id:number)
{
  this.http.get<Membership[]>(`${this.baseUrl}/membership/`+id).subscribe(
    (response: Membership[]) => {
      this.memberships = response; 
    },
    (error: any) => {
      console.error('Error fetching items:', error);
    }
  );
}



onSaveJournal(): void {
  this.getJournalPdf().subscribe(response => {
    const contentDispositionHeader = response.headers.get('Content-Disposition');
    const filename = this.getFilenameFromContentDisposition(contentDispositionHeader!);
    saveAs(response.body, filename);
  });
}

getJournalPdf(): Observable<HttpResponse<Blob>> {
  const id = sessionStorage.getItem('loggedInUserId');

  return this.http.get(`${this.baseUrl}/journal/${id}`, {
    responseType: 'blob',
    observe: 'response'
  });
}

getFilenameFromContentDisposition(contentDispositionHeader: string): string {
  let filename = 'download.pdf';
  if (contentDispositionHeader) {
    const result = contentDispositionHeader.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (result && result[1]) {
      filename = result[1].replace(/['"]/g, '');
    }
  }
  return filename;
}


getJournal(id:number)
{
  this.http.get<Journal[]>(`${this.baseUrl}/journal/`+id).subscribe(
    (response: Journal[]) => {
      this.journal = response; 
      this.entryDates = this.journal.map(entry => {
        const date = new Date(entry.entryDate);
        return date.toLocaleDateString('en-US'); // You can specify your preferred locale here
      });
      this.weights = this.journal.map(entry => entry.weight);

      this.createChart();
    },
    (error: any) => {
      console.error('Error fetching items:', error);
    }
  );
}

addJournalEntry()
{
  if (!this.weight || !this.exerciseEntry || !this.progressEntry) {
    alert("Please fill in all the fields.");
    return;
  }

  const journal: Journal ={
    weight: this.weight,
    exerciseEntry: this.exerciseEntry,
    progressEntry: this.progressEntry,
    entryDate: new Date()
  }

  const params = new HttpParams()
    .set('userId', sessionStorage.getItem('loggedInUserId') || '{}')
    

  this.http.post<Journal>(`${this.baseUrl}/journal`, journal, {params}).subscribe(
    (response: Journal)=>{
      console.log(response);
    },
    (error: any)=>{
      console.error('Error while adding new jounal entry!', error);
    }
  )
}

onSubmit() {
  const userData = {
    firstname: this.firstName,
    lastname: this.lastName,
    username: this.username,
    password: this.password,
    email: this.email,
    city: this.city
  };

  if(this.password != this.confirmPassword)
  {
    alert('Confirm password doesnt match');
  }
  else{
  this.http.put<any>('http://localhost:8080/users/update', userData)
    .subscribe(
      response => {
        alert('Edit successful');
      },
      error => {
        alert(error.error)
      }
    );
  }
}
}

export interface Membership{
  username: string;
  startDate: Date;
  card: string; 
  paymentType: string
  endDate: Date
  fitnessProgra: string
}

export interface Journal{
  weight: number;
  exerciseEntry: string;
  progressEntry: string; 
  entryDate: Date;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  email: string;
  locked?: boolean;
  enabled?: boolean;
  avatar?: Blob;
  user_type_id: number;
  city: string;
}


