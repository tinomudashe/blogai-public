import getDbConnection from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import ContentEditor from "@/components/content/content-editor";

export default async function PostPage({ params: { id } }: { params: { id: string } }) {
    const user = await currentUser();
    if (!user) {
        return redirect("/sign-in")
    }

    const sql = await getDbConnection();
    const posts: any = await sql`SELECT * FROM POSTS where user_id = ${user.id} and id = ${id}`;

    return <ContentEditor posts={posts} />;
}