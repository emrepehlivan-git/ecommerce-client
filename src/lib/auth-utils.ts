import { Session } from "next-auth";

export const hasRole = (session: Session | null, role: string): boolean => {
  if (!session || !session.user || !session.user.role) {
    return false;
  }
  return session.user.role.includes(role);
}; 