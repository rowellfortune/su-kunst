// src/pages/NotFoundPage.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10">
      {/* Error code */}
      <p className="text-xl font-medium text-primary mb-2">404 Error</p>

      {/* Main headline */}
      <h1 className="text-5xl sm:text-8xl font-extrabold text-foreground text-center mb-4">
        Oops! We Can’t Find That Page.
      </h1>

      {/* Sub‑headline */}
      <p className="text-center text-muted-foreground mb-8 max-w-md">
        Unfortunately, the page you’re looking for is gone or has been moved :(.
      </p>

      {/* Actions */}
      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => nav(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Button onClick={() => nav("/")}>
          <Home className="mr-2 h-4 w-4" />
          Take Me Home
        </Button>
      </div>
    </div>
  );
}
