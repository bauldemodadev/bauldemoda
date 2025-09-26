// src/utils/cartUtils.ts

import { CartItem } from "@/lib/features/carts/cartsSlice";

export const getLocalCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const localCart = localStorage.getItem("cart");
    if (!localCart) return [];
    
    const parsed = JSON.parse(localCart);
    
    // Validar que sea un array
    if (!Array.isArray(parsed)) {
      console.warn("Cart data in localStorage is not an array, clearing and returning empty array");
      localStorage.removeItem("cart");
      return [];
    }
    
    // Validar que cada item tenga la estructura correcta de CartItem
    const validItems = parsed.filter((item: any) => {
      return item && 
             typeof item === 'object' && 
             typeof item.id === 'string' && 
             typeof item.quantity === 'number' &&
             item.quantity > 0 &&
             typeof item.price === 'number' &&
             typeof item.name === 'string';
    });
    
    // Si hay items inválidos, limpiar el localStorage
    if (validItems.length !== parsed.length) {
      console.warn("Some cart items are invalid, cleaning localStorage");
      localStorage.setItem("cart", JSON.stringify(validItems));
    }
    
    return validItems;
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    // Si hay error al parsear, limpiar y devolver array vacío
    localStorage.removeItem("cart");
    return [];
  }
};

export const saveLocalCart = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(items));
};

export const clearLocalCart = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("cart");
};

export const getLocalCartCount = (): number => {
  try {
    const cart = getLocalCart();
    return cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
  } catch (error) {
    console.error("Error calculating cart count:", error);
    return 0;
  }
};

export const validateAndCleanCart = (): CartItem[] => {
  try {
    const cart = getLocalCart();
    // Si hay algún problema, limpiar completamente
    if (!Array.isArray(cart) || cart.some(item => !item || typeof item !== 'object')) {
      console.warn("Cart validation failed, clearing completely");
      clearLocalCart();
      return [];
    }
    return cart;
  } catch (error) {
    console.error("Cart validation error:", error);
    clearLocalCart();
    return [];
  }
};

export const mergeCarts = (localItems: CartItem[], remoteItems: CartItem[]): CartItem[] => {
  const merged: { [id: string]: CartItem } = {};

  [...remoteItems, ...localItems].forEach((item) => {
    if (merged[item.id]) {
      merged[item.id].quantity += item.quantity;
      merged[item.id].price = merged[item.id].quantity * item.price;
    } else {
      merged[item.id] = { ...item };
    }
  });

  return Object.values(merged);
};
