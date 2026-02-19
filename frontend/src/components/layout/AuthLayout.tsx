import { Link } from 'react-router-dom';
import { APK_BRAND } from '../../theme/brand';
import { TEXT, BORDER, BG } from '../../theme';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={`relative flex min-h-screen flex-col items-center justify-center ${BG.auth} py-12`}>
      <Link
        to="/"
        className={`absolute end-6 top-6 text-sm ${TEXT.subtle} no-underline transition-colors hover:text-primary`}
      >
        ← بازگشت به صفحه اصلی
      </Link>
      <div className={`w-full max-w-md rounded-2xl border ${BORDER.light} ${BG.surface} p-10 shadow-lg`}>
        <Link to="/" className="mb-6 flex justify-center">
          <img src={APK_BRAND.logoUrl} alt="APK" className="h-10" />
        </Link>
        {children}
      </div>
    </div>
  );
}
