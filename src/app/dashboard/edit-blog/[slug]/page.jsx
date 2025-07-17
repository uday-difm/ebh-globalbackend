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
    if (!slug) {
      console.warn("No slug provided for fetching blog details.");
      return;
    }

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/dashboard/blog/fetchblogbyslug?slug=${slug}`);
        if (!res.ok) {
          const errorData = await res.json();
          toast.error(errorData.message || 'Failed to fetch blog data');
          return;
        }

        const blogData = await res.json();
        if (!blogData || typeof blogData !== 'object' || Object.keys(blogData).length === 0) {
          toast.error('Fetched blog data is empty or malformed.');
          setForm({
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
            time = dateTime.toTimeString().split(' ')[0].substring(0, 5);
          }
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

        if (res.ok) {
          setCategories(data);
        } else {
          toast.error(data.message || 'Failed to fetch categories');
        }
      } catch {
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
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
      if (imageInputRef.current) imageInputRef.current.value = '';
      setForm({ ...form, image: null });
      setExistingImageUrl('');
      return;
    }

    if (image.size > 500 * 1024) {
      setErrorMessage('Image exceeds 500KB limit.');
      if (imageInputRef.current) imageInputRef.current.value = '';
      setForm({ ...form, image: null });
      setExistingImageUrl('');
      return;
    }

    setErrorMessage('');
    setForm({ ...form, image });
    setExistingImageUrl(URL.createObjectURL(image));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    if (!form.blogTitle.trim() || !form.tags.trim() || !form.category.trim() || !form.description.trim() || !form.date.trim() || !form.time.trim() || !form.content.trim()) {
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('blogId', slug);
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

    const res = await fetch(`/api/dashboard/blog/${slug}?slug=${slug}`, {
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
      {/* ... UI JSX unchanged from your original code ... */}
      <ToastContainer position="bottom-right" autoClose={5000} />
    </DashboardLayout>
  );
}
