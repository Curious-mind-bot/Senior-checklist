import { Coffee, Heart } from 'lucide-react';
import { Button } from './ui/button';

export function SupportFooter() {
  const handleSupportClick = () => {
    // Replace this URL with your actual Buy Me a Coffee / Ko-fi / PayPal link
    window.open('https://www.buymeacoffee.com/yourlink', '_blank');
  };

  return (
    <div className="mt-8 mb-4">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Coffee className="w-6 h-6 text-amber-600" />
          <Heart className="w-5 h-5 text-red-500" />
        </div>
        <p className="text-lg text-gray-700 mb-4">
          Enjoying this app? Support us with a small donation!
        </p>
        <Button
          onClick={handleSupportClick}
          className="h-14 px-8 text-lg bg-amber-500 hover:bg-amber-600"
        >
          <Coffee className="w-5 h-5 mr-2" />
          Buy Me a Coffee ☕
        </Button>
        <p className="text-sm text-gray-500 mt-3">
          Your support helps keep this app free and ad-free
        </p>
      </div>
    </div>
  );
}
