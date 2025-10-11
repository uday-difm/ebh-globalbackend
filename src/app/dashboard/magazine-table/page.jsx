'use client';

import DashboardLayout from '../../../component/DashboardLayout';
import { useEffect, useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function MagazinesDashboard() {
  const [magazines, setMagazines] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();

  const fetchMagazines = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard/magazine');
      const data = await res.json();
      setMagazines(data || []);
      setTotal((data && data.length) || 0);
    } catch (err) {
      console.error('Failed to fetch magazines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMagazines();
  }, []);

  const paginatedMagazines = magazines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(total / itemsPerPage);

  const deleteMagazine = async (magazine_slug) => {
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the magazine.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirmation.isConfirmed) {
      try {
        const response = await fetch(`/api/dashboard/magazine/delete-magazine/${magazine_slug}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok) {
          console.error('Delete error:', result.message);
          await Swal.fire('Error', result.message || 'Failed to delete magazine.', 'error');
          return;
        }

        setMagazines((prevMagazines) =>
          prevMagazines.filter((mag) => mag.magazine_slug !== magazine_slug)
        );

        await Swal.fire('Deleted!', result.message || 'Magazine deleted successfully.', 'success');
      } catch (error) {
        console.error('Error deleting magazine:', error);
        await Swal.fire('Error', 'Failed to delete the magazine.', 'error');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen text-black">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Total Magazines: {total}</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100 text-left">
                <tr className="text-sm text-gray-600">
                  <th className="p-3">S.no</th>
                  <th className="p-3">Magazine Title</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center p-6">Loading...</td>
                  </tr>
                ) : (
                  paginatedMagazines.map((mag, index) => (
                    <tr
                      key={mag.idMagazines}
                      className="border-b hover:bg-gray-50 text-sm transition-colors"
                    >
                      <td className="p-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="p-3">{mag.magazine_title}</td>
                      <td className="p-3">
                        <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                          {new Date(mag.magazine_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="p-3 text-center space-x-3 text-gray-600">
                        <button
                          title="View"
                          onClick={() => router.push(`/magazine/${mag.magazine_slug}`)}
                          className="hover:text-blue-500"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          title="Edit"
                          onClick={() => router.push(`/dashboard/edit-magazine/${mag.magazine_slug}`)}
                          className="hover:text-yellow-500"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => deleteMagazine(mag.magazine_slug)}
                          className="hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border text-sm ${currentPage === i + 1
                  ? 'bg-red-500 text-white'
                  : 'bg-white hover:bg-gray-100'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
