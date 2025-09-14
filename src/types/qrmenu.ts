// QR Menü modülü için tip tanımlamaları

export interface MenuCategory {
    id: string;
    name: string;
    description?: string;
    order: number;
    isActive: boolean;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface MenuItem {
    id: string;
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    image?: string;
    ingredients?: string[];
    allergens?: string[];
    nutritionInfo?: NutritionInfo;
    isAvailable: boolean;
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    spicyLevel?: 1 | 2 | 3 | 4 | 5;
    preparationTime?: number; // dakika cinsinden
    order: number;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface NutritionInfo {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
}

export interface Menu {
    id: string;
    customerId: string;
    name: string;
    description?: string;
    isActive: boolean;
    qrCode?: string;
    qrCodeUrl?: string;
    theme: MenuTheme;
    settings: MenuSettings;
    categories: MenuCategory[];
    items: MenuItem[];
    createdAt: string;
    updatedAt: string;
}

export interface MenuTheme {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    logoUrl?: string;
    backgroundImage?: string;
}

export interface MenuSettings {
    showPrices: boolean;
    showImages: boolean;
    showDescription: boolean;
    showNutrition: boolean;
    showAllergens: boolean;
    showPreparationTime: boolean;
    allowOrdering: boolean;
    currency: string;
    language: 'tr' | 'en';
    contactInfo?: ContactInfo;
}

export interface ContactInfo {
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
    socialMedia?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
    };
}

export interface QRMenuStats {
    totalViews: number;
    dailyViews: number;
    weeklyViews: number;
    monthlyViews: number;
    popularItems: Array<{
        itemId: string;
        itemName: string;
        views: number;
    }>;
    viewsByHour: Array<{
        hour: number;
        views: number;
    }>;
}

export type MenuFormData = Omit<Menu, 'id' | 'createdAt' | 'updatedAt' | 'qrCode' | 'qrCodeUrl'>;
export type CategoryFormData = Omit<MenuCategory, 'id' | 'createdAt' | 'updatedAt'>;
export type ItemFormData = Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>;
