import { Link } from 'react-router-dom';
import { TEXT, BORDER, BG } from '../../theme';

const features = ['ثبت تیکت', 'پیگیری وضعیت', 'پاسخ‌دهی سریع'];

export function LandingHero() {
  return (
    <div className="order-2 animate-fade-in text-center md:order-1 md:text-right">
      <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
        APK
      </span>
      <h1 className={`mb-5 text-4xl font-extrabold leading-[1.2] tracking-tight ${TEXT.heading} sm:text-5xl md:text-6xl`}>
        سیستم مدیریت
        <span className="block text-primary">
          تیکت
        </span>
      </h1>
      <p className={`mb-8 max-w-lg text-lg leading-relaxed ${TEXT.muted} md:me-0 md:ms-auto`}>
        تیکت‌های پشتیبانی را ثبت و پیگیری کنید. پشتیبانی سریع و کارآمد.
      </p>
      <div className="mb-10 flex flex-wrap justify-center gap-2 md:justify-end">
        {features.map((f) => (
          <span
            key={f}
            className={`rounded-full ${BG.pill} px-4 py-2 text-sm font-medium ${TEXT.muted} ring-1 ring-slate-200/60`}
          >
            {f}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3 md:justify-end">
        <Link
          to="/login"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
        >
          ورود
        </Link>
        <Link
          to="/register"
          className={`inline-flex h-12 items-center justify-center rounded-xl border-2 ${BORDER.medium} ${BG.surface} px-8 text-base font-semibold ${TEXT.label} no-underline transition-colors hover:border-primary hover:text-primary`}
        >
          ثبت‌نام
        </Link>
      </div>
    </div>
  );
}
