import { BlogCard } from "@/components/BlogCard";

// Sample data - this will be replaced with real data later
const sampleBlogs = [
  {
    id: 1,
    title: "Getting Started with React",
    author: "John Doe",
    content: "React is a popular JavaScript library for building user interfaces. In this blog post, we'll explore the basics of React and how to get started with your first React application.",
    likes: 15,
    dislikes: 2,
    date: "2024-02-20"
  },
  {
    id: 2,
    title: "Understanding TypeScript",
    author: "Jane Smith",
    content: "TypeScript adds static typing to JavaScript, making it easier to write and maintain large applications. Let's dive into the key features that make TypeScript a powerful tool for modern web development.",
    likes: 10,
    dislikes: 1,
    date: "2024-02-19"
  },
  {
    id: 3,
    title: "Mastering Tailwind CSS",
    author: "Alex Johnson",
    content: "Tailwind CSS is a utility-first CSS framework that can speed up your development workflow. In this guide, we'll cover the fundamentals and best practices for using Tailwind in your projects.",
    likes: 20,
    dislikes: 3,
    date: "2024-02-18"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">BlogBloom</h1>
          <p className="text-muted-foreground">Discover interesting stories and share your thoughts</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              title={blog.title}
              author={blog.author}
              content={blog.content}
              likes={blog.likes}
              dislikes={blog.dislikes}
              date={blog.date}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;