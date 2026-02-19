import { Link } from 'react-router-dom';
import { LandingBackground, LandingHero, LandingIcon, LandingFooter } from '../components/landing';
import { APK_BRAND } from '../theme/brand';

export default function Landing() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden pb-32">
      <header className="relative z-20 flex items-center justify-between gap-4 px-6 py-4 md:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2 no-underline">
          <img src={APK_BRAND.logoUrl} alt="APK" className="h-8 shrink-0" />
          <span className="text-sm font-semibold text-slate-700">امن پردازان کویر</span>
        </Link>
        <Link
          to="/login"
          className="shrink-0 rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 no-underline transition-colors hover:border-[#ED1E23] hover:text-[#ED1E23]"
        >
          ورود
        </Link>
      </header>
      <LandingBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-16 md:px-8 md:py-24">
        <div className="grid w-full grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-24">
          <LandingHero />
          <LandingIcon />
        </div>
      </div>
      <LandingFooter />
    </div>
  );
}
