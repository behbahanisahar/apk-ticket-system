import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, X } from 'lucide-react';
import { Button, Input, Select, BackLink } from '../components/ui';
import { useCreateTicket } from '../hooks/useTickets';
import { useFormValidation } from '../hooks/useFormValidation';
import { PRIORITY_OPTIONS, TicketPriority } from '../constants/tickets';
import { TEXT, FEEDBACK, BORDER, BG } from '../theme';
import { toast } from '../lib/toast';

type CreateTicketErrors = { title?: string; description?: string };

const MAX_IMAGE_SIZE_MB = 2;
const MAX_IMAGE_COUNT = 5;
const MAX_TOTAL_SIZE_MB = 8;
const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_TOTAL_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;
const ACCEPT_IMAGE = 'image/jpeg,image/png,image/gif,image/webp';

function validateImages(
  newFiles: File[],
  existingFiles: File[]
): { valid: File[]; error: string | null } {
  const valid: File[] = [];
  for (const f of newFiles) {
    if (f.size > MAX_IMAGE_BYTES) {
      return { valid: [], error: `حداکثر حجم هر تصویر ${MAX_IMAGE_SIZE_MB} مگابایت است` };
    }
    valid.push(f);
  }
  const combined = [...existingFiles, ...valid];
  if (combined.length > MAX_IMAGE_COUNT) {
    return { valid: [], error: `حداکثر ${MAX_IMAGE_COUNT} تصویر` };
  }
  const totalSize = combined.reduce((s, f) => s + f.size, 0);
  if (totalSize > MAX_TOTAL_BYTES) {
    return { valid: [], error: `مجموع تصاویر حداکثر ${MAX_TOTAL_SIZE_MB} مگابایت` };
  }
  return { valid, error: null };
}

export default function CreateTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(TicketPriority.Medium);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { errors, validateAndSet, clearField } = useFormValidation<CreateTicketErrors>({});
  const navigate = useNavigate();
  const createMutation = useCreateTicket();

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleFilesChange = useCallback(
    (files: File[]) => {
      setImageError('');
      const { valid, error } = validateImages(files, imageFiles);
      if (error) {
        setImageError(error);
        return;
      }
      if (valid.length > 0) {
        setImageFiles((prev) => [...prev, ...valid]);
        setImagePreviews((prev) => [...prev, ...valid.map((f) => URL.createObjectURL(f))]);
      }
    },
    [imageFiles]
  );

  const removeImage = useCallback((index: number) => {
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, j) => j !== index);
    });
    setImageFiles((prev) => prev.filter((_, j) => j !== index));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateAndSet(() => {
      const err: CreateTicketErrors = {};
      if (!title.trim()) err.title = 'عنوان الزامی است';
      else if (title.trim().length < 3) err.title = 'عنوان حداقل ۳ کاراکتر باشد';
      if (!description.trim()) err.description = 'توضیحات الزامی است';
      else if (description.trim().length < 10) err.description = 'توضیحات حداقل ۱۰ کاراکتر باشد';
      return err;
    });
    if (!isValid) return;
    const { error } = validateImages([], imageFiles);
    if (error) {
      setImageError(error);
      return;
    }
    try {
      await createMutation.mutateAsync({ title, description, priority, images: imageFiles });
      navigate('/tickets');
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className={`min-h-screen ${BG.page}`}>
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="mb-6 flex justify-end">
          <BackLink to="/tickets" />
        </div>
        <div className={`rounded-2xl border ${BORDER.default} ${BG.surface} p-8 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/40`}>
          <h2 className={`mb-2 text-2xl font-bold tracking-tight ${TEXT.heading}`}>تیکت جدید</h2>
          <p className={`mb-8 ${TEXT.muted}`}>درخواست خود را با جزئیات ثبت کنید</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Input
                label="عنوان"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTitle(e.target.value);
                  clearField('title');
                }}
              />
              {errors.title && <p className={`mt-1 text-sm ${FEEDBACK.error}`}>{errors.title}</p>}
            </div>
            <div className="mb-6">
              <Input
                label="توضیحات"
                multiline
                rows={4}
                value={description}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  setDescription(e.target.value);
                  clearField('description');
                }}
              />
              {errors.description && <p className={`mt-1 text-sm ${FEEDBACK.error}`}>{errors.description}</p>}
            </div>
            <div className="mb-6">
              <Select
                label="اولویت"
                options={PRIORITY_OPTIONS}
                value={priority}
                onChange={(e: { target: { value: string } }) => setPriority(e.target.value as TicketPriority)}
              />
            </div>
            <div className="mb-6">
              <label className={`mb-2 block text-sm font-medium ${TEXT.label}`}>
                آپلود تصاویر (اختیاری — حداکثر {MAX_IMAGE_COUNT} تصویر، هر کدام {MAX_IMAGE_SIZE_MB} مگابایت)
              </label>
              <div className="flex flex-col gap-3">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT_IMAGE}
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleFilesChange(Array.from(e.target.files ?? []));
                      e.target.value = '';
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="me-2 h-4 w-4" />
                    انتخاب تصاویر
                  </Button>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {imagePreviews.map((url, i) => (
                      <div key={i} className="relative h-24 w-24 shrink-0">
                        <img
                          src={url}
                          alt={`پیش‌نمایش ${i + 1}`}
                          className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-1.5 -start-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                          aria-label="حذف تصویر"
                        >
                          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {imageError && <p className={`mt-1 text-sm ${FEEDBACK.error}`}>{imageError}</p>}
            </div>
            <Button type="submit" size="lg" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'در حال ایجاد...' : 'ایجاد تیکت'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
