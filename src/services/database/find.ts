import { connectToDatabase } from "./mongodb";

export async function find(collection: string, findKey: {}) {
   try {
      console.log(findKey);
      const { db, client } = await connectToDatabase();
      if (client) {
         console.log('conectado');
         const searched = await db.collection(collection).find(findKey);
         console.log(searched);
         if (!searched) {
            return { success: true, searched };
         } else {
            return { success: false, searched: null };
         }
      }      
   } catch (error) {
      return { success: false, searched: null, error };
   }
}