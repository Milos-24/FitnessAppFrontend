import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent{
  firstName: string='';
  lastName: string='';
  username: string='';
  password: string='';
  email: string='';
  locked: boolean=false;
  enabled: boolean=false;
  city: string='';
confirmPassword: any;

  constructor(private http:HttpClient, private router:Router){}


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
  this.http.post<any>('http://localhost:8080/login/register', userData)
    .subscribe(
      response => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      error => {
        alert(error.error)
      }
    );
  }
}

}
