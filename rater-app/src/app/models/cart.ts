export interface TaxItem {
    id?: number; // Optional since new items won't have an ID yet
    cart_id: number;
    note: string;
    factor: number;
    description: string;
    type: string
}

export interface CartItem {
    id?: number; // Optional since new items won't have an ID yet
    cart_id: number;
    product_description: string
    naics_premium: number
    note: string
    premium: number;
    quantity: number;
    naics_code: number;
    modifier: number
}

export interface Cart {
    id: number;
    subtotal: number;
    taxes_total: number;
    final_total: number;
    items: CartItem[];
    mods: TaxItem[];
}
