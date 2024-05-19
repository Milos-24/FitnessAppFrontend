import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{
  formData: any = {
    firstName: '',
    price: '',
    duration: '',
    description: '',
    level: null,
    location: '',
    selectedCategory: ''
  };
  dropdownOpenCategory: boolean = false;
  selectedCategory:string="Category";
  public menuItems: FitnessProgram[] = [];
  private baseUrl = 'http://localhost:8080';
  currentComponent: string = 'Home';
  loggedUser: string = '';
  dropdownItemsCategory: any[] = [];

  itemsPerPage: number = 6;
  currentPage: number = 1;


  get totalPages(): number {
    return Math.ceil(this.menuItems.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  getCurrentPageItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.menuItems.slice(startIndex, endIndex);
  }

  goToPage(page: number, event: MouseEvent): void {
    event.preventDefault();
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  constructor(private http:HttpClient, private fb:FormBuilder,private router: Router){}

  ngOnInit(): void {
    this.http.get<FitnessProgram[]>(`${this.baseUrl}/fitnessprograms/all`).subscribe(
      (response: FitnessProgram[]) => {
        this.menuItems = response; 
      },
      (error: any) => {
        console.error('Error fetching dropdown items:', error);
      }
    );
  }
  

  search(event: { searchQuery: string; searchOption: any; }) {
    const params = new HttpParams()
    .set('property', event.searchOption)
    .set('value', event.searchQuery);

    this.http.get<FitnessProgram[]>(`${this.baseUrl}/fitnessprograms/search`, { params }).subscribe(
      (response: FitnessProgram[]) => {
        this.menuItems = response; 
      },
      (error: any) => {
        console.error('Error fetching dropdown items:', error);
      }
    );
  }

  next() :void {
    this.formData.selectedCategory=this.selectedCategory;
    console.log(this.formData);
    
    if (!this.isFormDataValid()) {
      alert('Form data is not filled. Please fill all required fields.');
      return;
    }

    this.http.post<any>(`${this.baseUrl}/fitnessprograms/`+sessionStorage.getItem(
      'loggedInUser'
    ), this.formData)
      .subscribe(
        response => {
          console.log('Data sent successfully:', response);
          sessionStorage.setItem('newFitnessProgramId', response.id)
        },
        error => {
          console.error('Error sending data to backend:', error);
        }
      );

      this.router.navigate(['/new-program']);

  }
  
  isFormDataValid(): boolean {
    return (
      this.formData.name &&
      this.formData.price &&
      this.formData.duration &&
      this.formData.description &&
      this.formData.level !== null
    );
  }

  switchComponent(componentName: string) {
    this.currentComponent = componentName;
    this.loggedUser = sessionStorage.getItem('loggedInUser') || ''

  }

  fetchDropdownItemsCategory(): void {
    this.dropdownOpenCategory = !this.dropdownOpenCategory;
    this.http.get<any[]>(`${this.baseUrl}/category/all_names`).subscribe(
      (response) => {
        this.dropdownItemsCategory = response; 
      },
      (error) => {
        console.error('Error fetching dropdown items:', error);
      }
    );
  }

  selectCategory(category:string)
  {
    this.selectedCategory=category;
  }


  filterCategory(filter: string) {
    this.http.get<FitnessProgram[]>(`${this.baseUrl}/fitnessprograms/category/`+filter).subscribe(
      (response: FitnessProgram[]) => {
        this.menuItems = response; 
      },
      (error: any) => {
        console.error('Error fetching dropdown items:', error);
      }
    );
  }

  filterLocation(filter: string) {
    this.http.get<FitnessProgram[]>(`${this.baseUrl}/fitnessprograms/location/`+filter).subscribe(
      (response: FitnessProgram[]) => {
        this.menuItems = response; 
      },
      (error: any) => {
        console.error('Error fetching dropdown items:', error);
      }
    );
  }

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