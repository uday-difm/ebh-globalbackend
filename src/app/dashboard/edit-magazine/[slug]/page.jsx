'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import DashboardLayout from "../../../../component/DashboardLayout";

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const editorConfig = {
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: 'en',
  toolbarButtonSize: 'middle',
  showCharsCounter: true,
  showWordsCounter: true,
  showXPathInStatusbar: false,
  askBeforePasteHTML: true,
  askBeforePasteFromWord: true,
  uploader: {
    insertImageAsBase64URI: true,
  },
  width: '100%',
  minHeight: 300,
};

export default function EditMagazinePage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || '';
  const router = useRouter();

  const [form, setForm] = useState({
    magazineTitle: '',
    magazineSlug: '',
    tags: '',
    image: null,
    date: '',
    category: '',
    MagCloudLink: '',
    PdfLink: '',
    description: '',
    age_verification_required: false,
    email_verification_required: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  useEffect(() => {
    if (!slug) return;
    const fetchMagazine = async () => {
      try {
        const res = await fetch(`/api/dashboard/magazine/fetchMagzineBySlug/${slug}`);
        const data = await res.json();

        if (res.ok) {
          setForm({
            magazineTitle: data.magazine_title || '',
            magazineSlug: data.magazine_slug || '',
            tags: data.magazine_tags || '',
            image: null,
            date: data.magazine_date?.split('T')[0] || '',
            category: data.magazine_category || '',
            MagCloudLink: data.MagCloudLink || '',
            PdfLink: data.magazine_link || '',
            description: data.magazine_description || '',
            age_verification_required: !!data.age_verification_required,
          });
          setExistingImageUrl(data.magazine_cover_image || '');
        } else {
          alert('Failed to fetch magazine data');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMagazine();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('magazine_id', slug);
    formData.append('magazine_title', form.magazineTitle);
    formData.append('magazine_slug', form.magazineSlug);
    formData.append('magazine_tags', form.tags);
    formData.append('magazine_date', form.date);
    formData.append('magazine_category', form.category);
    formData.append('MagCloudLink', form.MagCloudLink);
    formData.append('magazine_link', form.PdfLink);
    formData.append('magazine_description', form.description);

    if (form.image) {
      formData.append('magazine_cover_image', form.image);
    } else if (existingImageUrl) {
      formData.append('magazine_cover_image', existingImageUrl);
    }

    const res = await fetch(`/api/dashboard/magazine/update-magazine/${slug}?slug=${slug}`, {
      method: 'PUT',
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      alert('Magazine updated successfully');
      router.push('/dashboard/magazine-table');
    } else {
      alert(result.error || 'Update failed');
    }

    setIsSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-5 px-6 dark:border-strokedark">
            <h3 className="text-lg font-semibold text-black dark:text-white">Edit Magazine</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-8 text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-black dark:text-white">Magazine Title</label>
                  <input
                    type="text"
                    value={form.magazineTitle}
                    onChange={(e) => setForm({ ...form, magazineTitle: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">Slug</label>
                  <input
                    type="text"
                    value={form.magazineSlug}
                    onChange={(e) => setForm({ ...form, magazineSlug: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="mb-2 block text-black dark:text-white">Magazine Keywords</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-black dark:text-white">Feature Image</label>
                  {existingImageUrl && (
                    <div className="mt-2">
                      <img src={existingImageUrl} alt="Current Cover" className="max-w-xs rounded" />
                      <input
                        type="text"
                        value={existingImageUrl}
                        onChange={(e) => setExistingImageUrl(e.target.value)}
                        className="mt-2 w-full rounded border border-stroke py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
                        placeholder="Image URL"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-black dark:text-white">MagCloud Link</label>
                  <input
                    type="text"
                    value={form.MagCloudLink}
                    onChange={(e) => setForm({ ...form, MagCloudLink: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">PDF Link</label>
                  <input
                    type="text"
                    value={form.PdfLink}
                    onChange={(e) => setForm({ ...form, PdfLink: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-black dark:text-white">Content</label>
                <JoditEditor
                  config={editorConfig}
                  value={form.description}
                  onChange={(val) => setForm({ ...form, description: val })}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/magazine-table')}
                  className="rounded border border-stroke py-2 px-6 text-black hover:bg-gray-100 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rounded bg-black py-2 px-6 text-white hover:bg-opacity-90 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Updating...' : 'Update Magazine'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
