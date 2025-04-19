import { neon } from '@neondatabase/serverless';
import { error } from 'console';

export default async function getDbConnection() {
    console.log("neon connected");
    if(!process.env.DATABASE_URL){
      console.log("error connecting to neon");
        throw new Error("Neon Database URL isnot defined");
        
    }
  const sql = neon(process.env.DATABASE_URL);
  return sql;

}
