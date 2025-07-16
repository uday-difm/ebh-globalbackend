'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/app/components/DashboardLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// We will move EditorConfig and editorConfig inside the component or its direct scope.
// Remove them from here if they are defined globally or outside the component.
// Example:
// interface EditorConfig { /* ... */ }
// const editorConfig: EditorConfig = { /* ... */ };

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

type Form = {
  blogTitle: string;
  tags: string;
  image: File | null;
  date: string;
  time: string;
  category: string;
  blogSlug: string;
  description: string;
  content: string;
};

export default function EditBlogPage() {
  // --- Start: Move EditorConfig and editorConfig definition here ---
  interface EditorConfig {
    readonly: boolean;
    toolbar: boolean;
    spellcheck: boolean;
    language: string;
    toolbarButtonSize: 'small' | 'large' | 'middle' | 'tiny' | 'xsmall' | undefined;
    showCharsCounter: boolean;
    showWordsCounter: boolean;
    showXPathInStatusbar: boolean;
    askBeforePasteHTML: boolean;
    askBeforePasteFromWord: boolean;
    uploader: {
      insertImageAsBase64URI: boolean;
    };
    width: string;
    minHeight: number;
  }

  const editorConfig: EditorConfig = {
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
  // --- End: Move EditorConfig and editorConfig definition here ---


  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || '';
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Form>({
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

  const [categories, setCategories] = useState<{ category_id: string, category_name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState('');

  // Fetch the blog details when the page loads
  useEffect(() => {
    // console.log('EditBlogPage useEffect triggered. Current ID:', id);
    if (!id) {
      console.warn("No ID provided for fetching blog details. Exiting useEffect.");
      return;
    }

    const fetchBlog = async () => {
      // console.log(`Attempting to fetch blog with ID: ${id}`);
      try {
        const res = await fetch(`/api/dashboard/blogs/fetchblogbyid?id=${id}`); // Fixed URL to correct API endpoint
        // console.log('API Response Status:', res.status, res.statusText);

        if (!res.ok) {
          const errorData = await res.json();
          console.error('API Error Response Data:', errorData);
          toast.error(errorData.message || 'Failed to fetch blog data');
          return;
        }

        const rawData = await res.json(); // Renamed to rawData as it might be an array
        // console.log('Fetched Raw Data (from API):', rawData);

        const blogData = Array.isArray(rawData) && rawData.length > 0 ? rawData[0] : null;

        if (!blogData || typeof blogData !== 'object' || Object.keys(blogData).length === 0) {
          console.warn('API returned empty, invalid, or no blog data within the array.');
          toast.error('Fetched blog data is empty or malformed.');
          setForm({ // Optionally reset form if data is bad
            blogTitle: '', tags: '', image: null, date: '', time: '',
            category: '', blogSlug: '', description: '', content: ''
          });
          setExistingImageUrl('');
          return;
        }

        let date = '';
        let time = '';
        if (blogData.blog_date_time) {
          const dateTime = new Date(blogData.blog_date_time);
          if (!isNaN(dateTime.getTime())) {
            date = dateTime.toISOString().split('T')[0];
            time = dateTime.toTimeString().split(' ')[0].substring(0, 5); // Format to HH:MM
            // console.log('Parsed Date:', date, 'Parsed Time:', time);
          } else {
            console.warn('Invalid blog_date_time from API:', blogData.blog_date_time);
          }
        } else {
          console.warn('blog_date_time is missing from API data.');
        }

        setForm({
          blogTitle: blogData.blog_title || '',
          tags: blogData.blog_tag || '',
          image: null,
          date: date,
          time: time,
          category: blogData.blog_category_id || '',
          blogSlug: blogData.blog_slug || '',
          description: blogData.blog_description || '',
          content: blogData.blog_content || '',
        });
        setExistingImageUrl(blogData.blog_feature_image || '');
        // console.log('Form state updated successfully from API data.');

      } catch (err) {
        console.error('Error in fetchBlog:', err);
        toast.error('An error occurred while fetching blog data.');
      }
    };

    fetchBlog();
  }, [id]);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/dashboard/blog_category');
        const data = await res.json();

        if (res.ok) {
          setCategories(data);
        } else {
          toast.error(data.message || 'Failed to fetch categories');
        }
      } catch  {
        // console.error('Error fetching categories:', err);
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  // Handle image upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => { // Use ChangeEvent directly
    const image = e.target.files?.[0];
    if (!image) {
      setForm({ ...form, image: null });
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      setExistingImageUrl('');
      return;
    }

    const ext = image.name.split('.').pop()?.toLowerCase();
    const allowedFormats = ['jpeg', 'jpg', 'png', 'webp'];

    if (!ext || !allowedFormats.includes(ext)) {
      setErrorMessage('Invalid image format. Allowed formats: JPEG, JPG, PNG, WEBP.');
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      setForm({ ...form, image: null });
      setExistingImageUrl('');
      return;
    }

    if (image.size > 500 * 1024) {
      setErrorMessage('Image exceeds 500KB limit.');
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      setForm({ ...form, image: null });
      setExistingImageUrl('');
      return;
    }

    setErrorMessage('');
    setForm({ ...form, image });
    setExistingImageUrl(URL.createObjectURL(image));
  };

  // Handle form submission
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrorMessage('');

  if (!form.blogTitle.trim() || !form.tags.trim() || !(typeof form.category === 'string' ? form.category.trim() : String(form.category).trim()) || !form.description.trim() || !form.date.trim() || !form.time.trim() || !form.content.trim()) {
    setErrorMessage('Please fill in all required fields.');
    setIsSubmitting(false);
    return;
  }

  const formData = new FormData();
  formData.append('blogId', id);
  formData.append('blogTitle', form.blogTitle);
  formData.append('blogTag', form.tags);
  formData.append('blogCategory', form.category);
  formData.append('blogDescription', form.description);
  formData.append('blogContent', form.content);
  formData.append('blogDate', form.date);
  formData.append('blogTime', form.time);

  const finalBlogSlug = form.blogSlug.trim() === ''
    ? form.blogTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
    : form.blogSlug;
  formData.append('blog_slug', finalBlogSlug);

  if (form.image) {
    formData.append('blog_feature_image', form.image);
  } else if (existingImageUrl) {
    formData.append('existing_image_url', existingImageUrl);
  }

  const res = await fetch(`/api/dashboard/blogs/update-blog?id=${id}`, {
    method: 'PUT',
    body: formData,
  });

  const result = await res.json();

  if (res.ok) {
    toast.success('Blog updated successfully');
    router.push('/dashboard/blog-table');
  } else {
    toast.error(result.message || 'Update failed');
  }

  setIsSubmitting(false);
};


  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 text-gray-900 lg:px-8 py-8">
        <div className="rounded border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-5 px-6 dark:border-strokedark">
            <h3 className="text-lg font-semibold text-black dark:text-white">Edit Blog</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-8">
              {/* Title & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="blogTitle" className="mb-2 block text-black dark:text-white">Blog Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="blogTitle"
                    value={form.blogTitle}
                    placeholder="Enter title"
                    onChange={(e) => setForm({ ...form, blogTitle: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label htmlFor="blogKeywords" className="mb-2 block text-black dark:text-white">Blog Keywords <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="blogKeywords"
                    value={form.tags}
                    placeholder="Enter keywords"
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              </div>

              {/* Manual Slug Field */}
              <div>
                <label htmlFor="blogSlug" className="mb-2 block text-black dark:text-white">Manual Slug (Optional)</label>
                <input
                  type="text"
                  id="blogSlug"
                  value={form.blogSlug}
                  onChange={(e) => setForm({ ...form, blogSlug: e.target.value })}
                  className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                />
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  If left blank, a slug will be automatically generated from the title.
                </p>
              </div>

              {/* Image, Date, Time, Category */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="featureImage" className="mb-2 block text-black dark:text-white">Feature Image</label>
                  <input
                    type="file"
                    id="featureImage"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                  {existingImageUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Image:</p>
                      <img src={existingImageUrl} alt="Current Feature" className="max-w-xs h-auto rounded object-cover" />
                    </div>
                  )}
                  {errorMessage && <p className="text-sm text-red-500 mt-2">{errorMessage}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="blogDate" className="mb-2 block text-black dark:text-white">Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      id="blogDate"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="blogTime" className="mb-2 block text-black dark:text-white">Time <span className="text-red-500">*</span></label>
                    <input
                      type="time"
                      id="blogTime"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="blogCategory" className="mb-2 block text-black dark:text-white">Category <span className="text-red-500">*</span></label>
                    <select
                      id="blogCategory"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="blogDescription" className="mb-2 block text-black dark:text-white">Description <span className="text-red-500">*</span></label>
                <textarea
                  id="blogDescription"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full h-32 rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                  placeholder="Enter a brief description"
                />
              </div>

              {/* Content Editor */}
              <div>
                <label htmlFor="blogContent" className="mb-2 block text-black dark:text-white">Content <span className="text-red-500">*</span></label>
                <JoditEditor
                  config={editorConfig}
                  value={form.content}
                  onBlur={(newContent) => setForm({ ...form, content: newContent })}
                  onChange={() => { }} // This is necessary but can be empty
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/blog-table')}
                  className="rounded border border-stroke py-2 px-6 text-black hover:bg-gray-100 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rounded bg-primary py-2 px-6 text-white hover:bg-opacity-90 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Updating...' : 'Update Blog'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </DashboardLayout>
  );
}