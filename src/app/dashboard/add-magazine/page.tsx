'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import DashboardLayout from '../../../component/DashboardLayout';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface Credit {
  sno: number | '';
  instalink: string;
  image: string;
  credits: string;
}

interface FormValues {
  slug: string; // Add this line for slug
  magazineTitle: string;
  tags: string;
  image: string | File | null;
  date: string;
  category: string;
  MagCloudLink: string;
  PdfLink: string;
  description: string;
  age_verification_required: boolean;
  email_verification_required: boolean;
  credits: Credit[];
}

const editorConfig = {
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: 'en',
  toolbarButtonSize: 'medium' as 'small' | 'tiny' | 'xsmall' | 'middle' | 'large',
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

const MagazinePostForm: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [values, setValues] = useState<FormValues>({
    slug: '',
    magazineTitle: '',
    tags: '',
    image: null,
    date: '',
    category: '',
    MagCloudLink: '',
    PdfLink: '',
    description: '',
    age_verification_required: false,
    email_verification_required: false,
    credits: [
      { sno: '', instalink: '', image: '', credits: '' }
    ],
  });

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const image = e.target.files ? e.target.files[0] : null;
  //   setValues({ ...values, image });

  //   if (image) {
  //     const ext = image.name.split('.').pop()?.toLowerCase();
  //     const allowedFormats = ['jpeg', 'jpg', 'png', 'webp'];

  //     if (!allowedFormats.includes(ext || '')) {
  //       setErrorMessage('Invalid image format. Please upload JPEG, JPG, PNG, or WebP.');
  //     } else if (image.size > 500 * 1024) {
  //       setErrorMessage('File size exceeds 500KB! Please upload a smaller image.');
  //       alert('File size exceeds 500KB! Please upload a smaller image.');
  //     } else {
  //       setErrorMessage('');
  //     }
  //   }
  // };

  // Credits handlers

  const updateCredit = (index: number, field: keyof Credit, value: string | number) => {
    const updatedCredits = [...values.credits];
    updatedCredits[index] = { ...updatedCredits[index], [field]: value };
    setValues({ ...values, credits: updatedCredits });
  };

  const addCredit = () => {
    setValues({
      ...values,
      credits: [...values.credits, { sno: '', instalink: '', image: '', credits: '' }],
    });
  };

  const removeCredit = (index: number) => {
    const updatedCredits = values.credits.filter((_, i) => i !== index);
    setValues({ ...values, credits: updatedCredits });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   const required = ['magazineTitle', 'tags', 'image', 'date', 'MagCloudLink', 'description'];
  //   if (required.some((field) => values[field as keyof FormValues] === '')) {
  //     alert('Please fill in all necessary data');
  //     setIsSubmitting(false);
  //     return;
  //   }

  //   if (errorMessage) {
  //     alert(errorMessage);
  //     setIsSubmitting(false);
  //     return;
  //   }

  //   // Validate credits (basic)
  //   for (const credit of values.credits) {
  //     if (
  //       credit.sno === '' ||
  //       !credit.instalink.trim() ||
  //       !credit.image.trim() ||
  //       !credit.credits.trim()
  //     ) {
  //       alert('Please fill all fields in each credit entry or remove unused entries.');
  //       setIsSubmitting(false);
  //       return;
  //     }
  //   }

  //   try {
  //     const payload = {
  //       magazineTitle: values.magazineTitle,
  //       tags: values.tags,
  //       image: typeof values.image === 'string' ? values.image : '',
  //       date: values.date,
  //       category: values.category,
  //       MagCloudLink: values.MagCloudLink,
  //       PdfLink: values.PdfLink,
  //       description: values.description,
  //       age_verification_required: values.age_verification_required ? 1 : 0,
  //       email_verification_required: values.email_verification_required ? 1 : 0,
  //       credits: JSON.stringify(values.credits),
  //     };

  //     const res = await fetch('/api/dashboard/magazine/add-magzine', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     });


  //     const data = await res.json();
  //     if (res.ok) {
  //       alert('Magazine post saved successfully!');
  //       setValues({
  //         slug: '',
  //         magazineTitle: '',
  //         tags: '',
  //         image: null,
  //         date: '',
  //         category: '',
  //         MagCloudLink: '',
  //         PdfLink: '',
  //         description: '',
  //         age_verification_required: false,
  //         email_verification_required: false,
  //         credits: [{ sno: '', instalink: '', image: '', credits: '' }],
  //       });
  //       if (imageInputRef.current) imageInputRef.current.value = '';
  //     } else {
  //       alert(data.error || 'Something went wrong!');
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     alert('Failed to submit. Please try again.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const required = ['magazineTitle', 'tags', 'image', 'date', 'MagCloudLink', 'description'];
    if (required.some((field) => values[field as keyof FormValues] === '')) {
      alert('Please fill in all necessary data');
      setIsSubmitting(false);
      return;
    }

    if (errorMessage) {
      alert(errorMessage);
      setIsSubmitting(false);
      return;
    }

    // Validate credits (basic)
    for (const credit of values.credits) {
      if (
        credit.sno === '' ||
        !credit.instalink.trim() ||
        !credit.image.trim() ||
        !credit.credits.trim()
      ) {
        alert('Please fill all fields in each credit entry or remove unused entries.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const payload = {
        slug: values.slug,  // Include slug in the payload
        magazineTitle: values.magazineTitle,
        tags: values.tags,
        image: typeof values.image === 'string' ? values.image : '',
        date: values.date,
        category: values.category,
        MagCloudLink: values.MagCloudLink,
        PdfLink: values.PdfLink,
        description: values.description,
        age_verification_required: values.age_verification_required ? 1 : 0,
        email_verification_required: values.email_verification_required ? 1 : 0,
        credits: JSON.stringify(values.credits),
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
          slug: '',
          magazineTitle: '',
          tags: '',
          image: null,
          date: '',
          category: '',
          MagCloudLink: '',
          PdfLink: '',
          description: '',
          age_verification_required: false,
          email_verification_required: false,
          credits: [{ sno: '', instalink: '', image: '', credits: '' }],
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
            <div className="p-6 space-y-8 text-gray-800 ">
              {/* Magazine Title and Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-black dark:text-white">Magazine Title</label>
                  <input
                    type="text"
                    value={values.magazineTitle}
                    placeholder="Enter title"
                    onChange={(e) => setValues({ ...values, magazineTitle: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-black dark:text-white">Magazine Keywords</label>
                  <input
                    type="text"
                    value={values.tags}
                    placeholder="Enter keywords"
                    onChange={(e) => setValues({ ...values, tags: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={values.slug}
                    placeholder="Enter slug (optional)"
                    onChange={(e) => setValues({ ...values, slug: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              </div>

              {/* Feature Image and Date/Category */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* <div>
                  <label className="mb-2 block text-black dark:text-white">Feature Image</label>
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                  {errorMessage && (
                    <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
                  )}
                </div> */}

                <div>
                  <label className="mb-2 block text-black dark:text-white">Feature Image URL</label>
                  <input
                    type="text"
                    value={typeof values.image === 'string' ? values.image : ''}
                    placeholder="Enter image URL"
                    onChange={(e) => {
                      setValues({ ...values, image: e.target.value });
                      setErrorMessage('');
                      // Optional: you can add validation here for URL format if needed
                    }}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                  {errorMessage && (
                    <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
                  )}
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
                    <label className="mb-2 block text-black dark:text-white">Category</label>
                    <input
                      type="text"
                      value={values.category}
                      placeholder="Magazine category"
                      onChange={(e) => setValues({ ...values, category: e.target.value })}
                      className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                    />
                  </div>
                </div>
              </div>

              {/* MagCloud and PDF Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div>
                  <label className="mb-2 block text-black dark:text-white">PDF Link</label>
                  <input
                    type="text"
                    value={values.PdfLink}
                    placeholder="Paste PDF link here..."
                    onChange={(e) => setValues({ ...values, PdfLink: e.target.value })}
                    className="w-full rounded border border-stroke py-3 px-4 dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              </div>

              {/* Verification checkboxes */}
              <div>
                <label className="mb-2 block text-black dark:text-white">Age Verification Required</label>
                <input
                  type="checkbox"
                  checked={values.age_verification_required}
                  onChange={() => setValues({ ...values, age_verification_required: !values.age_verification_required })}
                  className="mr-2"
                />
                <label className="text-black dark:text-white">Yes</label>
              </div>

              <div>
                <label className="mb-2 block text-black dark:text-white">Email Verification Required</label>
                <input
                  type="checkbox"
                  checked={values.email_verification_required}
                  onChange={() => setValues({ ...values, email_verification_required: !values.email_verification_required })}
                  className="mr-2"
                />
                <label className="text-black dark:text-white">Yes</label>
              </div>

              {/* Content editor */}
              <div>
                <label className="mb-2 block text-black dark:text-white">Content</label>
                <JoditEditor
                  config={editorConfig}
                  value={values.description}
                  onChange={(value) => setValues({ ...values, description: value })}
                />
              </div>

              {/* === CREDITS SECTION === */}
              <div className="border-t border-gray-300 pt-6">
                <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Credits</h3>
                {values.credits.map((credit, idx) => (
                  <div key={idx} className="mb-4 rounded border border-stroke p-4 dark:border-form-strokedark">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="mb-1 block text-black dark:text-white">Sno</label>
                        <input
                          type="number"
                          min={1}
                          value={credit.sno}
                          onChange={(e) => updateCredit(idx, 'sno', Number(e.target.value))}
                          className="w-full rounded border border-stroke py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-black dark:text-white">Instagram Link</label>
                        <input
                          type="text"
                          value={credit.instalink}
                          onChange={(e) => updateCredit(idx, 'instalink', e.target.value)}
                          className="w-full rounded border border-stroke py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-black dark:text-white">Image URL</label>
                        <input
                          type="text"
                          value={credit.image}
                          onChange={(e) => updateCredit(idx, 'image', e.target.value)}
                          className="w-full rounded border border-stroke py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-black dark:text-white">Credits</label>
                        <input
                          type="text"
                          value={credit.credits}
                          onChange={(e) => updateCredit(idx, 'credits', e.target.value)}
                          className="w-full rounded border border-stroke py-2 px-3 dark:border-form-strokedark dark:bg-form-input"
                          placeholder="E.g. Photographer: John Doe, Model: Jane Smith"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCredit(idx)}
                      className="mt-2 text-sm text-red-600 hover:underline"
                    >
                      Remove Credit
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCredit}
                  className="mt-4 rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark"
                >
                  Add Credit
                </button>
              </div>

              {/* Submit Buttons */}
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
                  className={`rounded bg-primary py-2 px-6 text-white hover:bg-opacity-90 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
