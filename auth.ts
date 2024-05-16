import NextAuth from "next-auth"
import github from "next-auth/providers/github"
import connectDB from "./lib/db"
import { User } from "./models/user.model";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
      github({
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENT_SECRET
      })
  ],
  secret: process.env.AUTH_SECRET,

  callbacks:{
    async signIn({account, profile}){
      if(account?.provider === 'github'){
        await connectDB();
        try{
          const user = await User.findOne({email:profile?.email});
          if(!user){
            const newUser = await User.create({
              username: profile?.login,
              fullname: profile?.name,
              email: profile?.email,
              profilePhoto: profile?.avatar_url
            })
            await newUser.save();
          }
          return true;
        }catch(error){
          console.log(error);
          return false;
        }
      }
      return false;
    }
  }
})