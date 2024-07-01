import db from "@/db/dbconfig"
export default async function getUser(email:string){
      return await db.user.findUnique({
            where: {
                  email:email
            }
      })
}