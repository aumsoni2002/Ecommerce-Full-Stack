import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EcommerceFormService {
  private countriesUrl = environment['eCommerceApiUrl'] + '/countries';
  private statesUrl = environment['eCommerceApiUrl'] + '/states';

  constructor(private httpClient: HttpClient) {}

  // Below method gets countries from the backend
  getCountries(): Observable<Country[]> {
    return this.httpClient
      .get<GetResponseCountries>(this.countriesUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  // Below method gets state based on the user selected country
  getStates(theCountryCode: string): Observable<State[]> {
    // search url
    const searchStateUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient
      .get<GetResponseStates>(searchStateUrl)
      .pipe(map((response) => response._embedded.states));
  }

  /*
  Now we will create two methods which returns an observable array of type number.
  We made use of Observables because the other components will subscribe to the event for receiving data every time it gets change. 
  The data that is going to be sent are months and years for showing drop-down for credit card expiry month and year.
  */

  // Below function takes the current month, loop through 12 months, save those months in the array 'data' and returns it as observable
  getCreditCardMonths(startMonth: number): Observable<number[]> {
    // an array of numbers to save all months
    let data: number[] = [];

    // looping through all months from the current month(startMonth) upto till 12 months
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    /* 
    Now we will return all the months.
    // We made use of 'of' operator from rxjs to wrap an object as observable.
    // So the variable 'data' is not an observable, it is a simple array object and we are returning an observable because we want
    // other components to stay updated with the latest data and that can only be done with subscribing to an event which sends data
    // every time it gets change. That is why we must wrap that object as an observable.
    */
    return of(data);
  }

  // Below method returns an array of numbers which are years from current year to 10 years.
  getCreditCardYears(): Observable<number[]> {
    // an array of numbers to save all years
    let data: number[] = [];

    // First we will get the current year as startYear and we will add 10 to it to get endYear.
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    // looping through all years from the current year(startYear) upto till endYear that is till 10 years.
    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    /* 
    Now we will return all the months.
    // We made use of 'of' operator from rxjs to wrap an object as observable.
    // So the variable 'data' is not an observable, it is a simple array object and we are returning an observable because we want
    // other components to stay updated with the latest data and that can only be done with subscribing to an event which sends data
    // every time it gets change. That is why we must wrap that object as an observable.
    */
    return of(data);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  };
}
