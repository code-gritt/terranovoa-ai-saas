import { DefaultSession, DefaultUser } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  }

  interface AdapterUser extends AdapterUser {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      subscription: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  }
}
