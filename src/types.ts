export interface Product {
    id: string;
    name: string;
    price: string;
    stock: number;
}

export interface ChartItem extends Product {
    quantity: number;
}