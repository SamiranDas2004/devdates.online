import dbConnect from "@/lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/models/user";
import bcrypt from 'bcrypt';
import { NextAuthOptions } from "next-auth";
import axios from 'axios';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({ email: credentials.email });

          if (!user) {
            throw new Error('No user found');
          }
          if (!user.password) {
            return new Error("no password")
          }

          const passwordCorrect = await bcrypt.compare(credentials.password, user.password);

          if (passwordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (error: any) {
          throw new Error(error);
        }
      }
    })
  ],
  pages: {
    signIn: '/signin'
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // No GitHub provider logic here
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.email = token.email;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET
}
