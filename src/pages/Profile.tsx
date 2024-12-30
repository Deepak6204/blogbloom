import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/BlogCard";

// Sample user data - will be replaced with real data later
const userData = {
  username: "johndoe",
  email: "john@example.com",
  joinDate: "February 2024",
  blogs: [
    {
      id: 1,
      title: "My First Blog Post",
      content: "This is my first blog post on BlogBloom. I'm excited to share my thoughts and ideas with the community!",
      author: "johndoe",
      likes: 5,
      dislikes: 1,
      date: "2024-02-21"
    }
  ]
};

export default function Profile() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 p-6 bg-card rounded-lg border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{userData.username}</h1>
              <p className="text-muted-foreground">Member since {userData.joinDate}</p>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
          <p className="text-muted-foreground">{userData.email}</p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">My Blog Posts</h2>
          <div className="grid grid-cols-1 gap-6">
            {userData.blogs.map((blog) => (
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
        </div>
      </div>
    </div>
  );
}