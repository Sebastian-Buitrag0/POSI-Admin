export interface SuperAdminLoginRequest {
  email: string
  password: string
}

export interface SuperAdminLoginResponse {
  accessToken: string
  refreshToken: string
  email: string
  firstName: string
  lastName: string
}

export interface TenantSummary {
  id: string
  name: string
  slug: string
  plan: string
  isActive: boolean
  userCount: number
  productCount: number
  saleCount: number
  createdAt: string
}

export interface TenantDetail {
  id: string
  name: string
  slug: string
  plan: string
  isActive: boolean
  createdAt: string
  userCount: number
  productCount: number
  categoryCount: number
  saleCount: number
  totalRevenue: number
  users: TenantUserSummary[]
}

export interface TenantUserSummary {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  createdAt: string
}

export interface GlobalUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  tenantId: string
  tenantName: string
  createdAt: string
}

export interface DailyGlobalSales {
  date: string
  revenue: number
  count: number
}

export interface TopProductGlobal {
  name: string
  quantity: number
  revenue: number
}

export interface SuperAdminDashboard {
  totalTenants: number
  activeTenants: number
  totalUsers: number
  totalSales: number
  totalRevenue: number
  tenantsCreatedThisMonth: number
  usersCreatedThisMonth: number
  revenueThisMonth: number
  recentTenants: TenantSummary[]
  salesByDay: DailyGlobalSales[]
}

export interface TenantStats {
  tenantId: string
  tenantName: string
  totalSales: number
  totalRevenue: number
  averageTicket: number
  totalProducts: number
  totalCategories: number
  totalUsers: number
  salesByDay: DailyGlobalSales[]
  topProducts: TopProductGlobal[]
}

export interface CreateTenantRequest {
  name: string
  adminEmail: string
  adminFirstName: string
  adminLastName: string
  adminPassword: string
}

export interface UpdateTenantRequest {
  plan?: string
  isActive?: boolean
}
