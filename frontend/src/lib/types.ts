export type Role = "ADMIN" | "MANAGER" | "STAFF";

export type AuthUser = {
  token: string;
  userId: number;
  email: string;
  fullName: string;
  roles: Role[];
};

export type Product = {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  categoryId: number | null;
  categoryName: string | null;
  supplierId: number | null;
  supplierName: string | null;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  lowStock: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type StockMovement = {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  type: "IN" | "OUT";
  quantity: number;
  reason: string | null;
  performedById: number | null;
  performedByEmail: string | null;
  createdAt: string;
};

export type Category = { id: number; name: string };
export type Supplier = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  contactName: string | null;
};

export type AppUser = {
  id: number;
  email: string;
  fullName: string;
  enabled: boolean;
  roles: Role[];
  createdAt: string;
};

export type AuditLog = {
  id: number;
  actorId: number | null;
  actorEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
};

export type Dashboard = {
  totalProducts: number;
  lowStockCount: number | null;
  recentMovements: StockMovement[];
};
