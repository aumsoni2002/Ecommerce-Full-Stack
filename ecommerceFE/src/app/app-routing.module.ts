import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';

const routes: Routes = [
  // Below are the list of routes that we will use to create new instance of component once hit
  { path: 'cart-details', component: CartDetailsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'search/:keyword', component: ProductListComponent },
  { path: 'category/:id/:name', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },

  // if there is no path, the browser will redirect to 'products' route
  // pathMatch: 'full': it means that the router should only consider the URL for a match if it matches the entire path of the route.
  { path: '', redirectTo: '/products', pathMatch: 'full' },

  // This is the generic wildcard. It will match on anything that didn't match above routes.
  { path: '**', redirectTo: '/products', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

/*
- Angular Routing
  In Angular, you can add links in your application
  The links will route to other components in your application
  Angular routing will handle updating a view of your application
  Only updates a section of your page. It doesn't reload entire page

  Feature             Description
  Router              Main routing service. Enables navigation between views based on user actions.
  Route               Maps a URL path to a component.
  RouterOutlet        Acts as a placeholder. Renders the desired component based on route.
  RouterLink          Link to specific routes in your application.
  ActivatedRoute      The current active route that loaded the component. Useful for accessing route parameters.

*/
