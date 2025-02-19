import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Cart, CartItem, TaxItem } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/cart'; // ✅ FastAPI backend

  constructor(private http: HttpClient) { }

  createCart(): Observable<Cart> {
    const apiUrl = 'http://127.0.0.1:8080/cart'; // ✅ FastAPI create cart endpoint
    console.log(`Sending POST request to: ${apiUrl}`);

    return this.http.post<Cart>(apiUrl, {}).pipe(
      catchError(error => {
        console.error('Error creating cart:', error);
        return throwError(() => new Error('Failed to create cart'));
      })
    );
  }
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/1`).pipe(
      catchError(error => {
        console.error('Error fetching cart:', error);
        return throwError(() => new Error('Failed to load cart data'));
      })
    );
  }

  addCartItem(product_description: string,
    premium: number,
    quantity: number,
    naics_premium: number,
    note: string,
    naics_code: number,
    modifier: number): Observable<CartItem> {
    const apiUrl = 'http://127.0.0.1:8080/cart/1/add-item'; // ✅ Ensure correct endpoint
    const body = { product_description, premium, quantity, naics_premium, note, naics_code, modifier };

    return this.http.post<CartItem>(apiUrl, body).pipe(
      catchError(error => {
        console.error('Error adding item:', error);
        return throwError(() => new Error('Failed to add item to cart'));
      })
    );
  }

  deleteCartItem(itemId: number): Observable<void> {
    const apiUrl = `http://127.0.0.1:8080/cart/delete-item/1/${itemId}`; // ✅ FastAPI delete endpoint
    return this.http.delete<void>(apiUrl).pipe(
      catchError(error => {
        console.error('Error deleting item:', error);
        return throwError(() => new Error('Failed to delete item'));
      })
    );
  }
  addModItem(description: string,factor: number,note: string, type: string): Observable<TaxItem> {
    const apiUrl = 'http://127.0.0.1:8080/cart/1/add-mod'; // ✅ Ensure correct endpoint
    const body = {description, factor, note, type};
    console.log("POSTING: ",body)
    return this.http.post<TaxItem>(apiUrl, body).pipe(
      catchError(error => {
        console.error('Error adding item:', error);
        return throwError(() => new Error('Failed to add item to cart'));
      })
    );
  }
  deleteModItem(itemId: number): Observable<void> {
    const apiUrl = `http://127.0.0.1:8080/cart/delete-mod/1/${itemId}`; // ✅ FastAPI delete endpoint
    return this.http.delete<void>(apiUrl).pipe(
      catchError(error => {
        console.error('Error deleting item:', error);
        return throwError(() => new Error('Failed to delete item'));
      })
    );
  }
}
