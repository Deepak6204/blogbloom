import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Flag } from "lucide-react";

interface BlogCardProps {
  id: number;
  title: string;
  author: string;
  content: string;
  likes_count: number;
  dislikes_count: number;
  created_at: string;
}

export function BlogCard({ title, author, content, likes_count, dislikes_count, created_at }: BlogCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">By {author} • {new Date(created_at).toLocaleDateString()}</p>
          </div>
          <Button variant="ghost" size="icon">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="flex gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{likes_count}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-1">
            <ThumbsDown className="h-4 w-4" />
            <span>{dislikes_count}</span>
          </Button>
        </div>
        <Button variant="outline">Read More</Button>
      </CardFooter>
    </Card>
  );
}