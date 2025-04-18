import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";


const f = createUploadthing();


export const ourFileRouter = {
    videoOrAudioUploader: f({
        video: {
            maxFileSize: "32MB",
            maxFileCount: 1,
        },
        audio: { // Add audio configuration
            maxFileSize: "16MB", // Adjust as needed
            maxFileCount: 1,
        },
    })
        .middleware(async ({ req }) => {
            const user = await currentUser();
            if (!user) throw new UploadThingError("Unauthorized");
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.ufsUrl);

            // Return only JSON-compatible properties
            return {
                userId: metadata.userId,
                file: {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    key: file.key,
                    customId: file.customId,
                },
            };
        }),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
