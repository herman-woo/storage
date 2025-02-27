from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from decimal import Decimal

class Exposure(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    rater_id: int = Field(foreign_key="rater.id", index=True)  # Foreign key linking to Cart
    product_description: str
    naics_code: int
    naics_premium: float
    quantity: int
    modifier: float
    note: str
    premium: float

    cart: Optional["Rater"] = Relationship(back_populates="items")


class Modifier(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    rater_id: int = Field(foreign_key="rater.id", index=True)  # Foreign key linking to Cart
    type: str
    description: str
    note: str
    factor: float
    cart: Optional["Rater"] = Relationship(back_populates="taxes")

class Rater(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    subtotal: float = Field(default=Decimal(0))
    taxes_total: float = Field(default=Decimal(0))
    final_total: float = Field(default=Decimal(0))
    items: List["Exposure"] = Relationship(back_populates="cart", sa_relationship_kwargs={"lazy": "joined"})
    taxes: List["Modifier"] = Relationship(back_populates="cart", sa_relationship_kwargs={"lazy": "joined"})
