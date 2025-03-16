// src/pages/ManageStudentsPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import axios, { AxiosError } from "axios";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";

interface Student {
  id: number;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  address: string;
  startDate: string;
  endDate: string;
  course: string;
}

const ManageStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation to get state
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // Add success state

  useEffect(() => {
    // Check for success message in location state
    if (location.state && location.state.success) {
      setSuccess(location.state.success);
      // Clear the state to prevent the message from persisting on refresh
      window.history.replaceState({}, document.title);
    }

    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token for students fetch:", token);
        if (token) {
          const response = await axios.get("http://localhost:5000/api/students", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Fetched students:", response.data);
          setStudents(response.data);
        } else {
          console.error("No token found for fetching students");
          setError("Authentication failed. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [location]); // Add location as dependency

  const handleBack = () => navigate("/admin-dashboard");

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const token = localStorage.getItem("token");
        console.log("Stored token:", token);
        console.log("Token for delete:", token);
        console.log("Deleting student with ID:", id);
        if (token) {
          const response = await axios.delete(`http://localhost:5000/api/students/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Delete response:", response.data);
          setStudents([]);
          const fetchStudents = async () => {
            const fetchResponse = await axios.get("http://localhost:5000/api/students", {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Refetched students:", fetchResponse.data);
            setStudents(fetchResponse.data);
          };
          await fetchStudents();
          console.log(`Successfully deleted student with ID: ${id}`);
        } else {
          console.error("No token found for delete operation");
          setError("Authentication failed. Please log in again.");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        if (error instanceof AxiosError) {
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Status code:", error.response.status);
            console.error("Response headers:", error.response.headers);
            setError(`Delete failed: ${error.response.data.error || error.response.statusText}`);
          } else if (error.request) {
            console.error("No response received. Request details:", error.request);
            setError("No response from server. Check your connection.");
          } else {
            console.error("Error setting up request:", error.message);
            setError("An unexpected error occurred.");
          }
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred.");
        }
      }
    }
  };

  const handleUpdate = (id: number) => {
    console.log(`Navigate to update page for student ID: ${id}`);
    navigate(`/update-student/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Manage Students</h1>
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-12 h-12 bg-[#FF7700] text-white rounded-full shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-110"
            aria-label="Back to Admin Dashboard"
          >
            <FaArrowLeft className="text-xl" />
          </button>
        </div>
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg shadow-md">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
            {error}
          </div>
        )}
        <div className="bg-white rounded-xl shadow-2xl p-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <FaSpinner className="animate-spin text-4xl text-[#FF7700]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-[#FF7700] to-orange-500 text-white">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Student ID</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Phone</th>
                    <th className="p-4 font-semibold">Address</th>
                    <th className="p-4 font-semibold">Start Date</th>
                    <th className="p-4 font-semibold">End Date</th>
                    <th className="p-4 font-semibold">Course</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">{student.name}</td>
                      <td className="p-4">{student.studentId}</td>
                      <td className="p-4">{student.email}</td>
                      <td className="p-4">{student.phone}</td>
                      <td className="p-4">{student.address}</td>
                      <td className="p-4">{student.startDate}</td>
                      <td className="p-4">{student.endDate}</td>
                      <td className="p-4">{student.course}</td>
                      <td className="p-4 flex space-x-2">
                        <button
                          onClick={() => handleUpdate(student.id)}
                          className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && (
                <p className="text-center text-gray-500 py-6">No students registered.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageStudentsPage;