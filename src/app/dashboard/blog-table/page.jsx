'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Head from 'next/head';
import DashboardLayout from '../../../component/DashboardLayout';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';

export default function BlogTable() {
  const [blogs, setBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const blogsPerPage = 10;
  const router = useRouter();

  // Fetch blogs from the API
  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/dashboard/blog?page=1&limit=10'); // example query params
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
      setTotalBlogs(data && data.length ? data.length : 0);
    } catch (err) {
      setError(err.message);
      toast.error('Error fetching blogs');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch blogs on mount
  useEffect(() => {
  const timer = setTimeout(() => {
    fetchBlogs();
  }, 3000); // 3000ms = 3 seconds

  // Cleanup the timer if component unmounts before timeout
  return () => clearTimeout(timer);
}, []);

  // Pagination logic for frontend
  const paginatedBlogs = blogs.slice(currentPage * blogsPerPage, (currentPage + 1) * blogsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleViewAllClick = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/dashboard/blogs/fetchblog?page=1&limit=10000');
      const data = await res.json();

      if (res.ok) {
        setBlogs(data.blogs);
        setTotalBlogs(data.total_blogs);
      } else {
        toast.error('Failed to fetch all blogs');
      }
    } catch (err) {
      setError(err.message);
      toast.error('Error fetching all blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBlog = async (blog_slug) => {
    try {
      const response = await fetch(`/api/dashboard/blog/${blog_slug}`, { method: 'DELETE' });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete the blog');
        return;
      }

      toast.success('Blog deleted successfully');
      setBlogs(blogs.filter(blog => blog.blog_slug !== blog_slug));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error while deleting the blog');
    }
  };


  const downloadBlogs = () => {
    const headers = ['Blog Title', 'Slug', 'Date'];
    const rows = blogs.map(blog => [
      blog.blog_title,
      blog.blog_slug,
      blog.blog_date_time,
    ]);

    const csvData = [headers, ...rows].map(row => row.join(',')).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + csvData;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'blogs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Blog Table</title>
        <meta name="description" content="Paginated blog list" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-md p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Total Blogs: {totalBlogs}
            </h2>
            <div>
              <button
                onClick={handleViewAllClick}
                className="bg-primary text-white py-2 px-4 rounded-md"
              >
                View All Blogs
              </button>
              <div className="relative group overflow-hidden rounded-full cursor-pointer">
                <div className="absolute inset-0 bg-green-500 z-0 transition-opacity duration-500 group-hover:opacity-80 rounded-full"></div>
                <div className="absolute w-[115px] h-[200px] bg-blue-800 transform rotate-[35deg] transition-all duration-600 ease-in-out top-[-245%] left-[-90%] group-hover:left-0 z-10"></div>
                <div className="absolute w-[200px] h-[90px] bg-blue-800 transform rotate-[125deg] transition-all duration-600 ease-in-out top-[-15%] left-[100%] group-hover:left-[20%] z-10"></div>
                <button onClick={downloadBlogs} className="relative z-20 text-white py-4 font-bold px-6 text-sm rounded-full transition-colors duration-300">
                  Download Blogs
                </button>
              </div>
              {/* <button
                onClick={downloadBlogs}
                className="bg-green-500 text-white py-2 px-4 rounded-md ml-4"
              >
                Download Blogs
              </button> */}
            </div>
          </div>

          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                      <th className="px-4 py-3 text-left">S.no</th>
                      <th className="px-4 py-3 text-left">Blog Title</th>
                      <th className="px-4 py-3 text-center">Date</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBlogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-gray-500">
                          No blogs available
                        </td>
                      </tr>
                    ) : (
                      paginatedBlogs.map((data, index) => (
                        <tr
                          key={data.blog_id}
                          className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                            {currentPage * blogsPerPage + index + 1}
                          </td>
                          <td className="px-4 py-3 text-gray-800 dark:text-white">
                            {data.blog_title}
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-medium">
                              {data.blog_date_time ? new Date(data.blog_date_time).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              }) : ''}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex space-x-3">
                              <Link href={`/blogs/${data.blog_slug}`}>
                                <Eye className="w-4 h-4 text-slate-500 hover:text-blue-600 cursor-pointer" />
                              </Link>
                              <button
                                onClick={() => {
                                  toast.success(`Editing blog: ${data.blog_title}`);
                                  router.push(`/dashboard/edit-blog/${data.blog_slug}`);
                                }}
                              >
                                <Pencil className="w-4 h-4 text-slate-500 hover:text-yellow-500 cursor-pointer" />
                              </button>
                              <button onClick={() => deleteBlog(data.blog_slug)}>
                                <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-600 cursor-pointer" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 flex justify-center">
                <ReactPaginate
                  pageCount={Math.ceil(totalBlogs / blogsPerPage)}
                  onPageChange={handlePageChange}
                  forcePage={currentPage}
                  containerClassName="flex flex-wrap gap-2"
                  pageClassName="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-primary dark:hover:bg-gray-600 dark:text-white cursor-pointer"
                  activeClassName="bg-gray-600 text-white"
                  previousLabel="Prev"
                  nextLabel="Next"
                  breakLabel="..."
                  previousClassName="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-primary dark:hover:bg-gray-600 dark:text-white cursor-pointer"
                  nextClassName="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-primary dark:hover:bg-gray-600 dark:text-white cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </DashboardLayout>
  );
}
