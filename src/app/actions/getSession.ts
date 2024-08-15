import { getServerSession } from "next-auth";
import { MyAuthOptions } from "../../lib/AuthOptions";

export default async function getSession(){
      return await  getServerSession(MyAuthOptions);
      
}