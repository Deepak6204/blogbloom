import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Flag } from "lucide-react";

interface BlogCardProps {
  title: string;
  author: string;
  content: string;
  likes: number;
  dislikes: number;
  date: string;
}

export function BlogCard({ title, author, content, likes, dislikes, date }: BlogCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">By {author} • {date}</p>
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
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-1">
            <ThumbsDown className="h-4 w-4" />
            <span>{dislikes}</span>
          </Button>
        </div>
        <Button variant="outline">Read More</Button>
      </CardFooter>
    </Card>
  );
}