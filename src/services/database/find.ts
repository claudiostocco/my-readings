import { connectToDatabase } from "./mongodb";

export async function find(collection: string, findKey: {}) {
   try {
      console.log(findKey);
      const { db, client } = await connectToDatabase();
      if (client) {
         const cursor = await db.collection(collection).find(findKey);
         const searched = await cursor.next();
         console.log(searched);
         if (searched) {
            return { success: true, searched };
         } else {
            return { success: false, searched: null };
         }
      }      
   } catch (error) {
      return { success: false, searched: null, error };
   }
}