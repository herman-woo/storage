from sqlalchemy.orm import Session
from .models import Rater, Exposure
import math

def calculate_cart_totals(cart: Rater):
    """ Recalculates subtotal, tax, and final total for a cart. """
    subtotal = sum(item.premium for item in cart.items)

    # ✅ Calculate tax factor safely
    tax_factor = math.prod(tax.factor for tax in cart.taxes) if cart.taxes else 1.0

    final_total = subtotal * tax_factor

    cart.subtotal = subtotal
    cart.taxes_total = tax_factor  # ✅ Store computed tax in a separate field
    cart.final_total = final_total

    return cart

def add_item_to_cart(db: Session, cart_id: int, item_data: dict):
    """ Adds an item to the cart and updates totals. """
    cart = db.get(Rater, cart_id)
    if not cart:
        raise ValueError("Cart not found.")

    new_item = Exposure(cart_id=cart_id, **item_data)
    db.add(new_item)
    db.commit()
    db.refresh(cart)

    # Recalculate totals
    updated_cart = calculate_cart_totals(cart)
    db.commit()
    
    return updated_cart
