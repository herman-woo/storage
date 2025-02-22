import { Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { CartlistComponent } from './cartlist/cartlist.component';

export const routes: Routes = [
    { path: 'rater/all', component: CartlistComponent },
    { path: 'rater/:id', component: CartComponent },
];
