import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";


const f = createUploadthing();

export const ourFileRouter = {
  videoOrAudioUploader: f({ video: { maxFileSize: "32MB" } })
    .middleware(async ({ req }) => {
      const user = await currentUser();

      console.log({ user });

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      if (!file || !file.ufsUrl) {
        console.error("File or file.ufsUrl is undefined");
        throw new UploadThingError("Invalid file data");
      }

      console.log("file url", file.ufsUrl);

      // Return the data in the structure expected by the client
      return {
        serverData: {
          userId: metadata.userId,
          file: {
            ufsUrl: file.ufsUrl,
            name: file.name,
            type: file.type,
          },
        },
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;