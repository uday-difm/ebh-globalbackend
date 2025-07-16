'use client';  // <-- Make sure to mark it as a client-side component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Head from 'next/head';
import DashboardLayout from '../../../component/DashboardLayout';
// import { baseUrl } from '../../../lib/config';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

interface Blog {
  blog_id: number;
  blog_title: string;
  blog_slug: string;
  formatted_blog_date: string;
  blog_status: number;
}

interface BlogResponse {
  blogs: Blog[];
  total_blogs: number;
}

export default function BlogTable() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [totalBlogs, setTotalBlogs] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const blogsPerPage = 15;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `$/api/dashboard/blogs/draftblog?page=${currentPage + 1}&limit=${blogsPerPage}`
          // `${baseUrl}/api/dashboard/blogs/draftblog?page=${currentPage + 1}&limit=${blogsPerPage}`
        );

        if (!res.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const data: BlogResponse = await res.json();
        setBlogs(data.blogs);
        setTotalBlogs(data.total_blogs);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const deleteBlog = async (blogId: number) => {
    try {
      const response = await fetch(`${baseUrl}/api/dashboard/blogs/delete-blog/${blogId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete the log.');
        return;
      }

      const result = await response.json();
      alert(result.message || 'Log deleted successfully.');
      setBlogs(blogs.filter((blog) => blog.blog_id !== blogId)); // Update the frontend after deletion
    } catch (error) {
      console.error('Error deleting log:', error);
      alert('Failed to delete the log.');
    }
  };

  const publishBlog = async (blogId: number) => {
    try {
      const response = await fetch(`${baseUrl}/api/dashboard/blogs/draftblog`, {
        method: 'PUT',
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to publish the blog.');
        return;
      }

      const result = await response.json();
      alert(result.message || 'Blog published successfully.');

      // Remove the published blog from the list (update the frontend)
      setBlogs(blogs.filter((blog) => blog.blog_id !== blogId)); // Update the frontend after publishing
    } catch (error) {
      console.error('Error publishing blog:', error);
      alert('Failed to publish the blog.');
    }
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
              Total Draft Blogs: {totalBlogs}
            </h2>
          </div>

          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                      <th className="px-4 py-3 text-left">S.no</th>
                      <th className="px-4 py-3 text-left">Blog Title</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-gray-500">
                          No blogs available
                        </td>
                      </tr>
                    ) : (
                      blogs.map((data, index) => (
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
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                              {data.formatted_blog_date}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex space-x-3">
                              <Link href={`${baseUrl}/blog/${data.blog_slug}`}>
                                <Eye className="w-4 h-4 text-slate-500 hover:text-blue-600 cursor-pointer" />
                              </Link>
                              <button onClick={() => router.push(`/dashboard/update-blog/${data.blog_id}`)}>
                                <Pencil className="w-4 h-4 text-slate-500 hover:text-yellow-500 cursor-pointer" />
                              </button>
                              <button onClick={() => deleteBlog(data.blog_id)}>
                                <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-600 cursor-pointer" />
                              </button>
                              <button onClick={() => publishBlog(data.blog_id)} className="w-4 h-4 text-slate-500 hover:text-green-600 cursor-pointer">
                                <FontAwesomeIcon icon={faPaperPlane} />
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
                  pageClassName="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-primary dark:hover:bg-gray-600 dark:text-white"
                  activeClassName="bg-primary text-white"
                  previousLabel="Prev"
                  nextLabel="Next"
                  breakLabel="..."
                  previousClassName="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-primary dark:hover:bg-gray-600 dark:text-white"
                  nextClassName="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-primary dark:hover:bg-gray-600 dark:text-white"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
