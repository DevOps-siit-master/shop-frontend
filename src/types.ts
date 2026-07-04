export interface Product {
    id: string;
    name: string;
    price: string;
    stock: number;
}

export interface CartItem extends Product {
    quantity: number;
}