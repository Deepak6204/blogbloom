import { BlogCard } from "@/components/BlogCard";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">BlogBloom</h1>
            <p className="text-muted-foreground">Discover interesting stories and share your thoughts</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">BlogBloom</h1>
          <p className="text-muted-foreground">Discover interesting stories and share your thoughts</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.map((blog) => (
            <BlogCard
              key={blog.id}
              title={blog.title}
              author={blog.author}
              content={blog.content}
              likes={blog.likes_count}
              dislikes={blog.dislikes_count}
              date={new Date(blog.created_at).toLocaleDateString()}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;