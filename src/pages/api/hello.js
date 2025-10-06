
  // pages/api/checkDb.js
  import { getDBConnection } from '../../lib/db';

  export default async function POST(req,res){
    try {
      const db = await getDBConnection();
      
      
    } catch (error) {
      
    }
  }