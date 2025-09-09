'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import DashboardLayout from '../../../../component/DashboardLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export default function EditBlogPage() {
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

  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || '';
  const router = useRouter();
  const imageInputRef = useRef(null);

  const [form, setForm] = useState({
    blogTitle: '',
    tags: '',
    image: null,
    date: '',
    time: '',
    category: '',
    blogSlug: '',
    description: '',
    content: '',
  });

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState('');

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/dashboard/blog/getBlogBySlug/${slug}`);
        if (!res.ok) {
          const errorData = await res.json();
          toast.error(errorData.message || 'Failed to fetch blog data');
          return;
        }

        const blogData = await res.json();

        let date = '', time = '';
        if (blogData.blog_date_time) {
          const dateTime = new Date(blogData.blog_date_time);
          date = dateTime.toISOString().split('T')[0];
          time = dateTime.toTimeString().split(' ')[0].substring(0, 5);
        }

        setForm({
          blogTitle: blogData.blog_title || '',
          tags: blogData.blog_tag || '',
          image: null,
          date,
          time,
          category: blogData.blog_category_id || '',
          blogSlug: blogData.blog_slug || '',
          description: blogData.blog_description || '',
          content: blogData.blog_content || '',
        });
        setExistingImageUrl(blogData.blog_feature_image || '');
      } catch {
        toast.error('An error occurred while fetching blog data.');
      }
    };

    fetchBlog();
  }, [slug]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/dashboard/blog_category');
        const data = await res.json();
        if (res.ok) setCategories(data);
        else toast.error(data.message || 'Failed to fetch categories');
      } catch {
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const image = e.target.files?.[0];
    if (!image) {
      setForm(prev => ({ ...prev, image: null }));
      if (imageInputRef.current) imageInputRef.current.value = '';
      setExistingImageUrl('');
      return;
    }

    const ext = image.name.split('.').pop()?.toLowerCase();
    const allowedFormats = ['jpeg', 'jpg', 'png', 'webp'];

    if (!ext || !allowedFormats.includes(ext)) {
      setErrorMessage('Invalid image format. Allowed: JPEG, JPG, PNG, WEBP.');
      imageInputRef.current.value = '';
      setForm(prev => ({ ...prev, image: null }));
      setExistingImageUrl('');
      return;
    }

    if (image.size > 500 * 1024) {
      setErrorMessage('Image exceeds 500KB limit.');
      imageInputRef.current.value = '';
      setForm(prev => ({ ...prev, image: null }));
      setExistingImageUrl('');
      return;
    }

    setErrorMessage('');
    setForm(prev => ({ ...prev, image }));
    setExistingImageUrl(URL.createObjectURL(image));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrorMessage('');

  const { blogTitle, tags, category, description, date, time, content } = form;

  if (!blogTitle || !tags || !category || !description || !date || !time || !content) {
    setErrorMessage('Please fill in all required fields.');
    setIsSubmitting(false);
    return;
  }

  const formData = new FormData();
  formData.append('blogId', slug);
  formData.append('blogTitle', blogTitle);
  formData.append('blogTag', tags);
  formData.append('blogCategory', category);
  formData.append('blogDescription', description);
  formData.append('blogContent', content);
  formData.append('blogDate', date);
  formData.append('blogTime', time);

  const finalSlug = form.blogSlug.trim() === ''
    ? blogTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
    : form.blogSlug;

  formData.append('blog_slug', finalSlug);

  if (form.image) {
    formData.append('blog_feature_image', form.image);
  } else if (existingImageUrl) {
    formData.append('existing_image_url', existingImageUrl);
  }

  try {
    const res = await fetch(`/api/dashboard/blog/updateBlogBySlug/${slug}?slug=${slug}`, {
      method: 'PUT',
      body: formData,
    });

    if (!res.ok) {
      const result = await res.json();
      toast.error(result.message || 'Update failed');
      setIsSubmitting(false);
      return;
    }

    toast.success('Blog updated successfully');

    // Instead of window.location.reload(), do one of these:
    
    // Option 1: Redirect user to updated blog list or detail page
    router.push('/dashboard/blog-table'); // Or wherever you want to redirect

    // Option 2: Update local state to reflect changes without reload
    // This depends on your component structure and state management.

  } catch (error) {
    console.error('Update error:', error);
    toast.error('An unexpected error occurred during update.');
    setIsSubmitting(false);
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 text-black">
        <div className="rounded border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-5 px-6 dark:border-strokedark">
            <h3 className="text-lg font-semibold text-black dark:text-white">Edit Blog</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-black dark:text-white">Blog Title</label>
                  <input
                    type="text"
                    placeholder="Enter Title"
                    value={form.blogTitle}
                    onChange={(e) => setForm({ ...form, blogTitle: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">Tags</label>
                  <input
                    type="text"
                    placeholder="Enter Tags"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-black dark:text-white">Manual Slug (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter Slug"
                  value={form.blogSlug}
                  onChange={(e) => setForm({ ...form, blogSlug: e.target.value })}
                  className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                />
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  If left blank, slug will be auto-generated from title.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-black dark:text-white">Feature Image</label>
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                  {existingImageUrl && (
                    <img src={existingImageUrl} alt="Preview" className="mt-4 w-40 h-auto rounded" />
                  )}
                  {errorMessage && <p className="text-sm text-red-500 mt-2">{errorMessage}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
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
                    <label className="mb-2 block text-black dark:text-white">Time</label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-black dark:text-white">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  >
                    <option value="">Choose Category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-black dark:text-white">Content</label>
                <JoditEditor
                  config={editorConfig}
                  value={form.content}
                  onChange={(value) => setForm({ ...form, content: value })}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  className="rounded border border-stroke py-2 px-6 text-black hover:bg-gray-100 dark:border-strokedark dark:text-white"
                  onClick={() => router.push('/dashboard/blog-table')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded bg-black py-2 px-6 text-white hover:bg-opacity-90 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </DashboardLayout>
  );
}
