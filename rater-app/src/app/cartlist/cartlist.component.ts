import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule for ngModel
// import { NaicsService } from '../services/naics.service';
// import { Cart, CartItem, TaxItem } from '../models/cart';
import { Cart } from '../models/cart';

@Component({
  selector: 'app-cartlist',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule], // ✅ Add FormsModule
  templateUrl: './cartlist.component.html',
  styleUrl: './cartlist.component.sass',
  providers: [CartService]

})
export class CartlistComponent {
  raters: Cart[] = [];
  rater: Cart | null = null;

  //Track Creation for new Rater
  newItem: Cart | null = null;
  addingItem: boolean = false;


  constructor(private router: Router, private cartService: CartService) { }
  ngOnInit() {
    this.cartService.getAllRaters().subscribe({
      next: (data: Cart[]) => {
        this.raters = data; // Assign the response to the variable
        // console.log('Carts fetched:', this.raters);
      },
      error: (error) => {
        console.error('Error fetching carts:', error);
      }
    });
  }
  addNewItemRow(): void {

    this.newItem = {
      year: 2025,
      account_id: 1,
      business_unit: "Environmental",
      business_unit_id: 1,
      product: "",
      product_id: 1,
      named_insured: "",
      named_insured_id: 1,
      items: [],
      mods: []
    };
    console.log(this.newItem)
  }

  submitNewItem(): void {
    if (!this.newItem || this.addingItem) return;
    this.addingItem = true;
    this.cartService.addRater(
      this.newItem.year,
      this.newItem.account_id,
      this.newItem.business_unit_id,
      this.newItem.product,
      this.newItem.product_id,
      this.newItem.named_insured,
      this.newItem.named_insured_id,
      this.newItem.business_unit,
    )
    .subscribe({
      next: (createdItem) => {
        console.log('Created Item:', createdItem); // Debugging
        // console.log('Created Item ID:', createdItem?.id); // Check if ID is present
      
        if (createdItem?.id) {
          this.router.navigate(['/rater', createdItem.id]); // ✅ Navigate if ID exists
        } else {
          console.error('Error: Created item ID is undefined');
        }
      },      
    });
  }

  createCart(): void {
    this.cartService.createCart().subscribe({
      next: (newRater) => {
        console.log('Cart created successfully:', newRater);
        this.rater = newRater;
      },
      error: (error) => {
        console.error('Failed to create cart:', error);
      }
    });
  }
}
