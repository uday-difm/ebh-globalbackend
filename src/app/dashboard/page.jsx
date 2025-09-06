"use client";

import { toast, ToastContainer } from 'react-toastify';
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../component/DashboardLayout";
import Image from "next/image";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const DashboardHome = () => {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalMagazines, setTotalMagazines] = useState(0);
  const [blogsPerPage] = useState(10);

  // This useEffect correctly handles the navigation as a side effect
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dashboard/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const fetchCounts = async () => {
    try {
      const response = await fetch("/api/dashboard/count");
      const data = await response.json();
      if (response.ok) {
        setTotalBlogs(data.total_blogs);
        setTotalMagazines(data.total_magazines);
      } else {
        setError("Failed to fetch counts");
      }
    } catch {
      setError(`Error fetching counts`);
    }
  };

  const fetchBlogs = async (page = 1, limit = blogsPerPage) => {
    try {
      const response = await fetch(`/api/dashboard/blog`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      let blogsArr = [];
      let total = 0;

      if (Array.isArray(data)) {
        blogsArr = data;
        total = data.length;
      } else if (Array.isArray(data.blogs)) {
        blogsArr = data.blogs;
        total = data.total_blogs || data.blogs.length || 0;
      } else if (Array.isArray(data.data)) {
        blogsArr = data.data;
        total = data.total_blogs || data.data.length || 0;
      } else if (typeof data === 'object' && data !== null) {
        blogsArr = [data];
        total = 1;
      }

      setBlogs(blogsArr);
      setTotalBlogs(total);
    } catch {
      setError(`Error fetching blogs`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBlogs(currentPage);
      fetchCounts();
    }
  }, [currentPage, isAuthenticated]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= Math.ceil(totalBlogs / blogsPerPage)) {
      setCurrentPage(page);
    }
  };

  const deleteBlog = async (blog_slug) => {
    try {
      const response = await fetch(`/api/dashboard/blog/delete-blog/${blog_slug}`, { method: 'DELETE' });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete the blog');
        return;
      }

      toast.success('Blog deleted successfully');
      await fetchBlogs(currentPage);
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('An error occurred while deleting the blog');
    }
  };
  
  if (!hydrated) {
    return null;
  }

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      {/* Blog & Magazine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-3 px-35">
        {[{ label: "Total Blogs", count: totalBlogs }, { label: "Total Magazines", count: totalMagazines }].map(
          (item, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-xl rounded-2xl p-6 flex flex-col justify-between transition hover:scale-[1.02]"
            >
              <div className="text-sm font-medium text-slate-300 mb-2">{item.label}</div>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-2xl font-semibold">{item.count}</span>
                <button className="text-sm text-green-400 hover:underline">View All</button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Blogs Table */}
      <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6">
        <div className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Latest Blogs</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600 whitespace-nowrap">
            <thead>
              <tr className="text-xs text-gray-500 uppercase border-b hidden md:table-row">
                <th className="py-3">S.no</th>
                <th>Image</th>
                <th>Title</th>
                <th>Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-3 text-center text-gray-500">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-3 text-center text-red-500">{error}</td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-3 text-center text-gray-500">No blogs available</td>
                </tr>
              ) : (
                blogs.map((blog, index) => (
                  <tr
                    key={blog.blog_id}
                    className="border-b hover:bg-gray-50 transition md:table-row flex flex-col md:flex-row mb-4 md:mb-0"
                  >
                    <td className="py-3 font-medium">{(currentPage - 1) * blogsPerPage + index + 1}</td>
                    <td className="py-3">
                      <Image
                        src={blog.blog_feature_image}
                        alt="Blog"
                        width={80}
                        height={60}
                        className="object-cover rounded-md shadow-sm"
                        loading="lazy"
                      />
                    </td>
                    <td className="py-2 px-2">{blog.blog_title}</td>
                    <td className="py-2 px-2">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        {(blog.blog_timestamp && new Date(blog.blog_timestamp).toLocaleDateString('en-GB')) ||
                          blog.formatted_blog_date ||
                          blog.blog_date ||
                          blog.createdAt ||
                          "N/A"}
                      </span>
                    </td>
                    <td className="p-3 text-center space-x-3 text-gray-600">
                      <button title="View" className="hover:text-blue-500">
                        <FaEye />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => router.push(`/dashboard/edit-blog/${blog.blog_slug}`)}
                        className="hover:text-yellow-500"
                      >
                        <FaEdit />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => deleteBlog(blog.blog_slug)}
                        className="hover:text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-600 text-white hover:bg-fuchsia-900 py-2 px-4 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700 font-semibold">{`Page ${currentPage}`}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * blogsPerPage >= totalBlogs}
            className="bg-gray-600 text-white hover:bg-fuchsia-900 py-2 px-4 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
