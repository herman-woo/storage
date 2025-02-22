import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Cart, CartItem, TaxItem } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/rater';

  constructor(private http: HttpClient) { }

  createCart(): Observable<Cart> {
    const apiUrl = 'http://127.0.0.1:8080/rater';
    console.log(`Sending POST request to: ${apiUrl}`);

    return this.http.post<Cart>(apiUrl, {}).pipe(
      catchError(error => {
        console.error('Error creating cart:', error);
        return throwError(() => new Error('Failed to create cart'));
      })
    );
  }
  getCart(raterId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${raterId}`).pipe(
      catchError(error => {
        console.error('Error fetching cart:', error);
        return throwError(() => new Error('Failed to load cart data'));
      })
    );
  }

  addCartItem(rater_id: number,
    product_description: string,
    premium: number,
    quantity: number,
    naics_premium: number,
    note: string,
    naics_code: number,
    modifier: number): Observable<CartItem> {
    const apiUrl = `http://127.0.0.1:8080/rater/${rater_id}/exposure`;
    const body = { rater_id, product_description, premium, quantity, naics_premium, note, naics_code, modifier };

    return this.http.post<CartItem>(apiUrl, body).pipe(
      catchError(error => {
        console.error('Error adding item:', error);
        return throwError(() => new Error('Failed to add item to cart'));
      })
    );
  }

  deleteCartItem(rater_id:number, itemId: number): Observable<void> {
    const apiUrl = `http://127.0.0.1:8080/rater/${rater_id}/exposure/${itemId}`;
    return this.http.delete<void>(apiUrl).pipe(
      catchError(error => {
        console.error('Error deleting item:', error);
        return throwError(() => new Error('Failed to delete item'));
      })
    );
  }
  addModItem(description: string,factor: number,note: string, type: string): Observable<TaxItem> {
    const apiUrl = 'http://127.0.0.1:8080/cart/1/add-mod';
    const body = {description, factor, note, type};
    console.log("POSTING: ",body)
    return this.http.post<TaxItem>(apiUrl, body).pipe(
      catchError(error => {
        console.error('Error adding item:', error);
        return throwError(() => new Error('Failed to add item to cart'));
      })
    );
  }
  deleteModItem(rater_id: number,itemId: number): Observable<void> {
    const apiUrl = `http://127.0.0.1:8080/rater/${rater_id}/exposure/${itemId}`;
    return this.http.delete<void>(apiUrl).pipe(
      catchError(error => {
        console.error('Error deleting item:', error);
        return throwError(() => new Error('Failed to delete item'));
      })
    );
  }

  getAllRaters(): Observable<Cart[]>  {
    return this.http.get<Cart[]>(`${this.apiUrl}`)
  }

  addRater(
    year: number,
    account_id: number,
    business_unit_id: number,
    product: string,
    product_id: number,
    named_insured: string,
    named_insured_id: number,
    business_unit: string
  ): Observable<Cart> {
    const apiUrl = 'http://127.0.0.1:8080/rater';
    // const body = { product_description, premium, quantity, naics_premium, note, naics_code, modifier };
    const body = {
      year ,
      account_id ,
      business_unit_id,
      product,
      product_id ,
      named_insured ,
      named_insured_id ,
      business_unit
    }

    // return this.http.post<Cart>(apiUrl, body).pipe(
    return this.http.post<Cart>(apiUrl,body).pipe(
      catchError(error => {
        console.error('Error adding item:', error);
        return throwError(() => new Error('Failed to add item to cart'));
      })
    );
  }
}