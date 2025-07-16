'use client';

import DashboardLayout from '../../../component/DashboardLayout';
import { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

type Magazine = {
  idMagazines: number;
  magazine_id: string;
  magazine_title: string;
  magazine_date: string;
  magazine_slug: string;
  MagCloudLink: string;
};

export default function MagazinesDashboard() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();

  // Fetch magazines data from the API
  const fetchMagazines = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard/magazine/view-magazine?page=${page}&limit=${itemsPerPage}`);
      const data = await res.json();
      setMagazines(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch magazines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMagazines(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(total / itemsPerPage);

  // Function to delete a magazine
  const deleteMagazine = async (magazineId: string) => {
    try {
      const response = await fetch(`/api/dashboard/magazine/delete-magazine?id=${magazineId}`, {
        method: 'DELETE', // DELETE method
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to delete magazine:', errorData.message);
        alert(errorData.message || 'Failed to delete the magazine.');
        return;
      }

      const result = await response.json();
      console.log('Delete magazine response:', result);
      alert(result.message || 'Magazine deleted successfully.');

      // Remove the deleted magazine from the state
      setMagazines((prevMagazines) => prevMagazines.filter((mag) => mag.magazine_id !== magazineId)); // Filter out the deleted magazine
    } catch (error) {
      console.error('Error deleting magazine:', error);
      alert('Failed to delete the magazine.');
    }
  };




  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
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
                    <td colSpan={4} className="text-center p-6">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  magazines.map((mag, index) => (
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
                          onClick={() => router.push(`/dashboard/view-magazine/${mag.magazine_id}`)}
                          className="hover:text-blue-500"
                        >
                          <FaEye />
                        </button>
                        <button
                          title="Edit"
                          onClick={() => router.push(`/dashboard/edit-magazine/${mag.magazine_id}`)}
                          className="hover:text-yellow-500"
                        >
                          <FaEdit />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => deleteMagazine(mag.magazine_id)} // Handle delete
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
