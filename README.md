<div dir="rtl">

# APK Ticket System

سیستم مدیریت تیکت سازمانی - تسک FullStack APK (امن پردازان کویر)

---

<h2 dir="rtl">فهرست مطالب</h2>

- [معماری و تصمیمات فنی](#معماری-و-تصمیمات-فنی)
- [چرا این تکنولوژی‌ها؟](#چرا-این-تکنولوژیها)
- [ساختار پروژه](#ساختار-پروژه)
- [راه‌اندازی با Docker](#راه‌اندازی-با-docker)
- [راه‌اندازی محلی (Development)](#راه‌اندازی-محلی-development)
- [متغیرهای محیطی](#متغیرهای-محیطی)
- [مستندات API](#مستندات-api)
- [مجوزها و قوانین دسترسی](#مجوزها-و-قوانین-دسترسی)
- [اجرای تست‌ها](#اجرای-تستها)
- [توضیحات اضافی](#توضیحات-اضافی)

---

<h2 dir="rtl">معماری و تصمیمات فنی</h2>

### Frontend (React)

| بخش | پیاده‌سازی | دلیل انتخاب |
|-----|-----------|-------------|
| **State Management** | TanStack Query (React Query) | مدیریت server-state با caching خودکار، refetch، و invalidation. از Redux استفاده نشد چون state سمت سرور است نه کلاینت |
| **Routing** | React Router v6 + Lazy Loading | Code-splitting برای بهبود First Load و کاهش bundle size |
| **UI Components** | shadcn/ui + Radix Primitives | کامپوننت‌های accessible و قابل سفارشی‌سازی بدون lock-in به design system خاص |
| **Styling** | Tailwind CSS + CVA | Type-safe variants، utility-first برای سرعت توسعه و consistency |
| **Form Validation** | Custom `useFormValidation` hook | سبک و قابل استفاده مجدد؛ نیازی به Formik/Yup نبود |
| **Error Handling** | Centralized `apiError.ts` + Sonner toast | UX یکپارچه برای نمایش خطاها |
| **Real-time Updates** | `refetchInterval: 5000ms` | Polling ساده و قابل اتکا؛ WebSocket برای این پروژه overkill بود |
| **RTL Support** | Vazirmatn font + RTL-aware CSS | پشتیبانی کامل از فارسی |
| **Testing** | Vitest + React Testing Library | سریع‌تر از Jest، سازگار با Vite |
| **Theme System** | Design tokens در `theme/` | maintainability و consistency در کل اپلیکیشن |

### Backend (Django + DRF)

| بخش | پیاده‌سازی | دلیل انتخاب |
|-----|-----------|-------------|
| **Authentication** | SimpleJWT | توکن‌های stateless، refresh token برای تجربه کاربری بهتر |
| **Filtering** | django-filters | فیلترینگ declarative و type-safe |
| **Pagination** | LimitOffsetPagination | انعطاف‌پذیری بیشتر برای frontend |
| **API Documentation** | drf-spectacular (OpenAPI 3) | مستندات خودکار و قابل تعامل |
| **Permissions** | Custom permission classes | کنترل دقیق دسترسی بر اساس نقش و مالکیت |

### DevOps

| بخش | پیاده‌سازی | دلیل انتخاب |
|-----|-----------|-------------|
| **Containerization** | Docker + Docker Compose | محیط یکسان برای development و production |
| **Reverse Proxy** | nginx | Load balancing، static file serving، SSL termination |
| **Database** | PostgreSQL | ACID compliance، performance، Django integration عالی |
| **Web Server** | Gunicorn | Production-ready WSGI server |

---

<h2 dir="rtl">چرا این تکنولوژی‌ها؟</h2>

### React 18 به جای React 19

React 19 هنوز در مرحله RC (Release Candidate) است و برای پروژه production توصیه نمی‌شود. React 18 با:

- Concurrent rendering پایدار
- Automatic batching
- Suspense بهبودیافته
- Transitions API

تمام نیازهای این پروژه را پوشش می‌دهد. مهاجرت به نسخه‌های جدیدتر وقتی stable شوند، با توجه به معماری فعلی ساده خواهد بود.

### shadcn/ui به جای MUI (Material-UI)

| معیار | shadcn/ui | MUI |
|-------|-----------|-----|
| **Bundle Size** | فقط کامپوننت‌های استفاده‌شده | کل کتابخانه (حتی با tree-shaking سنگین) |
| **Customization** | کد در پروژه، کاملاً قابل ویرایش | Override کردن theme پیچیده |
| **Styling** | Tailwind (utility-first) | CSS-in-JS (runtime overhead) |
| **Accessibility** | Radix primitives (WCAG 2.1) | خوب اما گاهی نیاز به تنظیم |
| **Design Consistency** | آزادی کامل | محدود به Material Design |
| **Learning Curve** | کم (فقط Tailwind) | بالا (سیستم پیچیده theming) |

**دلیل اصلی:** این پروژه یک اپلیکیشن RTL فارسی است. shadcn/ui با Tailwind امکان کنترل کامل روی RTL styling را می‌دهد بدون درگیری با تنظیمات پیچیده MUI برای RTL. همچنین سرعت توسعه با utility classes بسیار بالاتر است.

### Vitest به جای Jest

| معیار | Vitest | Jest |
|-------|--------|------|
| **سرعت** | بسیار سریع (Vite-native) | کندتر (نیاز به transform) |
| **Config** | تقریباً صفر (از vite.config استفاده می‌کند) | نیاز به jest.config جداگانه |
| **ESM Support** | بومی | نیاز به تنظیمات اضافی |
| **HMR** | پشتیبانی | ندارد |
| **سازگاری** | API مشابه Jest | - |

از آنجا که پروژه با Vite ساخته شده، Vitest انتخاب طبیعی است. API آن تقریباً یکسان با Jest است پس migration آسان خواهد بود.

### React Testing Library به جای Enzyme

Enzyme دیگر actively maintain نمی‌شود و برای React 18 پشتیبانی رسمی ندارد. React Testing Library:

- فلسفه "test as user" — تست‌ها رفتار واقعی کاربر را شبیه‌سازی می‌کنند
- توسط تیم React توصیه می‌شود
- Integration بهتر با accessibility testing

### چرا Cypress (E2E Testing) اضافه نشد؟

| معیار | توضیح |
|-------|-------|
| **Scope پروژه** | این یک تسک ۲ روزه است. E2E testing برای پروژه‌های بزرگ‌تر با user flows پیچیده ارزشمند است |
| **پوشش فعلی** | Vitest + RTL پوشش کافی برای unit و integration tests فراهم می‌کند |
| **زمان Setup** | Cypress نیاز به configuration، fixtures، و نگهداری مداوم دارد |
| **ROI** | برای این scope، زمان صرف‌شده برای E2E بهتر است صرف feature development شود |

**توصیه برای آینده:** اگر پروژه رشد کند و user flows پیچیده‌تر شوند (مثلاً payment، multi-step wizards)، اضافه کردن Cypress یا Playwright منطقی است.

### TanStack Query به جای Redux/Context برای Data Fetching

در این پروژه، اکثر state از سرور می‌آید (تیکت‌ها، پاسخ‌ها، اطلاعات کاربر). TanStack Query:

- Caching خودکار با invalidation هوشمند
- Loading/Error states بدون boilerplate
- Background refetching
- Optimistic updates
- DevTools عالی

Redux برای client-state پیچیده مناسب است، نه server-state. استفاده از آن در این پروژه باعث over-engineering می‌شد.

### Custom Hooks به جای Formik/React Hook Form

فرم‌های این پروژه ساده هستند (Login, Register, CreateTicket). یک `useFormValidation` hook سفارشی:

- سبک‌تر (صفر dependency)
- قابل فهم‌تر
- قابل گسترش برای نیازهای خاص

برای فرم‌های پیچیده‌تر (wizard، dynamic fields)، React Hook Form گزینه بهتری می‌بود.

### Polling به جای WebSocket

برای real-time updates، دو گزینه وجود داشت:

| معیار | Polling (5s) | WebSocket |
|-------|--------------|-----------|
| **پیچیدگی Backend** | صفر | نیاز به Django Channels |
| **پیچیدگی Frontend** | یک خط (`refetchInterval`) | مدیریت connection، reconnect |
| **مصرف منابع** | کمی بیشتر | کمتر |
| **Reliability** | بالا | نیاز به error handling |

برای یک سیستم تیکتینگ که updates هر چند ثانیه کافی است، WebSocket complexity اضافی می‌آورد بدون مزیت محسوس برای کاربر.

---

<h2 dir="rtl">ساختار پروژه</h2>

<div dir="ltr">

```
ticket-system/
├── backend/                    # Django + DRF
│   ├── config/                 # تنظیمات Django
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── tickets/                # اپلیکیشن اصلی
│   │   ├── models.py           # Ticket, TicketResponse, TicketImage
│   │   ├── views.py            # ViewSets
│   │   ├── serializers.py      # DRF Serializers
│   │   ├── permissions.py      # Custom permissions
│   │   ├── filters.py          # django-filters
│   │   ├── urls/               # URL routing
│   │   └── tests/              # pytest tests
│   ├── Dockerfile
│   ├── requirements.txt
│   └── entrypoint.sh
│
├── frontend/                   # React + TypeScript
│   ├── src/
│   │   ├── api/                # API client و توابع fetch
│   │   │   ├── client.ts       # Axios instance با interceptors
│   │   │   └── tickets.ts      # Ticket API functions
│   │   ├── components/         # کامپوننت‌های قابل استفاده مجدد (Co-located)
│   │   │   ├── ui/             # کامپوننت‌های پایه
│   │   │   │   ├── Button/
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── Button.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Input/
│   │   │   │   ├── Select/
│   │   │   │   └── Card/
│   │   │   ├── tickets/        # کامپوننت‌های تیکت
│   │   │   │   ├── TicketCard/
│   │   │   │   ├── TicketTable/
│   │   │   │   ├── TicketFilters/
│   │   │   │   └── Pagination/
│   │   │   ├── ErrorBoundary/  # مدیریت خطا
│   │   │   ├── layout/         # AuthLayout
│   │   │   └── landing/        # Landing page components
│   │   ├── constants/          # Enums و options
│   │   ├── context/            # AuthContext (React Context)
│   │   ├── hooks/              # Custom hooks
│   │   │   ├── useTickets.ts   # React Query hooks
│   │   │   ├── useFormValidation.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── usePagination.ts
│   │   ├── lib/                # Utilities (flat structure)
│   │   │   ├── apiError.ts     # Error handling
│   │   │   ├── dateUtils.ts    # Persian date formatting
│   │   │   └── toast.ts        # Toast wrapper
│   │   ├── pages/              # Route components (flat structure)
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── TicketList.tsx
│   │   │   ├── TicketDetail.tsx
│   │   │   ├── CreateTicket.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── theme/              # Design tokens
│   │   │   ├── colors.ts
│   │   │   ├── classes.ts
│   │   │   └── brand.ts
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Router و providers
│   │   └── main.tsx            # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── nginx/
│   └── nginx.conf              # Reverse proxy config
│
├── docker-compose.yml
└── README.md
```

</div>

### تصمیمات ساختار پوشه‌ها

| پوشه | ساختار | دلیل |
|------|--------|------|
| **components/** | Co-located folders | هر کامپوننت در پوشه جداگانه با تست و index.ts. مزایا: encapsulation بهتر، import ساده‌تر، مقیاس‌پذیری |
| **pages/** | Flat (فایل‌های مستقل) | صفحات standalone هستند و معمولاً sub-component ندارند. استاندارد صنعت برای route components |
| **lib/** | Flat (فایل‌های مستقل) | utility functions ساده که نیاز به پوشه جداگانه ندارند. استاندارد صنعت برای helper modules |
| **hooks/** | Flat | مشابه lib، hooks ساده و مستقل هستند |

**چرا Co-located برای components؟**

- تست کنار کامپوننت: آسان‌تر برای نگهداری و refactoring
- Barrel exports با `index.ts`: import paths تمیز و ساده
- Scalability: اضافه کردن styles، types، یا sub-components در آینده آسان‌تر است

---

<h2 dir="rtl">راه‌اندازی با Docker</h2>

### پیش‌نیازها

- Docker 20.10+
- Docker Compose 2.0+

### اجرا

<div dir="ltr">

```bash
# Clone the repository
git clone <repository-url>
cd ticket-system

# Start all services
docker compose up --build

# Or run in detached mode
docker compose up -d --build
```

</div>

### دسترسی

| سرویس | آدرس |
|-------|------|
| Frontend | http://localhost |
| Backend API | http://localhost/api |
| Swagger UI | http://localhost/api/docs/ |
| ReDoc | http://localhost/api/redoc/ |
| Django Admin | http://localhost/api/admin/ |
| Media Files | http://localhost/media/ |

### مدیریت فایل‌های آپلود شده

در Docker، فایل‌های آپلود شده (تصاویر تیکت) به صورت زیر مدیریت می‌شوند:

- **Volume:** `media_data` برای persist کردن فایل‌ها بین container restarts
- **Nginx:** فایل‌های `/media/` مستقیماً توسط nginx serve می‌شوند (نه Django)
- **Path:** تصاویر در `/app/media/tickets/YYYY/MM/` ذخیره می‌شوند

### ایجاد کاربر ادمین

<div dir="ltr">

```bash
docker compose exec backend python manage.py createsuperuser
```

</div>

### توقف سرویس‌ها

<div dir="ltr">

```bash
docker compose down

# با حذف volumes (دیتابیس)
docker compose down -v
```

</div>

---

<h2 dir="rtl">راه‌اندازی محلی (Development)</h2>

### Backend

<div dir="ltr">

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env as needed

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

</div>

### Frontend

<div dir="ltr">

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000/api

# Run development server
npm run dev
```

</div>

---

<h2 dir="rtl">متغیرهای محیطی</h2>

### Backend (`backend/.env`)

| متغیر | توضیحات | مقدار پیش‌فرض |
|-------|---------|---------------|
| `DJANGO_SECRET_KEY` | کلید امنیتی Django (الزامی در production) | `dev-secret-change-in-prod` |
| `DEBUG` | حالت debug | `true` |
| `ALLOWED_HOSTS` | هاست‌های مجاز (comma-separated) | `localhost,127.0.0.1` |
| `POSTGRES_DB` | نام دیتابیس | `ticket_db` |
| `POSTGRES_USER` | نام کاربری دیتابیس | `postgres` |
| `POSTGRES_PASSWORD` | رمز عبور دیتابیس | `postgres` |
| `POSTGRES_HOST` | هاست دیتابیس | `localhost` |
| `POSTGRES_PORT` | پورت دیتابیس | `5432` |
| `USE_SQLITE` | استفاده از SQLite به جای Postgres | (خالی = Postgres) |
| `CORS_ORIGINS` | آدرس‌های مجاز CORS | `http://localhost:3000` |
| `DJANGO_LANGUAGE_CODE` | زبان پیش‌فرض | `fa-ir` |

### Frontend (`frontend/.env`)

| متغیر | توضیحات | مقدار پیش‌فرض |
|-------|---------|---------------|
| `VITE_API_URL` | آدرس پایه API | `http://localhost:8000/api` (dev) یا `/api` (docker) |

---

<h2 dir="rtl">مستندات API</h2>

### Swagger / OpenAPI

پس از اجرای پروژه، مستندات تعاملی API در آدرس‌های زیر در دسترس است:

- **Swagger UI**: http://localhost/api/docs/
- **ReDoc**: http://localhost/api/redoc/
- **OpenAPI Schema**: http://localhost/api/schema/

### Endpoints خلاصه

#### Authentication

| Method | Endpoint | توضیحات |
|--------|----------|---------|
| `POST` | `/api/auth/register/` | ثبت‌نام کاربر جدید |
| `POST` | `/api/auth/token/` | دریافت access و refresh token |
| `POST` | `/api/auth/token/refresh/` | تمدید access token |
| `GET` | `/api/auth/me/` | اطلاعات کاربر جاری |

#### Tickets

| Method | Endpoint | توضیحات | دسترسی |
|--------|----------|---------|--------|
| `GET` | `/api/tickets/` | لیست تیکت‌ها | User: فقط خودش / Admin: همه |
| `POST` | `/api/tickets/` | ایجاد تیکت جدید | همه کاربران احراز شده |
| `GET` | `/api/tickets/{id}/` | جزئیات تیکت | مالک یا ادمین |
| `PATCH` | `/api/tickets/{id}/` | ویرایش تیکت | مالک (status=open) یا ادمین |
| `DELETE` | `/api/tickets/{id}/` | حذف تیکت | فقط مالک (status=open) |
| `POST` | `/api/tickets/{id}/respond/` | ارسال پاسخ | مالک یا ادمین |

#### Query Parameters (فیلترینگ)

| پارامتر | توضیحات | مثال |
|---------|---------|------|
| `status` | فیلتر بر اساس وضعیت | `?status=open` |
| `priority` | فیلتر بر اساس اولویت | `?priority=high` |
| `search` | جستجو در عنوان و توضیحات | `?search=مشکل` |
| `ordering` | مرتب‌سازی | `?ordering=-created_at` |
| `limit` | تعداد نتایج | `?limit=10` |
| `offset` | شروع از | `?offset=20` |

### نمونه درخواست/پاسخ

#### ثبت‌نام

<div dir="ltr">

```bash
POST /api/auth/register/
Content-Type: application/json

{
  "username": "ali",
  "password": "securepass123",
  "email": "ali@example.com",
  "first_name": "علی",
  "last_name": "محمدی"
}
```

</div>

**پاسخ (201):**

<div dir="ltr">

```json
{
  "id": 1,
  "username": "ali",
  "email": "ali@example.com",
  "first_name": "علی",
  "last_name": "محمدی",
  "is_staff": false
}
```

</div>

#### ورود و دریافت توکن

<div dir="ltr">

```bash
POST /api/auth/token/
Content-Type: application/json

{
  "username": "ali",
  "password": "securepass123"
}
```

</div>

**پاسخ (200):**

<div dir="ltr">

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

</div>

#### ایجاد تیکت

<div dir="ltr">

```bash
POST /api/tickets/
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

title: مشکل در ورود
description: نمی‌توانم با رمز عبور خود وارد شوم
priority: high
images: [file1.jpg, file2.png]  # اختیاری
```

</div>

**پاسخ (201):**

<div dir="ltr">

```json
{
  "id": 1,
  "ticket_number": "TKT-000001",
  "title": "مشکل در ورود",
  "description": "نمی‌توانم با رمز عبور خود وارد شوم",
  "priority": "high",
  "status": "open",
  "user": {
    "id": 1,
    "username": "ali",
    "first_name": "علی",
    "last_name": "محمدی",
    "is_staff": false
  },
  "images": [
    {"id": 1, "image": "/media/tickets/2024/01/file1.jpg"}
  ],
  "responses": [],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

</div>

#### پاسخ به تیکت

<div dir="ltr">

```bash
POST /api/tickets/1/respond/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "message": "سلام، لطفاً ایمیل خود را بررسی کنید."
}
```

</div>

**پاسخ (201):**

<div dir="ltr">

```json
{
  "detail": "پاسخ ثبت شد"
}
```

</div>

---

<h2 dir="rtl">مجوزها و قوانین دسترسی</h2>

### کاربر عادی (User)

| عملیات | مجاز؟ | شرایط |
|--------|-------|-------|
| مشاهده تیکت‌ها | ✅ | فقط تیکت‌های خودش |
| ایجاد تیکت | ✅ | - |
| ویرایش تیکت | ✅ | فقط تیکت خود و وضعیت `open` |
| حذف تیکت | ✅ | فقط تیکت خود و وضعیت `open` |
| ارسال پاسخ | ✅ | فقط به تیکت‌های خود |
| تغییر وضعیت | ❌ | - |

### ادمین (Admin / is_staff)

| عملیات | مجاز؟ | شرایط |
|--------|-------|-------|
| مشاهده تیکت‌ها | ✅ | همه تیکت‌ها |
| ایجاد تیکت | ✅ | - |
| ویرایش تیکت | ✅ | همه تیکت‌ها |
| حذف تیکت | ❌ | فقط مالک می‌تواند حذف کند |
| ارسال پاسخ | ✅ | به همه تیکت‌ها |
| تغییر وضعیت | ✅ | open ↔ in_progress ↔ closed |

### توضیح تصمیم طراحی

> **نکته**: طبق تسک، کاربر می‌تواند تیکت را «قبل از اولین پاسخ» ویرایش/حذف کند.
> در پیاده‌سازی، این منطق بر اساس **وضعیت تیکت** (`status=open`) کنترل می‌شود نه تعداد پاسخ‌ها.
> دلیل: وقتی ادمین پاسخ می‌دهد، وضعیت خودکار به `in_progress` تغییر می‌کند — پس نتیجه عملاً یکسان است و پیاده‌سازی ساده‌تر می‌شود.

---

<h2 dir="rtl">اجرای تست‌ها</h2>

### Backend (pytest)

<div dir="ltr">

```bash
cd backend

# Activate virtual environment first
source .venv/bin/activate  # macOS/Linux
# or: .venv\Scripts\activate  # Windows

# Run all tests
pytest

# With coverage
pytest --cov=tickets

# Verbose output
pytest -v
```

</div>

**تست‌های موجود:**

- ایجاد تیکت و بررسی مالکیت
- پاسخ به تیکت (User/Admin/Other)
- تغییر وضعیت توسط User (باید رد شود) و Admin (باید موفق شود)
- دسترسی به لیست تیکت‌ها (User فقط خودش / Admin همه)
- حذف تیکت (فقط مالک با status=open)
- آپلود تصویر (تک/چند/محدودیت تعداد)

### Frontend (Vitest)

<div dir="ltr">

```bash
cd frontend

# Run all tests
npm run test

# Watch mode
npm run test:watch
```

</div>

**تست‌های موجود:**

- کامپوننت‌های UI (Button, Input)
- کامپوننت‌های تیکت (TicketCard, TicketTable, Filters)
- صفحات (Login, Register, CreateTicket, TicketDetail)
- Hooks (useFormValidation)
- Utilities (apiError, dateUtils)

---

<h2 dir="rtl">توضیحات اضافی</h2>

### فیلدهای اضافه شده

| فیلد | مدل | دلیل |
|------|-----|------|
| `ticket_number` | Ticket | شماره یکتا و قابل کپی برای ارجاع آسان (فرمت: TKT-000001) |
| `TicketImage` | Model جدید | امکان آپلود تصویر برای توضیح بهتر مشکل |

### محدودیت‌های آپلود تصویر

| محدودیت | مقدار |
|---------|-------|
| حداکثر تعداد تصاویر | 5 |
| حداکثر حجم هر تصویر | 2MB |
| حداکثر حجم کل | 8MB |
| فرمت‌های مجاز | JPEG, PNG, GIF, WebP |

### بروزرسانی خودکار (Auto-refresh)

لیست تیکت‌ها هر **5 ثانیه** بروزرسانی می‌شود (بدون نیاز به refresh صفحه):

- تیکت جدید اضافه شود → نمایش داده می‌شود
- وضعیت تیکت تغییر کند → بروز می‌شود
- تیکت حذف شود → از لیست حذف می‌شود

### امنیت

- توکن‌های JWT با lifetime محدود (access: 1 ساعت، refresh: 7 روز)
- CORS محدود به origin‌های مشخص
- Password validation فعال
- CSRF protection
- تمام endpoint‌ها (به جز auth) نیاز به authentication دارند

---

<h2 dir="rtl">یادداشت پایانی</h2>

تخصص اصلی من **Frontend Development** است. این تسک فرصتی بود برای یادگیری عمیق‌تر Django و DRF.

در طول انجام این پروژه:
- مستندات رسمی Django و DRF را مطالعه کردم
- از best practices موجود در GitHub و Stack Overflow استفاده کردم ( با توجه به زمان)
- از ابزارهای AI برای درک بهتر مفاهیم و debugging کمک گرفتم


</div>
