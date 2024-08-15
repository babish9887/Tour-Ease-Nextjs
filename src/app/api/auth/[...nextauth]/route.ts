import NextAuth from "next-auth/next";
import { MyAuthOptions } from "../../../../lib/AuthOptions";
//@ts-ignore
const handlers=NextAuth(MyAuthOptions)

export {handlers as GET, handlers as POST}