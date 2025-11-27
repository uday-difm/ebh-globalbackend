'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Head from 'next/head';
import DashboardLayout from '../../../component/DashboardLayout';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';



export default function AdminTable() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const adminsPerPage = 15;

  const router = useRouter();

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`/api/dashboard/admin/view-user`);
      const data = await res.json();
      setAdmins(data.data || []);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

 const deleteUser = async (id) => {
  const confirmDelete = confirm('Are you sure you want to delete this user?');
  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/dashboard/admin/delete-user/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }

    // Remove from local state
    setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== id));

    alert('User deleted successfully.');
  } catch (err) {
    alert('Error deleting user: ' + err.message);
  }
};

  const paginatedAdmins = admins.slice(
    currentPage * adminsPerPage,
    (currentPage + 1) * adminsPerPage
  );

  return (
    <DashboardLayout>
      <Head>
        <title>Admin Table</title>
        <meta name="description" content="Paginated admin list" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-md p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Total Admins: {admins.length}
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                  <th className="px-4 py-3 text-left">S.no</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Date Created</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      Loading admins...
                    </td>
                  </tr>
                ) : paginatedAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No admins available
                    </td>
                  </tr>
                ) : (
                  paginatedAdmins.map((data, index) => (
                    <tr
                      key={data.id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                        {currentPage * adminsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white">{data.name}</td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white">{data.email}</td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white">
                     {data.role }
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          {data.formatted_created_date || '—'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-3 justify-center">
                          {/* <Link href={`/admin/${data.slug || data.id}`}>
                            <Eye className="w-4 h-4 text-slate-500 hover:text-blue-600 cursor-pointer" />
                          </Link> */}
                          <button onClick={() => router.push(`/dashboard/update-user/${data.id}`)}>
                            <Pencil className="w-4 h-4 text-slate-500 hover:text-yellow-500 cursor-pointer" />
                          </button>
                          <button onClick={() => deleteUser(data.id)}>
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

          {/* Pagination */}
          <div className="pt-4 flex justify-center">
            <ReactPaginate
              pageCount={Math.ceil(admins.length / adminsPerPage)}
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
        </div>
      </div>
    </DashboardLayout>
  );
}
