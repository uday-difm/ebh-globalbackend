'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import DashboardLayout from '../../../component/DashboardLayout';

// Dynamically import Jodit Editor
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
  minHeight: 500,
};

// Generate slug from title
const generateSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const AddBlog = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('1');
  const [categories, setCategories] = useState([]);

  const [values, setValues] = useState({
    title: '',
    tag: '',
    image: null,
    date: '',
    time: '',
    category: '',
    description: '',
    content: '',
    slug: '',
  });

  const imageInputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/dashboard/blog_category');
        const data = await response.json();
        if (response.ok) {
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const image = e.target.files?.[0] ?? null;
    setValues({ ...values, image });

    if (image) {
      const ext = image.name.split('.').pop()?.toLowerCase();
      const validFormats = ['jpeg', 'jpg', 'png', 'webp'];

      if (!validFormats.includes(ext || '')) {
        setErrorMessage('Invalid image format. Please use JPEG, JPG, PNG, or WebP.');
      } else if (image.size > 500 * 1024) {
        setErrorMessage('File size exceeds 500KB! Please upload a smaller image.');
      } else {
        setErrorMessage('');
      }
    }
  };

  const handleSubmit = async (e, postStatus) => {
    e.preventDefault();

    const required = ['title', 'image', 'date', 'category', 'description', 'content'];
    if (required.some((key) => values[key] === '')) {
      alert('Please fill in all required fields');
      return;
    }

    const finalSlug = values.slug ? values.slug : generateSlug(values.title);
    setValues((prev) => ({ ...prev, slug: finalSlug }));

    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('tag', values.tag);
      formData.append('date', values.date);
      formData.append('category', values.category);
      formData.append('description', values.description);
      formData.append('content', values.content);
      formData.append('slug', finalSlug);
      if (values.image instanceof File) {
        formData.append('image', values.image);
      }

      const response = await fetch('/api/dashboard/blog/add-blog', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post blog');
      }

      alert('Blog posted successfully!');
      setValues({
        title: '',
        tag: '',
        image: null,
        date: '',
        time: '',
        category: '',
        description: '',
        content: '',
        slug: '',
      });
      if (imageInputRef.current) imageInputRef.current.value = '';
      setStatus(postStatus);
    } catch (err) {
      alert(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Add Blog</title>
        <meta name="description" content="Add a new blog post" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8 text-black">
        <div className="rounded border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-5 px-6 dark:border-strokedark">
            <h3 className="text-lg font-semibold text-black dark:text-white">Post a Blog</h3>
          </div>

          <form onSubmit={(e) => handleSubmit(e, status)}>
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-black dark:text-white">Blog Title</label>
                  <input
                    type="text"
                    placeholder="Enter Title"
                    value={values.title}
                    onChange={(e) => setValues({ ...values, title: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">Tags</label>
                  <input
                    type="text"
                    placeholder="Enter Tags"
                    value={values.tag}
                    onChange={(e) => setValues({ ...values, tag: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-black dark:text-white">Manual Slug (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter Slug"
                  value={values.slug}
                  onChange={(e) => setValues({ ...values, slug: e.target.value })}
                  className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                />
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  If left blank, a slug will be automatically generated from the title.
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
                  {errorMessage && <p className="text-sm text-red-500 mt-2">{errorMessage}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-black dark:text-white">Date</label>
                    <input
                      type="date"
                      value={values.date}
                      onChange={(e) => setValues({ ...values, date: e.target.value })}
                      className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-black dark:text-white">Time</label>
                    <input
                      type="time"
                      value={values.time}
                      onChange={(e) => setValues({ ...values, time: e.target.value })}
                      className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-black dark:text-white">Blog Category</label>
                  <select
                    value={values.category}
                    onChange={(e) => setValues({ ...values, category: e.target.value })}
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
                    value={values.description}
                    onChange={(e) => setValues({ ...values, description: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-black dark:text-white">Content</label>
                <JoditEditor
                  config={editorConfig}
                  value={values.content}
                  onChange={(value) => setValues({ ...values, content: value })}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  className="rounded border border-stroke py-2 px-6 text-black hover:bg-gray-100 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => handleSubmit(e, '1')}
                  className={`rounded bg-black hover:bg-green-600 py-2 px-6 text-white hover:bg-opacity-90 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, '0')}
                  className={`rounded bg-black py-2 px-6 text-white hover:bg-green-700 hover:bg-opacity-90 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Posting...' : 'Save as Draft'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddBlog;
