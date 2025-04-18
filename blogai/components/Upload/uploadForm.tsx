"use client";

import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner"
import { useUploadThing } from "@/utils/uploadthing";
import {
  generateBlogPostAction,
  transcribeUploadedFile,
} from "@/actions/upload-actions";


const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must not exceed 20MB"
    )
    .refine(
      (file) =>
        file.type.startsWith("audio/") || file.type.startsWith("video/"),
      "File must be an audio or a video file"
    ),
});

export default function UploadForm() {


  const { startUpload } = useUploadThing("videoOrAudioUploader", {
    onClientUploadComplete: () => {
        toast.dismiss();
      toast.success("uploaded successfully!");
    },
    onUploadError: (err) => {
      console.error("Error occurred", err);
    },
    onUploadBegin: () => {
        toast.dismiss();
      toast.loading("Uploading file.. 🚀!");
    },
  });

  const handleTranscribe = async (formData: FormData) => {
    const file = formData.get("file") as File;

    const validatedFields = schema.safeParse({ file });

    if (!validatedFields.success) {
      console.log(
        "validatedFields",
        validatedFields.error.flatten().fieldErrors
      );
      toast.dismiss();
      toast.error(
          validatedFields.error.flatten().fieldErrors.file?.[0] ??
          "Invalid file",
      );
    }

    if (file) {
      const resp: any = await startUpload([file]);
      console.log({ resp });

      if (!resp) {
        toast.dismiss();
        toast(
          "Something went wrong",
        );
      }
      toast.dismiss();
      toast.loading( "🎙️ Transcription is in progress...");

      const result = await transcribeUploadedFile(resp);
      const { data = null, message = null } = result || {};

      if (!result || (!data && !message)) {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }

      if (data) {
        toast.dismiss();
        
        const toastId = toast.loading("Please wait while we generate your blog post.", {
          duration: 10000,
        });
        
        setTimeout(() => {
          toast.dismiss(toastId);
          toast.success("🎉 Blog created successfully!");
        }, 10000);

        await generateBlogPostAction({
          transcriptions: data.transcriptions,
          userId: data.userId,
        });

        
        
      }
    }
  };
  return (
    <form className="flex flex-col gap-6" action={handleTranscribe}>
      <div className="flex justify-end items-center gap-1.5">
        <Input
          id="file"
          name="file"
          type="file"
          accept="audio/*,video/*"
          required
        />
        <Button className="bg-purple-600">Transcribe</Button>
      </div>
    </form>
  );
}