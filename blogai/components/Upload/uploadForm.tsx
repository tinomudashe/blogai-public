"use client"
import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { z } from 'zod'
import {Toaster} from '@/components/ui/sonner'
import { toast } from 'sonner'
import {useUploadThing} from "@/utils/uploadthing";


const schema =z.object({
    file:z
    .instanceof(File,{message:"Invalid file"})
    .refine(
        (file) => file.size<=20 * 1024 * 1024,
        "File size must not exceed 20MB"
    )
    .refine(
        (file)=>
            file.type.startsWith("audio/") || file.
            type.startsWith("video/"),
            "File must be an audio or a video file"
    ),
})


export default function UploadForm(){

    const {startUpload} = useUploadThing('videoOrAudioUploader', {onClientUploadComplete : () => {
        // Do something with the response
        console.log("file uploaded");
      },
      onUploadError:(error: Error) => {
        // Do something with the error.
        console.log(`ERROR! ${error.message}`);
      },
      onUploadBegin:()=>{
        console.log("test")
      }
    })

    const handleTranscribe = async (formData: FormData)=>{
        
        const file = formData.get("file") as File;

        const validateFields = schema.safeParse({file});

        if(!validateFields.success){
            console.log(
                "validateFields",
                validateFields.error.flatten().fieldErrors
            );
            toast.error(
                "something went wrong",{
                description :validateFields.error.flatten().fieldErrors.file?.[0]?? "Invalid file"
            })
        }

        if (file) {
          const resp = await toast.promise(startUpload([file]), {
            loading: 'Uploading file...',
            success: () => 'Upload complete!',
            error: (err) => `Upload failed: ${err.message}`,
            
          });
          console.log(resp);
        }
    }

  return (
    <form className='flex flex-col gap-6 ' action={handleTranscribe}>
        <div className='flex justify-end items-center gap-1.5'>
            <Input id="file" name="file" type='file' accept="audio/*,video/* " required/>
            <Button className="bg-purple-600">Transcribe</Button>
        </div>
    </form>
  )
}
