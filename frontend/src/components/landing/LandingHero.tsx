import { Link } from 'react-router-dom';

const features = ['ثبت تیکت', 'پیگیری وضعیت', 'پاسخ‌دهی سریع'];

export function LandingHero() {
  return (
    <div className="order-2 animate-fade-in text-center md:order-1 md:text-right">
      <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#ED1E23]/10 px-4 py-1.5 text-sm font-semibold text-[#ED1E23]">
        APK
      </span>
      <h1 className="mb-5 text-4xl font-extrabold leading-[1.2] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
        سیستم مدیریت
        <span className="block text-[#ED1E23]">
          تیکت
        </span>
      </h1>
      <p className="mb-8 max-w-lg text-lg leading-relaxed text-slate-600 md:me-0 md:ms-auto">
        تیکت‌های پشتیبانی را ثبت و پیگیری کنید. پشتیبانی سریع و کارآمد.
      </p>
      <div className="mb-10 flex flex-wrap justify-center gap-2 md:justify-end">
        {features.map((f) => (
          <span
            key={f}
            className="rounded-full bg-slate-100/80 px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200/60"
          >
            {f}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3 md:justify-end">
        <Link
          to="/login"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#ED1E23] px-8 text-base font-semibold text-white shadow-md transition-colors hover:bg-[#c4181c]"
        >
          ورود
        </Link>
        <Link
          to="/register"
          className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-8 text-base font-semibold text-slate-700 no-underline transition-colors hover:border-[#ED1E23] hover:text-[#ED1E23]"
        >
          ثبت‌نام
        </Link>
      </div>
    </div>
  );
}
