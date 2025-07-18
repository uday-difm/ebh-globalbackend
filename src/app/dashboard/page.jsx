"use client";

import Head from "next/head";
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../component/DashboardLayout";
import Image from "next/image";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const DashboardHome = () => {
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalMagazines, setTotalMagazines] = useState(0);
  const [blogsPerPage] = useState(10);

  const [adminUser, setAdminUser] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState("");



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
      const response = await fetch(`/api/dashboard/latest_blog?page=${page}&limit=${limit}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      let blogsArr = [];
      let total = 0;

      if (Array.isArray(data.blogs)) {
        blogsArr = data.blogs;
        total = data.total_blogs || data.blogs.length || 0;
      } else if (Array.isArray(data)) {
        blogsArr = data;
        total = data.length;
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
    fetchBlogs(currentPage);
    fetchCounts();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= Math.ceil(totalBlogs / blogsPerPage)) {
      setCurrentPage(page);
    }
  };

  const deleteBlog = async (blogId) => {
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
        const response = await fetch(`/api/dashboard/blog/${blogId}`, { method: 'DELETE' });

        if (response.ok) {
          Swal.fire("Deleted!", "The blog has been deleted.", "success");
          fetchBlogs(currentPage);
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

      {/* Admin User Card */}
      {/* <div className="max-w-xl mx-auto mb-8">
        {adminLoading ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">Loading admin info...</div>
        ) : adminError ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">{adminError}</div>
        ) : adminUser ? (
          <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <img
                src={adminUser.image || "/public/uploads/user.png-1752569350865-75181634.png"}
                alt={adminUser.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-green-500 shadow-md"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{adminUser.name}</h2>
              <p className="text-gray-600 mb-1">Email: {adminUser.email}</p>
              <p className="text-gray-600 mb-1">Number: {adminUser.number}</p>
              <p className="text-gray-600">{adminUser.bio}</p>
            </div>
          </div>
        ) : null}
      </div> */}

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
