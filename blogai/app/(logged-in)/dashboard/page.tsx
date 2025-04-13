import getDBConnection from "@/lib/db"

export default async function Dashboard(){
    const sql = await getDBConnection();

    const response = await sql`SELECT version()`
    const db = getDBConnection();
    return <section>Dashboard {response[0].version}</section>
}