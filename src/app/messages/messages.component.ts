import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {

  private baseUrl = 'http://localhost:8080';
  users: any[] = [];
  response: string=''
  selectedUser: User | undefined;

  constructor(private http: HttpClient, private router:Router) { }

  ngOnInit(): void {
    this.getChatUsers().subscribe(users => {
      this.users = users;
    });  
  
  }

  selectUser(user: User): void {
    this.selectedUser = user;
  }

  sendMessage(user:string, response:string) {
    console.log(user+response)

    const message: Message = {
      sender: sessionStorage.getItem('loggedInUser') || '',
      receiver: user,
      content: response
    };

    this.http.post<Message>(`${this.baseUrl}/message`, message).subscribe(
      (response: Message) => {
        console.log('Message added successfully:', response);
      },
      (error: any) => {
        console.error('Error sending message:', error);
      }
    );
    this.router.navigate(["/main"])

  //   this.router.navigateByUrl('/main', { skipLocationChange: true }).then(() => {
  //     this.router.navigate([MessagesComponent]);
  // });
  }

  getChatUsers(): Observable<User[]> {
    return this.http.get<any[]>(`${this.baseUrl}/message/`+ sessionStorage.getItem('loggedInUser')).pipe(
      map(messages => {
        const usersMap = new Map<string, { sender: string, receiver: string }>();
        messages.forEach(message => {
          usersMap.set(message.sender, { sender: message.sender, receiver: message.receiver });
          usersMap.set(message.receiver, { sender: message.receiver, receiver: message.sender });
        });

        const users: User[] = [];
        usersMap.forEach((user, username) => {
          const userMessages = messages.filter(message => message.sender === username || message.receiver === username);
          const sortedMessages = userMessages.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
          users.push(new User(username, sortedMessages));
        });
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        
        return users.filter(user => user.name !== loggedInUser);;
      })
    );
  }

}

interface Message{
  sender: string
  receiver: string
  content: string
}

export class User {
  name: string;
  messages: { sender: string, receiver: string, content: string, date: string }[];

  constructor(name: string, messages: { sender: string, receiver: string, content: string, date: string }[]) {
    this.name = name;
    this.messages = messages;
  }
}