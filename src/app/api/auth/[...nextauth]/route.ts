import NextAuth from "next-auth/next";
import { AuthOptions } from "../../../../lib/AuthOptions";
//@ts-ignore
const handlers=NextAuth(AuthOptions)

export {handlers as GET, handlers as POST}