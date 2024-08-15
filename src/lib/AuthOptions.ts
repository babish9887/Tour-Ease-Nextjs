import GoogleProvider from 'next-auth/providers/google'
import prisma from '../db/dbconfig'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { AuthOptions } from 'next-auth'
export const MyAuthOptions:AuthOptions = {
      adapter:PrismaAdapter(prisma),
      session: {
            strategy:"jwt"
      },

      providers:[
          GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
          }),
          CredentialsProvider({
            name: 'credentials',
            credentials:{
                  email: {label:'email', type:'text'},
                  password:{label:'password', type: 'password'},
            },
            async authorize(credentials){
                  if(!credentials?.email || !credentials?.password){
                        throw new Error('Invalid Credentials')
                  }
                  const user = await prisma.user.findUnique({
                        where: {
                              email: credentials.email
                        }
                  });
                  if(!user || !user?.password){
                        throw new Error('Invalid Credentials');
                  }
                  const isCorrectPassword = await bcrypt.compare(credentials.password, user.password);
                  if(!isCorrectPassword)
                        throw new Error('Invalid Credentials Password')
                  return user;
            }
      })
      ],
      callbacks: {
            async session({token, session}:any){
                  if(token){
                        const sessiona={
                              ...session,
                              user:{
                                    ...session.user,
                                    role:token.role,
                                    emailVerified:token.emailVerified
                              }
                        }
                        return sessiona
                        // return {...session, user:{...session.user, role:token.role,  emailVerified: token.emailVerified,}}
                  }

                  return session
            },
            async jwt({token ,user}:any){
                  const dbUser=await prisma.user.findFirst({
                        where: {
                              email:token.email
                        },

                  })
                  console.log(dbUser)
                  if(!dbUser){
                        return token
                  }
                  return {
                        id:dbUser.id,
                        name:dbUser.name,
                        role:dbUser.role,
                        email:dbUser.email,
                        picture:dbUser.image,
                        emailVerified:dbUser.emailVerified
                  }
            }
      }
}