"use client"
import { useActionState, useCallback, useState, useEffect, useRef } from "react";
import { BgGradient } from "../common/bg-gradient";
import { ForwardRefEditor } from "./forward-ref-editor";
import { useFormStatus } from "react-dom";
import { updatePostAction } from "@/actions/editActions";
import { Button } from "../ui/button";
import { Download, Edit2, Loader2 } from "lucide-react";



const SubmitButton = ()=>{
  const {pending} = useFormStatus();
  return <Button 
  type = "submit" 
  className={
    `w-40 bg-gradient-to-r from-purple-900 to-indigo-600 hover:from-purple-600
     hover:to-indigo-900 text-white font-semibold py-2 px-4 rounded-full 
     shadow-lg transform transition duration-200 ease-in-out hover:scale-105 
     focus:outline-none focus:ring-2`} disabled={pending}
     >
     {pending ? (
      <span className="flex items-center justify-center">
        <Loader2 className="w-5 h-5 mr-2 animate-spin"/>Updating...</span>
     ):(
      <span className="flex items-center justify-center">
        <Edit2 className="w-5 h-5 mr-2"/>Update Blog
      </span>
     )}
     </Button>
}

const initialState ={
  success:false,
}

type UploadState = {
  success:boolean;
}

type UploadAction = (
  state: UploadState,
  formData: FormData
)=> Promise<UploadState>

export default function ContentEditor({ posts }: {
  posts: Array<{ content: string; title: string; id: string }>;
}) {
  console.log("ContentEditor received posts:", posts);

  // Initialize with empty string or first post's content if available
  const [content, setContent] = useState(posts[0]?.content ?? "");
  const [, setIsChanged] = useState(false);

  // Track mount status
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Update content if posts prop changes
  useEffect(() => {
    setContent(posts[0]?.content ?? "");
    setIsChanged(false);
  }, [posts]);

  const updatePostActionWithId = updatePostAction.bind(null, { postId: posts[0]?.id, content });

  const [, formAction] = useActionState<UploadState, FormData>(
    updatePostActionWithId as unknown as UploadAction,
    initialState
  );

  const handleContentChange = (value: string) => {
    if (!isMounted.current) return; // Prevent state update if not mounted
    setContent(value);
    setIsChanged(true);
  };

const handleExport = useCallback(() =>{
  const filename = `${posts[0].title || 'blog-posts'}.md`;

  const blob = new Blob([content], {type:'text/markdown; charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link)
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
},[content,posts]);

    return (
      <form action={formAction} className=" flex flex-col gap-2">
            <div className="flex justify-between items-center border-b-2 border-gray-200/50 pb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2"> Edit your blog</h2>
                <p className=" text-gray-600">Edit content below..</p>
            </div>
        <div className="flex gap-4">
          <SubmitButton></SubmitButton>
          <Button onClick={handleExport} className="w-30 bg-gradient-to-r from-slate-500 to-slate-900 hover:from-slate-600 hover:to-slate-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
          ><Download className="w-5 h-5 mr-2"/>Export</Button>
        </div>
        </div>
        <BgGradient className="opacity-20">
        <ForwardRefEditor markdown={posts[0].content} className="markdown-content border-dotted border-gray-200 border-2 p-4 
        rounded-md animate-in ease-in-out duration-75" onChange={handleContentChange}/>
        </BgGradient>
        
      </form>
    );
}