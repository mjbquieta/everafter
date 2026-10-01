import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@everafter/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAF9F7' }}>
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center mb-6">
          <XCircle className="h-8 w-8 text-stone-400" />
        </div>

        <h1 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3">
          Invitation Not Found
        </h1>

        <p className="text-sm text-stone-600 mb-8 leading-relaxed">
          We couldn't locate this invitation. The link may be incorrect or the invitation may have been removed.
        </p>

        <Link href="/">
          <Button className="bg-stone-900 text-white hover:bg-stone-800">
            Return to Home
          </Button>
        </Link>

        <p className="text-xs text-stone-500 mt-6">
          If you believe this is an error, please contact the couple directly.
        </p>
      </div>
    </div>
  );
}
