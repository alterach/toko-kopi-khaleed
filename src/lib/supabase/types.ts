export interface Product {
    id: number;
    name: string;
    category: 'coffee' | 'non-coffee' | 'heavy-meal' | 'snack';
    price: number;
    description: string | null;
    image_url: string | null;
    is_available: boolean;
    created_at: string;
}

export interface Profile {
    id: string;
    full_name: string | null;
    whatsapp_number: string | null;
    avatar_url: string | null;
    created_at: string;
}

export interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: 'pending' | 'paid' | 'preparing' | 'completed' | 'cancelled';
    dining_option: 'dine-in' | 'takeaway';
    payment_method: string | null;
    payment_ref_id: string | null;
    notes: string | null;
    created_at: string;
}

export interface OrderItem {
    id: number;
    order_id: string;
    product_id: number;
    quantity: number;
    notes: string | null;
}

export interface Favorite {
    user_id: string;
    product_id: number;
    created_at: string;
}

// Category mapping for display
export const CATEGORY_LABELS: Record<Product['category'], string> = {
    'coffee': 'Coffee',
    'non-coffee': 'Non-Coffee',
    'heavy-meal': 'Meals',
    'snack': 'Snacks',
};
