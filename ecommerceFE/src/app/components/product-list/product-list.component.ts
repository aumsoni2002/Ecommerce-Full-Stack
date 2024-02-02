import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = []; // we are going to get all products from backend through the service that we created into this array.
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = '';
  searchMode: boolean = false;

  // Properties for Pagination with default value
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = '';

  // To make use of services that we create, we first must inject them like below into our component
  constructor(
    private ProductService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // As we are making use of such data that is coming from the URL as a parameter, we need to subscribe it through paramMap
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  /*
  Below method is calling the 'getProductList' method from the ProductService and then subscribe for its data.
  Whenever we subscribe any method like below, the whole method runs asynchronously.
  */
  listProducts() {
    // first we will check if the user entered any keyword then only we will run the search by keyword function
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode == true) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    // Getting the keyword from the url that was hit
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // If we have a different keyword than previous keyword then we want to set thePageNumber to 1.
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    // Searching for the products using the keyword
    this.ProductService.searchProductsPaginate(
      this.thePageNumber - 1, // the reason for subtracting by 1 is that in Spring Data REST page number starts with 0. and in angular page number starts with 1
      this.thePageSize,
      theKeyword
    ).subscribe((data) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1; // the reason for adding by 1 is that angular pagination starts with one and we subtracted first when the data came
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    });
  }

  handleListProducts() {
    // first we will check if the 'id' parameter is available or not. Or do we need to use default value.
    // If there is a parameter value, it will return true. If not it will return false.
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId == true) {
      // we will get the value of that param 'id' and by default it will be a string so we need to convert it to number by using '+'
      // !: This is the non-null assertion operator. Tells compiler that the object is not null.
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    // We need to check if we have a different category than previous
    // Angular will reuse a component if it is currently being viewed by the browser.
    // If we have a different category id than previous then set thePageNumber back to 1.

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    // now we will get the products for the given category id.
    this.ProductService.getProductListPaginate(
      this.thePageNumber - 1, // the reason for subtracting by 1 is that in Spring Data REST page number starts with 0. and in angular page number starts with 1
      this.thePageSize,
      this.currentCategoryId
    ).subscribe((data) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1; // the reason for adding by 1 is that angular pagination starts with one and we subtracted first when the data came
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    });
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize; // converting string to number by using + operator
    this.thePageNumber = 1;
    this.listProducts();
  }

  // Sending the product that user wants to add to cart
  addToCart(theProduct: Product) {
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
