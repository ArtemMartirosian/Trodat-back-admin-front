 type ProductType = {
    _id: any;
    id: string;
    count: number; // Optional geolocation information
};


export type OrdersType = {
    _id: string;
    customerName: string;
    totalPrice: number;
    status: string;
    customerEmail: string;
    customerPhone: string;
    customerLastName: string;
    products: ProductType[]; // Array of addresses with optional geolocation
};
