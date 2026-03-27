export type UserRole = "Admin" | "Doctor" | "Patient" | "Reception" | "Pharmacy" | "Lab" | "Security" | "Billing";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  Admin: "/admin",
  Doctor: "/doctor",
  Patient: "/patient",
  Reception: "/reception",
  Pharmacy: "/pharmacy",
  Lab: "/lab",
  Security: "/security",
  Billing: "/billing",
};
