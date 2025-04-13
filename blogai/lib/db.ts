import { neon } from '@neondatabase/serverless';

export default async function getDbConnection() {
    if(!process.env.DATABASE_URL){
        throw new Error("Neon Database URL isnot defined");
    }
  const sql = neon(process.env.DATABASE_URL);
  return sql;

}
