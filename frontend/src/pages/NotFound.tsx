import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { Home, ArrowRight } from 'lucide-react';
import { BG, TEXT, BORDER } from '../theme';

export default function NotFound() {
  return (
    <div className={`flex min-h-screen items-center justify-center ${BG.page} p-4`}>
      <div className={`w-full max-w-md rounded-2xl border ${BORDER.default} ${BG.surface} p-8 text-center shadow-xl`}>
        <div className={`mb-6 text-8xl font-bold ${TEXT.muted}`}>۴۰۴</div>
        
        <h1 className={`mb-2 text-xl font-bold ${TEXT.heading}`}>
          صفحه مورد نظر یافت نشد
        </h1>
        
        <p className={`mb-8 ${TEXT.muted}`}>
          صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="outline">
            <Link to="/tickets">
              <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              لیست تیکت‌ها
            </Link>
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
              صفحه اصلی
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
