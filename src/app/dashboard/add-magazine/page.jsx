'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import DashboardLayout from '../../../component/DashboardLayout';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const editorConfig = {
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: 'en',
  toolbarButtonSize: 'medium',
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

const MagazinePostForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState({
    magazine_id: '',
    magazine_title: '',
    magazine_description: '',
    magazine_tags: '',
    magazine_cover_image: null,
    magazine_link: '',
    magazine_date: '',
    magazine_category: '',
    MagCloudLink: '',
    magazine_slug: '',
  });

  const imageInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const required = [
      'magazine_id',
      'magazine_title',
      'magazine_description',
      'magazine_tags',
      'magazine_cover_image',
      'magazine_link',
      'magazine_date',
      'magazine_category',
      'MagCloudLink',
      'magazine_slug',
    ];

    if (required.some((field) => values[field] === '')) {
      alert('Please fill in all necessary data');
      setIsSubmitting(false);
      return;
    }

    if (errorMessage) {
      alert(errorMessage);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        magazine_id: values.magazine_id,
        magazine_title: values.magazine_title,
        magazine_description: values.magazine_description,
        magazine_tags: values.magazine_tags,
        magazine_cover_image: typeof values.magazine_cover_image === 'string' ? values.magazine_cover_image : '',
        magazine_link: values.magazine_link,
        magazine_date: values.magazine_date,
        magazine_category: values.magazine_category,
        MagCloudLink: values.MagCloudLink,
        magazine_slug: values.magazine_slug,
      };

      const res = await fetch('/api/dashboard/magazine/add-magzine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Magazine post saved successfully!');
        setValues({
          magazine_id: '',
          magazine_title: '',
          magazine_description: '',
          magazine_tags: '',
          magazine_cover_image: null,
          magazine_link: '',
          magazine_date: '',
          magazine_category: '',
          MagCloudLink: '',
          magazine_slug: '',
        });
        if (imageInputRef.current) imageInputRef.current.value = '';
      } else {
        alert(data.error || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Post Magazine</title>
        <meta name="description" content="Add a new magazine post" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8 text-gray-800">
        <div className="rounded border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-5 px-6 dark:border-strokedark">
            <h3 className="text-lg font-semibold text-black dark:text-white">Post Magazine</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-8 text-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-black dark:text-white">Magazine ID</label>
                  <input
                    type="text"
                    value={values.magazine_id}
                    placeholder="Enter magazine ID"
                    onChange={(e) => setValues({ ...values, magazine_id: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">Magazine Title</label>
                  <input
                    type="text"
                    value={values.magazine_title}
                    placeholder="Enter title"
                    onChange={(e) => setValues({ ...values, magazine_title: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">Magazine Tags</label>
                  <input
                    type="text"
                    value={values.magazine_tags}
                    placeholder="Enter tags"
                    onChange={(e) => setValues({ ...values, magazine_tags: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">Magazine Slug</label>
                  <input
                    type="text"
                    value={values.magazine_slug}
                    placeholder="Enter slug"
                    onChange={(e) => setValues({ ...values, magazine_slug: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-black dark:text-white">Cover Image URL</label>
                  <input
                    type="text"
                    value={typeof values.magazine_cover_image === 'string' ? values.magazine_cover_image : ''}
                    placeholder="Enter cover image URL"
                    onChange={(e) => setValues({ ...values, magazine_cover_image: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">Magazine Link</label>
                  <input
                    type="text"
                    value={values.magazine_link}
                    placeholder="Enter magazine link"
                    onChange={(e) => setValues({ ...values, magazine_link: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">Date</label>
                  <input
                    type="date"
                    value={values.magazine_date}
                    onChange={(e) => setValues({ ...values, magazine_date: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">Category</label>
                  <input
                    type="text"
                    value={values.magazine_category}
                    placeholder="Magazine category"
                    onChange={(e) => setValues({ ...values, magazine_category: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">MagCloud Link</label>
                  <input
                    type="text"
                    value={values.MagCloudLink}
                    placeholder="Paste MagCloud link here..."
                    onChange={(e) => setValues({ ...values, MagCloudLink: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-black dark:text-white">Description</label>
                <JoditEditor
                  config={editorConfig}
                  value={values.magazine_description}
                  onChange={(value) => setValues({ ...values, magazine_description: value })}
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
                  disabled={isSubmitting}
                  className={`rounded bg-black py-2 px-6 text-white hover:bg-opacity-90 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MagazinePostForm;
