import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{




  @Output() switchComponent: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterCategory: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterLocation: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterMyPrograms: EventEmitter<string> = new EventEmitter<string>();
  @Output() search: EventEmitter<{ searchQuery: string, searchOption: any }> = new EventEmitter<{ searchQuery: string, searchOption: any }>();
  offcanvasOpen: boolean = false;
  dropdownItems: any[] = [];
  dropdownItemsCategory: any[] = [];
  categories: any[] = [];
  dropdownOpen: boolean = false;
  dropdownOpenCategory: boolean = false;
  private baseUrl = 'http://localhost:8080';

  options: Option[] = [
    { id: 'name', label: 'Name' },
    { id: 'price', label: 'Price' },
    { id: 'duration', label: 'Duration' },
    { id: 'description', label: 'Description' },
    { id: 'level', label: 'Level' },
    { id: 'location', label: 'Location' },
    { id: 'category', label: 'Category' }
  ];
  selectedItems: string[] = [];
  selectedOption: any;
  searchQuery: string = '';

  constructor(private http:HttpClient){}
  ngOnInit(): void {
    this.http.get<any[]>(`${this.baseUrl}/category/all_names`).subscribe(
      (response) => {
        this.categories = response; 
      },
      (error) => {
        console.error('Error fetching dropdown items:', error);
      }
    );  }

  onSearch() {
    if (this.searchQuery && this.selectedOption) {
      this.search.emit({ searchQuery:this.searchQuery, searchOption:this.selectedOption });
    } else {
      alert('Please fill in both search query and select an option.')
    }
  }


  toggleSelection(item: string) {
    if (this.selectedItems.includes(item)) {
      this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem !== item);
    } else {
      this.selectedItems.push(item);
    }
  }

  switchToComponent(componentName: string) {
    this.switchComponent.emit(componentName);
  }

  onCategoryButtonClick(filter: string) {
    this.filterCategory.emit(filter)
  }

  onMyProgramsButtonClick()
  {
    this.filterMyPrograms.emit("");
  }

  onLocationButtonClick(filter: string) {
    this.filterLocation.emit(filter)
  }

  subscribe() {
    const loggedInUsername = sessionStorage.getItem('loggedInUser');
    const url = `${this.baseUrl}/subscribe/`+loggedInUsername;

    
    this.http.post(url, { categories: this.selectedItems })
      .subscribe(
        (response) => {
          console.log('Subscription successful:', response);
        },
        (error) => {
          console.error('Error occurred while subscribing:', error);
        }
      );
  }
    

  toggleOffcanvas(): void {
    this.offcanvasOpen = !this.offcanvasOpen;
  }

  fetchDropdownItemsLocation(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.http.get<any[]>(`${this.baseUrl}/fitnessprograms/location/all`).subscribe(
      (response) => {
        this.dropdownItems = response; 
      },
      (error) => {
        console.error('Error fetching dropdown items:', error);
      }
    );
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
}

interface Option {
  id: string;
  label: string;
}