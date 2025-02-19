from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from decimal import Decimal

class CartItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    cart_id: int = Field(foreign_key="cart.id", index=True)  # Foreign key linking to Cart
    product_description: str
    naics_code: int
    naics_premium: float
    quantity: int
    modifier: float
    note: str
    premium: float

    # ✅ Relationship back to Cart
    cart: Optional["Cart"] = Relationship(back_populates="items")


class Tax(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    cart_id: int = Field(foreign_key="cart.id", index=True)  # Foreign key linking to Cart
    type: str
    description: str
    note: str
    factor: float

    # ✅ Relationship back to Cart
    cart: Optional["Cart"] = Relationship(back_populates="taxes")


class Cart(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    subtotal: float = Field(default=Decimal(0))
    taxes_total: float = Field(default=Decimal(0))
    final_total: float = Field(default=Decimal(0))

    items: List["CartItem"] = Relationship(
        back_populates="cart", sa_relationship_kwargs={"lazy": "joined"}
    )
    taxes: List["Tax"] = Relationship(
        back_populates="cart", sa_relationship_kwargs={"lazy": "joined"}
    )
