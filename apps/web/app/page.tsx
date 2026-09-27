import { Button } from '@everafter/ui';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          EverAfter
        </h1>
        <p className="mt-3 text-lg text-muted">
          Plan your wedding. Share your story. Celebrate forever.
        </p>
      </div>
      <div className="flex gap-4">
        <Button variant="primary" size="lg">
          Get Started
        </Button>
        <Button variant="outline" size="lg">
          Learn More
        </Button>
      </div>
    </main>
  );
}
