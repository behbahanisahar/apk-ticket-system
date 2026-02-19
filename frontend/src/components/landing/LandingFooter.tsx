import { TEXT } from '../../theme';

export function LandingFooter() {
  return (
    <footer className="absolute bottom-8 left-0 right-0 text-center">
      <p className={`text-sm font-medium ${TEXT.subtle}`}>امن پردازان کویر</p>
      <p className={`mt-1 text-xs ${TEXT.placeholder}`}>سیستم مدیریت تیکت و پشتیبانی</p>
    </footer>
  );
}
