export interface TaxItem {
    id?: number; // Optional since new items won't have an ID yet
    cart_id: any;
    note: string;
    factor: number;
    description: string;
    type: string
}

export interface CartItem {
    id?: number | undefined; // Optional since new items won't have an ID yet
    cart_id: any;
    product_description: string
    naics_premium: number
    note: string
    premium: number;
    quantity: number;
    naics_code: number;
    modifier: number
}

export interface Cart {
    id?: number;
    subtotal?: number;
    taxes_total?: number;
    final_total?: number;
    items: CartItem[];
    mods: TaxItem[];
    options: any[];
    business_unit: string;
    business_unit_id: number;
    year: number,
    named_insured_id: number,
    account_id: number,
    product_id: number,
    subtotal_premium?: number,
    final_premium?: number,
    named_insured: string,
    product: string,
    total_modifiers?: number
}