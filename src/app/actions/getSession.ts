import { getServerSession } from "next-auth";
import { AuthOptions } from "../../lib/authOptions";

export default async function getSession(){
      return await  getServerSession(AuthOptions);
      
}