export interface Product {
  id: string;
  active: boolean;
  category: string;
  createdAt: Date;
  description: string;
  tipoMadera?: string;
  discount: {
    amount: number;
    percentage: number;
  };
  featuredBrand: boolean;
  freeShipping: boolean;
  images: string[];
  name: string;
  newArrival: boolean;
  price: number;
  promos: Array<{
    cantidad: number;
    descuento: number;
    precioFinal: number;
  }>;
  rating: number;
  sales: number;
  specialOffer: boolean;
  srcUrl: string;
  stock: number;
  subcategory: string;
  title: string;
  updatedAt: string;
} 