import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // by default Spring Data REST sends only 20 items per request which we can change by adding a 'size' parameter
  private baseUrl = environment['eCommerceApiUrl'] + '/products';

  private categoryUrl = environment['eCommerceApiUrl'] + '/product-category';

  constructor(private httpClient: HttpClient) {}

  /* 
  Here we are creating a function which will do a HTTP GET call to above url and receive all the products from the backend 
  and will save it in the 'products' object inside the below interface.
  The method returns an Observable of type array which is of type Product(class that we created).
  We are defining that the incoming data will be of type 'GetResponse' then only we can use that interface's properties and save
  the incoming data into that interface's property for temporary.
  We made use of pipe to add the function map to convert the incoming JSON data into the array 'products' of type Product class 
  */
  getProductList(theCategoryId: number): Observable<Product[]> {
    // Getting product list based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  // Method: Search by keyword
  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  // We made this function because we had repetitive lines of code in above two functions: getProductList and searchProducts
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProduct>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

  // Now we will do same for the Product Category
  // the method is returning an observable of type ProductCategory array
  getProductCategories(): Observable<ProductCategory[]> {
    return (
      this.httpClient
        // we are calling the REST API to get data from backend.
        // The data that we get, will have to be saved somewhere so we created an interface in which we put a property where we can save the data.
        // Now to have access of that interface, we must set the type of the coming data as that interface then only we can save the data in that property
        .get<GetResponseProductCategory>(this.categoryUrl)
        // as the data is coming as an observable we need map function to convert it into JSON to save it in the property
        .pipe(map((response) => response._embedded.productCategory))
    );
  }

  getProduct(theProductId: number): Observable<Product> {
    // first we need is to build the URL which needs to be hit once user clicks on a particular product
    const productUrl = `${this.baseUrl}/${theProductId}`;

    // Now we can get our product from the backend
    // As we are only getting one product, we do not need to unwrap the JSON, the httpClient will automatically convert
    // the data because we already have provided the type of 'response' that is the Product class.
    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(
    thePage: number,
    thePageSize: number,
    theCategoryId: number
  ): Observable<GetResponseProduct> {
    // Getting product list based on category id, page number and total elements will be shown on that page
    const searchUrl =
      `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` +
      `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  searchProductsPaginate(
    thePage: number,
    thePageSize: number,
    theKeyword: string
  ): Observable<GetResponseProduct> {
    // Getting product list based on searched keyword, page number and total elements will be shown on that page
    const searchUrl =
      `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}` +
      `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }
}

// Below both interfaces helps us into unwrapping the coming JSON data into an array of object so that we can access that data into our application
interface GetResponseProduct {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number; // total elements shown on the current page
    totalElements: number; // total number of elements in the database
    totalPages: number; // total pages available
    number: number; // current page number
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
