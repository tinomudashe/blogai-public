import { ForwardRefEditor } from "./forward-ref-editor";

interface ContentEditorProps {
  posts: Array<{ content: string; title: string }>;
}

export default function ContentEditor({ posts }: ContentEditorProps) {
  // Log the content for debugging purposes
  console.log("ContentEditor received posts:", posts);

  // Check if posts array has at least one element and if that element has content
  if (posts && posts.length > 0 && posts[0]?.content) {
    return (
      <div>
        <ForwardRefEditor markdown={posts[0].content} className="markdown-content border-dotted border-gray-200 border-2 p-4 rounded-md animate-in ease-in-out duration-75"/>
      </div>
    );
  } else {
    // Handle the case where posts is empty or content is missing
    return <div>No content to display.</div>;
  }
}