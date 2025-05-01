# ✍️ Blogai - Turn Your Video and audio files into Captivating Blog Posts with AI

Blogai is a modern **Next.js** app I built to simplify content creation. It takes video and audio files and turns them into SEO-friendly blog posts—fast. With AI doing the heavy lifting, it’s easier to repurpose your content and grow your reach. I built this as part of my portfolio to show how tech can work smarter.

[![blogai.blog](https://img.shields.io/badge/blogai.blog-blue?style=for-the-badge)](https://blogai.blog)
[![Vercel Deployment](https://vercel.com/button)](https://vercel.com/)

### ✨ Key Features

* **AI-Powered Conversion:** Effortlessly transcribe and transform video and audio into well-structured blog posts using advanced AI models.
* **SEO Optimization:** Generates blog posts with a focus on search engine optimization to improve discoverability.
* **Content Repurposing:** Easily repurpose existing video and audio content into engaging written articles.

## 🛠️ Technologies Used

* **[Next.js](https://nextjs.org/)**: The React framework for production, enabling features like server-side rendering and static site generation.
* **[Clerk](https://clerk.com/)**: Provides seamless user authentication and management.
* **[@google-cloud/speech](https://cloud.google.com/speech-to-text)**: Leveraged for powerful and accurate speech-to-text capabilities.
* **[@google/generative-ai](https://ai.google.dev/gemini)** & **Gemini Flash 2**: Utilizing Google's advanced generative AI models for content creation and optimization.
* **[@mdxeditor/editor](https://mdxeditor.dev/)**: A rich and extensible MDX editor for creating and editing blog post content.
* **[@neondatabase/serverless](https://neon.tech/)**: Utilizing Neon's serverless PostgreSQL for scalable and efficient database management.
* **[@radix-ui/react-dialog](https://www.radix-ui.com/primitives/docs/components/dialog)** & **[@radix-ui/react-slot](https://www.radix-ui.com/primitives/docs/components/slot)**: Providing accessible and composable UI primitives.
* **[@uploadthing/react](https://uploadthing.com/docs/react)** & **[uploadthing](https://uploadthing.com/)**: Simplifying file uploads for video and audio content.
* **[async-retry](https://www.npmjs.com/package/async-retry)**: For handling potentially flaky asynchronous operations with retries.
* **[buffer](https://www.npmjs.com/package/buffer)**: For working with binary data.
* **[class-variance-authority](https://cva.style/)**, **[clsx](https://www.npmjs.com/package/clsx)**, **[tailwind-merge](https://www.npmjs.com/package/tailwind-merge)**: Utility libraries for managing CSS class names effectively.
* **[lucide-react](https://lucide.dev/)**: Beautifully simple SVG icons.
* **[next-themes](https://github.com/pacocoursey/next-themes)**: For easy theming support (light/dark mode).
* **[openai](https://openai.com/)**: Potentially used for additional AI-powered features or content generation aspects.
* **[react](https://react.dev/)** & **[react-dom](https://react.dev/)**: The core React libraries for building the user interface.
* **[sonner](https://sonner.emilkowalski.com/)**: For delightful and informative toast notifications.
* **[stripe](https://stripe.com/)**: Likely integrated for handling payments or subscriptions (if applicable).
* **[tw-animate-css](https://www.npmjs.com/package/tw-animate-css)**: For adding Tailwind CSS-based animations.
* **[zod](https://zod.dev/)**: For robust schema validation.

## ⚙️ Scripts

The following scripts are available in the `package.json`:

* `dev`: Runs the Next.js development server.
* `build`: Builds the production-ready application.
* `start`: Starts the Next.js production server.
* `lint`: Runs ESLint for code linting.

## 📦 Dependencies

* `@clerk/nextjs`
* `@google-cloud/speech`
* `@google/generative-ai`
* `@mdxeditor/editor`
* `@neondatabase/serverless`
* `@next/eslint-plugin-next`
* `@radix-ui/react-dialog`
* `@radix-ui/react-slot`
* `@uploadthing/react`
* `async-retry`
* `buffer`
* `class-variance-authority`
* `clsx`
* `lucide-react`
* `next`
* `next-themes`
* `openai`
* `react`
* `react-dom`
* `sonner`
* `stripe`
* `tailwind-merge`
* `tw-animate-css`
* `uploadthing`
* `zod`

## 🛠️ Development Dependencies

* `@eslint/eslintrc`
* `@tailwindcss/postcss`
* `@types/async-retry`
* `@types/node`
* `@types/react`
* `@types/react-dom`
* `eslint`
* `eslint-config-next`
* `tailwindcss`
* `typescript`

## 🌐 Languages

* **TypeScript**: 89.9%
* **CSS**: 8.9%

## 🚀 Deployment

This project is deployed on **Vercel**.
