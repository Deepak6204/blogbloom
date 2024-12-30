import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LogIn, UserPlus, User, PenSquare } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            BlogBloom
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/create">
              <Button variant="ghost" className="gap-2">
                <PenSquare className="h-4 w-4" />
                Write
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="ghost" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}