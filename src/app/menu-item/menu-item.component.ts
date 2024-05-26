import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { error } from 'console';
interface Card {
  id: number;
  headerText: string;
  bodyText: string;
}

@Component({
  selector: 'menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit{
  description: any;
  card: string = '';
  images: Image[] = [];
  private baseUrl = 'http://localhost:8080';
  @Input()
  fitnessProgram!: FitnessProgram;
  comments: Comment[] = [];
  accordionOpen: boolean = false;
  dropdownOpen: boolean = false;
  currentTab: string = 'Training';
  openedTab: string = 'Training';
  button: string = 'Payment';
  loggedUser: string = '';
  loggedUserId: number | undefined;
  tabs: { name: string }[] = [
    { name: 'Training' },
    { name: 'Comments' },
    { name: 'Participate' }
  ];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private router:Router){
  
  }


  ngOnInit(): void {
     this.fetchComments();
     this.fetchImages();
  }

  deleteFitnessProgram(id){
    const params = new HttpParams()
    .set('userId', Number(sessionStorage.getItem('loggedInUserId')));
     
      
    this.http.delete(`${this.baseUrl}/fitnessprograms/`+id, { params }).subscribe(
      (response)=>{
        console.log("Success");
      },
      (error)=>
        {
          if(error.status === 400) {
            alert('You can only delete programs you made!')
          } else {
            console.error(error);
          }        }
    )
  }

  

  viewDetails(id)
  {
    this.router.navigate(['/details']);
    sessionStorage.setItem('fitnessProgramId', id);
  }

  


  onSubmit() {
      if(this.button === 'Payment')
      {
        alert('Please select payment value!')
      }
      else{
        var paymentTypeId;

        if(this.button==='Cash')
          paymentTypeId=1
        else if(this.button==='Card')
          paymentTypeId=2
        else
          paymentTypeId=3


        const params = new HttpParams()
        .set('paymentTypeId', paymentTypeId)
        .set('card', this.card)
        .set('username', sessionStorage.getItem('loggedInUser')!)
        .set('fitnessProgramId', this.fitnessProgram.id);
    
        this.http.post(`${this.baseUrl}/membership`,null,{ params }).subscribe(
          (response: any) => {
            console.log('Membership created successfully:', response);
          },
          (error: any) => {
            console.error('Error sending membership:', error);
          }
        );

      }


  }


  fetchImages()
  {
    this.http.get<Image[]>(`${this.baseUrl}/image/all/`+this.fitnessProgram.id).subscribe(
      (response: Image[]) => {
        this.images = response;
      },
      (error: any) => {
        console.error('Error fetching images:', error);
      }
    ); 
  }

  getImageUrl(image: string): SafeUrl {  
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
    + image);
  }

  getFirstImage()
  {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
    + this.images[0]?.image);
  }

  fetchComments()
  {
    this.http.get<Comment[]>(`${this.baseUrl}/comment/all/`+this.fitnessProgram.id).subscribe(
      (response: Comment[]) => {
        this.comments = response;
        this.fetchUsersForComments();
      },
      (error: any) => {
        console.error('Error fetching dropdown items:', error);
      }
    ); 
  }

  fetchUsersForComments() {
    for (const comment of this.comments) {
      if(comment.user_id!=null){
      this.http.get<User>(`${this.baseUrl}/users/`+ comment.user_id).subscribe(
        (user: User) => {
          comment.user = user;
        },
        (error: any) => {
          console.error('Error fetching user for comment:', error);
        }
      );
      }
    }
  }

  addComment(commentContent: string, fitnessProgramId:number) {
    const newComment: CommentDto = {
      comment: commentContent,
      fitnessProgramId: fitnessProgramId,
      user: sessionStorage.getItem('loggedInUser') || '{}',
      date: new Date() 
    };

    // const params = new HttpParams()
    // .set('fitnessProgramId', fitnessProgramId)
    // .set('user', sessionStorage.getItem('loggedInUser') || '{}');

    this.http.post<Comment>(`${this.baseUrl}/comment/create`, newComment).subscribe(
      (response: Comment) => {
        console.log('Comment added successfully:', response);
        
        this.fetchComments();
      },
      (error: any) => {
        console.error('Error sending comment:', error);
      }
    );
  }

  switchTab(tabName: string) {
    this.loggedUser = sessionStorage.getItem('loggedInUser') || ''
    this.currentTab = tabName;
    this.openedTab = tabName;
  }

  toggleAccordion() {
    this.accordionOpen = !this.accordionOpen;
  }

  toggleDropdown()
  {
    this.dropdownOpen=!this.dropdownOpen;
  }
  toggleDropdownButton(buttonName: string)
  {
    this.button=buttonName;
    this.dropdownOpen=!this.dropdownOpen;
  }
}

export interface Payment{
  id:number;
  name:string;
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

export interface Comment {
  id: number;
  comment: string;
  date: Date;
  fitness_program_id: number;
  user_id: number;
  user:User;
}

export interface CommentDto {
  comment: string;
  date: Date;
  fitnessProgramId: number;
  user: string;
}

export interface Image{
  image: string;
  alt: string;
}

export interface User {
  id?: number;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  email: string;
  locked?: boolean;
  enabled?: boolean;
  avatar?: Blob;
  user_type_id: number;
  city?: string;
}
