import { connectToDatabase } from "./mongodb";

export async function insert(collection: string, findKey: {}, data: any) {
   try {
      const { db, client } = await connectToDatabase();
   
      if (client) {
         const search = await db.collection(collection).findOne(findKey);
         if (!search) {
            const inserted = await db.collection(collection).insertOne(data);
            return { success: true, inserted };
         } else {
            return { success: false, inserted: null };
         }
      }      
   } catch (error) {
      return { success: false, inserted: null, error };
   }
}