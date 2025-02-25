import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule for ngModel
import { CartService } from '../services/cart.service';
import { NaicsService } from '../services/naics.service';
import { Cart, CartItem, TaxItem } from '../models/cart';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // ✅ Add FormsModule
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass'],
  providers: [CartService, NaicsService]
})

export class CartComponent implements OnInit {
  options: any[] | null = [];
  
  cart: Cart | null = null;
  id: string | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  naicsCodes: { code: string, description: string, premium: number }[] = [];
  modItem: { code: string, type: string, description: string, factor: number }[] = [];
  selectedNaics: { code: string, description: string, premium: number } | null = null;
  selectedMod: { code: string, type: string, description: string, factor: number } | null = null;
  // Track new item row
  newItem: CartItem | null = null;
  newMod: TaxItem | null = null;
  addingItem: boolean = false;
  addingMod: boolean = false;

  constructor(private route: ActivatedRoute, private cartService: CartService, private naicsService: NaicsService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart(parseInt(this.id!)).subscribe({
      next: (data) => {
        this.cart = data;
        this.loading = false;
        this.options = this.cart.options
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
    this.naicsService.getNaicsCodes().subscribe(data => {
      this.naicsCodes = Object.entries(data).map(([key, value]) => ({
        code: key,
        description: value.description,
        premium: value.premium
      }));
    });
    this.naicsService.getModifiers().subscribe(data => {
      this.modItem = Object.entries(data).map(([key, value]) => ({
        code: key,  // ✅ Keeping key as code
        type: value.type,  // ✅ Include type since it's in the API response
        description: value.description,
        factor: value.factor
      }));
    });

  }
  selectNaics(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedCode = target.value;
    this.selectedNaics = this.naicsCodes.find(item => item.code === selectedCode) || null;
    console.log(this.selectedNaics)
  }
  selectMod(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedMod = target.value;
    this.selectedMod = this.modItem.find(item => item.code === selectedMod) || null;
    console.log(this.selectedMod)
  }
  createCart(): void {
    this.cartService.createCart().subscribe({
      next: (newCart) => {
        console.log('Cart created successfully:', newCart);
        this.cart = newCart;
        this.errorMessage = null; // ✅ Remove error message if creation is successful
      },
      error: (error) => {
        console.error('Failed to create cart:', error);
        this.errorMessage = error.message;
      }
    });
  }

  get formattedSubtotal(): string {
    return (this.cart?.subtotal_premium ?? 0).toFixed(2);
  }

  get formattedTaxes(): string {
    return (this.cart?.total_modifiers ?? 0).toFixed(2);
  }

  get formattedFinalTotal(): string {
    return (this.cart?.final_premium ?? 0).toFixed(2);
  }

  // ✅ Show a new empty row for adding an item
  addNewItemRow(): void {
    if (!this.cart) return;

    this.newItem = {
      cart_id: this.cart.id,
      product_description: '',
      premium: 0,
      quantity: 1,
      naics_premium: 0,
      note: '',
      naics_code: 111,
      modifier: 100
    };
  }


  addNewModRow(): void {
    if (!this.cart) return;

    this.newMod = {
      cart_id: this.cart.id,
      description: '',
      note: '',
      factor: 1,
      type: ''
    };
  }

  // ✅ Submit the new item to FastAPI
  submitNewItem(): void {
    if (!this.cart || !this.newItem || this.addingItem) return;

    this.addingItem = true; // ✅ Prevent duplicate submissions
    this.newItem.naics_code = Number(this.selectedNaics?.code ?? 0);
    this.newItem.product_description = this.selectedNaics!.description;
    this.newItem.naics_premium = this.selectedNaics!.premium
    this.newItem.premium = (this.newItem.naics_premium * this.newItem.modifier / 100) * this.newItem.quantity

    this.cartService.addCartItem(
      parseInt(this.id!),
      this.newItem.product_description,
      this.newItem.premium,
      this.newItem.quantity,
      this.newItem.naics_premium,
      this.newItem.note,
      this.newItem.naics_code,
      this.newItem.modifier
    ).subscribe({
      next: (createdItem) => {
        this.cart?.items.push(createdItem); // ✅ Add new item to cart list
        this.newItem = null; // ✅ Reset the input row
        this.addingItem = false;
        window.location.reload()
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.addingItem = false;
      }
    });
  }

  
  submitNewMod(): void {
    if (!this.cart || !this.newMod || this.addingMod) return;
    console.log("stop this mess")
    this.addingMod = true; // ✅ Prevent duplicate submissions
    this.newMod.description = this.selectedMod!.description;
    this.newMod.factor = this.selectedMod!.factor;
    this.newMod.type = this.selectedMod!.type;
    this.cartService.addModItem(
      parseInt(this.id!),
      this.newMod.description,
      this.newMod.factor,
      this.newMod.note,
      this.newMod.type
    ).subscribe({
      next: (createdItem) => {
        this.cart?.mods.push(createdItem); // ✅ Add new item to cart list
        this.newItem = null; // ✅ Reset the input row
        this.addingMod = false;
        window.location.reload()
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.addingMod = false;
      }
    });
  }
  // ✅ Cancel new item input row
  cancelNewItem(): void {
    this.newItem = null;
  }

  removeItem(itemId: number | undefined): void {
    if (!this.cart || itemId === undefined) {
      console.error('Remove Item Failed: itemId is undefined or cart is null');
      return;
    }

    console.log(`Removing item with ID: ${itemId}`);

    this.cartService.deleteCartItem(parseInt(this.id!),itemId).subscribe({
      next: () => {
        console.log(`Item ${itemId} removed successfully from backend`);
        this.cart!.items = this.cart!.items.filter(item => item.id !== itemId);
        window.location.reload(); // ✅ Force reload after deletion
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.errorMessage = error.message;
      }
    });

  }

  removeMod(itemId: number | undefined): void {
    if (!this.cart || itemId === undefined) {
      console.error('Remove Item Failed: itemId is undefined or cart is null');
      return;
    }

    console.log(`Removing item with ID: ${itemId}`);

    this.cartService.deleteModItem(parseInt(this.id!),itemId).subscribe({
      next: () => {
        console.log(`Item ${itemId} removed successfully from backend`);
        this.cart!.items = this.cart!.items.filter(item => item.id !== itemId);
        window.location.reload(); // ✅ Force reload after deletion
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.errorMessage = error.message;
      }
    });

  }


}
