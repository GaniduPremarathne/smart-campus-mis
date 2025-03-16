// src/pages/UpdateStudentPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const UpdateStudentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`http://localhost:5000/api/students/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Fetched student:", response.data);
          setStudent(response.data);
          setFormData(response.data);
        } else {
          setError("Authentication failed. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        setError("Failed to load student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication failed. Please log in again.");
        setSubmitting(false);
        return;
      }

      await axios.put(
        `http://localhost:5000/api/students/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/manage-students", { state: { success: "Student updated successfully!" } });
    } catch (error) {
      console.error("Error updating student:", error);
      if (error instanceof AxiosError) {
        if (error.response) {
          setError(`Update failed: ${error.response.data.error || error.response.statusText}`);
        } else if (error.request) {
          setError("No response from server. Check your connection.");
        } else {
          setError("An unexpected error occurred.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => navigate("/manage-students");

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
        <FaSpinner className="animate-spin text-4xl text-[#FF7700]" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
        <p className="text-gray-800 text-xl">Student not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6 text-gray-800">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Update Student Profile</h1>
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-12 h-12 bg-[#FF7700] text-white rounded-full shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-110"
            aria-label="Back to Manage Students"
          >
            <FaArrowLeft className="text-xl" />
          </button>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
            {error}
          </div>
        )}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7700] focus:border-[#FF7700] sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7700] focus:border-[#FF7700] sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7700] focus:border-[#FF7700] sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7700] focus:border-[#FF7700] sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7700] focus:border-[#FF7700] sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7700] focus:border-[#FF7700] sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                Course
              </label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#FF7700] focus:border-[#FF7700] sm:text-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2 rounded-lg text-white font-medium shadow-md transition-colors ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#FF7700] hover:bg-orange-600"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Updating...
                  </span>
                ) : (
                  "Update Student"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateStudentPage;