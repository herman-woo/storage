from sqlmodel import Session, select
from sqlalchemy.orm import joinedload
from .models import Cart, CartItem,Tax

from .models import Cart
from db import engine

class CartRepository:
    def __init__(self, session: Session):
        self.session = session

    def save(self, cart: Cart):
        """Insert or update a Cart in the database."""
        self.session.add(cart)
        self.session.commit()
        self.session.refresh(cart)
        return cart


    def find_by_id(self, cart_id: int) -> Cart | None:
        cart = self.session.exec(
            select(Cart)
            .where(Cart.id == cart_id)
            .options(joinedload(Cart.items))  
        ).first()

        print("DEBUG: Cart retrieved:", cart)
        print("DEBUG: Cart items:", cart.items if cart else "No cart found")
        
        return cart

    def get_items_by_cart_id(self, cart_id: int) -> list[CartItem]:
        """Retrieve all CartItems for a specific cart_id."""
        return self.session.exec(
            select(CartItem).where(CartItem.cart_id == cart_id)
        ).all()

    def find_all(self):
        """Retrieve all carts."""
        return self.session.exec(select(Cart)).all()
    
    def delete(self, cart_id: int):
        """Delete a cart by ID."""
        cart = self.find_by_id(cart_id)
        if cart:
            self.session.delete(cart)
            self.session.commit()
            return True
        return False
    

    def find_item_by_id(self, item_id: int) -> CartItem | None:
        item = self.session.exec(select(CartItem).where(CartItem.id == item_id)).first()
        return item
    
    def delete_item(self, item_id: int):
        """Delete a item by ID."""
        item = self.find_item_by_id(item_id)
        if item:
            self.session.delete(item)
            self.session.commit()
            return True
        return False
    
    def find_mod_by_id(self, mod_id: int) -> Tax | None:
        mod = self.session.exec(select(Tax).where(Tax.id == mod_id)).first()
        print(mod)
        return mod    
    def delete_mod(self, mod_id: int):
        """Delete a item by ID."""
        print("Delete Mod")
        mod = self.find_mod_by_id(mod_id)
        if mod:
            self.session.delete(mod)
            self.session.commit()
            return True
        return False    