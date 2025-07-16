"use client";

import Head from "next/head";
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../component/DashboardLayout";
import Image from "next/image"; // Import next/image for optimized image loading
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';


interface Blog {
  blog_id: string;
  blog_feature_image: string;
  blog_title: string;
  blog_slug: string;
  formatted_blog_date: string;
}

interface ApiResponse {
  blogs: Blog[];
  total_blogs: number;
  total_magazines: number;
}

const DashboardHome: React.FC = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]); // State to hold blog data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string>(""); // Error state
  const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page
  const [totalBlogs, setTotalBlogs] = useState<number>(0); // Total blogs count
  const [totalMagazines, setTotalMagazines] = useState<number>(0); // Total magazines count
  const [blogsPerPage] = useState<number>(10); // Number of blogs per page

  // Fetch counts for blogs, magazines, and webitorials
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

  // Fetch blog data from API
  const fetchBlogs = async (page: number = 1, limit: number = blogsPerPage) => {
    try {
      const response = await fetch(
        `/api/dashboard/blogs/fetchblog?page=${page}&limit=${limit}`
      );
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      // Ensure data.blogs is an array
      if (Array.isArray(data.blogs)) {
        setBlogs(data.blogs);
        setTotalBlogs(data.total_blogs);
      } else {
        // Handle invalid response structure
        setBlogs([]);
        setTotalBlogs(0);
      }
    } catch {
      setError(`Error fetching blogs`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch blog data and counts when the component mounts or when the current page changes
  useEffect(() => {
    fetchBlogs(currentPage); // Call fetchBlogs when the component first mounts
    fetchCounts(); // Fetch counts for blogs, magazines, and webitorials
  }, [currentPage]); // Re-fetch when the current page changes

  // Handle page navigation
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= Math.ceil(totalBlogs / blogsPerPage)) {
      setCurrentPage(page);
    }
  };
  const deleteBlog = async (blogId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/dashboard/blogs/delete-blog?id=${blogId}`, {
          method: "PUT",
        });

        if (response.ok) {
          Swal.fire("Deleted!", "The blog has been deleted.", "success");
          // Refresh the blogs list
          fetchBlogs(currentPage); // Ensure fetchBlogs is in the dependency array of useEffect
        } else {
          Swal.fire("Error", "Failed to delete the blog.", "error");
        }
      } catch {
        Swal.fire("Error", "Something went wrong.", "error");
      }
    }
  };


  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard</title>
      </Head>

      {/* Cards for Total Blogs, Magazines, and Webitorials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-3 px-35">
        {[
          {
            label: "Total Blogs",
            count: totalBlogs,
          },
          {
            label: "Total Magazines",
            count: totalMagazines,
          },
          
        ].map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-xl rounded-2xl p-6 flex flex-col justify-between transition hover:scale-[1.02]"
          >
            <div className="text-sm font-medium text-slate-300 mb-2">
              {item.label}
            </div>
            <div className="flex justify-between items-center mt-auto">
              <span className="text-2xl font-semibold">{item.count}</span>
              <button className="text-sm text-green-400 hover:underline">
                View All
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Blogs Table */}
      <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6">
        <div className="text-lg sm:text-xl font-bold mb-4 text-gray-800">
          Latest Blogs
        </div>
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
                  <td colSpan={6} className="py-3 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-3 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-3 text-center text-gray-500">
                    No blogs available
                  </td>
                </tr>
              ) : (
                blogs.map((blog, index) => (
                  <tr
                    key={blog.blog_id}
                    className="border-b hover:bg-gray-50 transition md:table-row flex flex-col md:flex-row mb-4 md:mb-0"
                  >
                    <td className="py-3 font-medium">
                      {(currentPage - 1) * blogsPerPage + index + 1}
                    </td>
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
                        {blog.formatted_blog_date}
                      </span>
                    </td>
                    {/* Actions column */}
                    <td className="p-3 text-center space-x-3 text-gray-600">
                      <button
                        title="View"
                        // onClick={() => router.push(`/dashboard/view-blog/${blog.blog_id}`)}
                        className="hover:text-blue-500"
                      >
                        <FaEye />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => router.push(`/dashboard/edit-blog/${blog.blog_id}`)}
                        className="hover:text-yellow-500"
                      >
                        <FaEdit />
                      </button>

                      <button
                        title="Delete"
                        onClick={() => deleteBlog(blog.blog_id)} // Handle delete
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

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-600 text-white hover:bg-fuchsia-900 py-2 px-4 rounded-md disabled:opacity-50"
          >
            Previous
          </button>

          {/* Page Number Display */}
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
