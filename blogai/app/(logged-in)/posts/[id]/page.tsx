import getDbConnection from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import ContentEditor from "@/components/content/content-editor";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // Await the `params` to extract `id`.
    const user = await currentUser();
    if (!user) {
        return redirect("/sign-in")
    }

    const sql = await getDbConnection();
    const posts: any = await sql`SELECT * FROM POSTS where user_id = ${user.id} and id = ${id}`;

    return (
        <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-0 mb-5 mt-15">
            <ContentEditor posts={posts} />
        </div>
    );
}