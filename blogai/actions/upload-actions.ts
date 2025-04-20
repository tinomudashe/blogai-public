"use server";
import getDbConnection from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

async function transcribeWithGemini(base64Audio: string, mimeType: string = "audio/wav") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([
      "Transcribe this audio to text accurately:",
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Audio,
        },
      },
    ]);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("Gemini Transcription Error:", error);
    if (error.errorDetails) {
      console.error("Gemini Error Details:", error.errorDetails);
    }
    return null;
  }
}

export async function transcribeUploadedFile(
  resp: {
    serverData: {
      userId: string;
      url: string;
      name: string;
      type: string;
      size: number;
      key: string;
      ufsUrl: string;
    };
  }[]
) {
  if (!resp) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  // Directly access the properties from serverData
  const { userId, ufsUrl: fileufsUrl, name: fileName, type: fileType } = resp[0].serverData;

  if (!fileufsUrl || !fileName) {
    return {
      success: false,
      message: "File upload details missing",
      data: null,
    };
  }

  try {
    console.log("File URL from UploadThing:", fileufsUrl);
    console.log("File Type from UploadThing:", fileType);
    const mimeType = fileType || "audio/wav";
    console.log("MIME Type used for Gemini:", mimeType);

    const audioBlob = await fetch(fileufsUrl).then(res => res.arrayBuffer());
    const base64Audio = Buffer.from(audioBlob).toString("base64");
    console.log("Base64 Audio Length:", base64Audio.length);

    const transcription = await transcribeWithGemini(base64Audio, mimeType);

    if (!transcription) {
      throw new Error("No transcription found from Gemini.");
    }

    return {
      success: true,
      message: "Transcription successful (Gemini)",
      data: { transcriptions: { text: transcription }, userId },
    };
  } catch (error) {
    console.error("Transcription error", error);
    return {
      success: false,
      message: `Transcription failed: ${error || 'An unexpected error occurred'}`,
      data: null,
    };
  }
}

async function saveBlogPost(userId: string, title: string, content: string) {
  try {
    const sql = await getDbConnection();
    const [insertedPost] = await sql`
    INSERT INTO posts (user_id, title, content)
    VALUES (${userId}, ${title}, ${content})
    RETURNING id
    `;
    return insertedPost.id;
  } catch (error) {
    console.error("Error saving blog post", error);
    throw error;
  }
}

async function getUserBlogPosts(userId: string) {
  try {
    const sql = await getDbConnection();
    const posts = await sql`
    SELECT content FROM posts
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 3
  `;
    return posts.map((post) => post.content).join("\n\n");
  } catch (error) {
    console.error("Error getting user blog posts", error);
    throw error;
  }
}

async function generateBlogPost({
  transcriptions,
  userPosts,
}: {
  transcriptions: string;
  userPosts: string;
}) {
  const prompt = `You are a skilled content writer that converts audio transcriptions into well-structured, engaging blog posts in Markdown format. Create a comprehensive blog post with a catchy title, introduction, main body with multiple sections, and a conclusion. Emulate the tone and writing style below.

User's previous blog posts:
${userPosts}

Transcription to convert:
${transcriptions}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text()?.trim() ?? "";
  } catch (error: any) {
    console.error("Gemini Blog Post Generation Error:", error);
    if (error.response?.status === 400) {
      console.error("Gemini Blog Post Generation Error Details:", error.response.data);
    }
    return "";
  }
}

export async function generateBlogPostAction({
  transcriptions,
  userId,
}: {
  transcriptions: { text: string };
  userId: string;
}) {
  const userPosts = await getUserBlogPosts(userId);

  let postId = null;

  if (transcriptions?.text) {
    const blogPost = await generateBlogPost({
      transcriptions: transcriptions.text,
      userPosts,
    });

    if (!blogPost) {
      return {
        success: false,
        message: "Blog post generation failed, please try again...",
      };
    }

    const [title, ...contentParts] = blogPost?.split("\n\n") || [];

    if (blogPost) {
      postId = await saveBlogPost(userId, title, blogPost);
    }
  } else {
    return {
      success: false,
      message: "No transcription data available.",
    };
  }

  if (postId) {
    revalidatePath(`/posts/${postId}`);
    redirect(`/posts/${postId}`);
  } else {
    return {
      success: false,
      message: "Failed to save the blog post.",
    };
  }
}