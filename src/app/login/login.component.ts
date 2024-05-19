import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, NavigationExtras } from '@angular/router'
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { RssFeedService } from '../rssfeed.service';


@Component({
  
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit{
dropdown: boolean = true;
firstname: any;
lastname: any;
email: any;
usernameReg: any;
passwordReg: any;
city: any;
feedItems: any[] = [];
private baseUrl = 'http://localhost:8080';

  constructor(private authService: AuthService, private router: Router, private rssFeed: RssFeedService, private http:HttpClient) {}

  username: string = '';
  password: string = '';
  
  ngOnInit(): void {
    this.rssFeed.getFeedContent().subscribe(
      (dataPromise: any) => {
        dataPromise.then((data: any) => {
          if (data && data.rss && data.rss.channel && data.rss.channel.item) {
            this.feedItems = data.rss.channel.item;
          } else {
            console.error('Invalid RSS data format:', data);
          }
        }).catch((error: any) => {
          console.error('Error fetching RSS feed:', error);
        });
      }
    );
  }

  handleClickWithoutAccount()
  {
    sessionStorage.setItem('loggedInUser', 'none')
    this.router.navigate(['/main']);
  }
  
  dropdownToggle()
  {
    this.dropdown=!this.dropdown
  }

  navigateToRegister() {
    this.router.navigate(['/registration']);
    }

  onSubmit() {
    
    this.authService.login(this.username, this.password).subscribe(
      
      (response) => {
        console.log('Response from the server:', response);
        this.router.navigate(['/main']);
        sessionStorage.setItem('loggedInUser', this.username)
        this.http.get<User>(`${this.baseUrl}/users/username/`+ this.username).subscribe(
          (user: User) => {
            sessionStorage.setItem('loggedInUserId', `${user.id}`);
            
          },
          (error: any) => {
            console.error('Error fetching user for comment:', error);
          }
        );  


      },
      (error) => {
        console.log('Response from the server:', error);
        alert(error.error);
      }
    );
  }
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