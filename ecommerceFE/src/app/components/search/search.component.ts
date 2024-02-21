import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  // Below method will take the searched word that is entered by user and
  // it will direct the url to below shown url with the searched word
  // Once the below url is hit, the product-list-component will be initialized and that component will take that word and show us the list
  doSearch(value: String) {
    if (value) {
      this.router.navigateByUrl(`/search/${value}`);
    }
  }
}
