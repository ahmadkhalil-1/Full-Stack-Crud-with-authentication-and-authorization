import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/auth/reset-password/${id}/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: formData.password }),
      });

      const data = await response.json();
      alert(data.message);
      navigate('/login');

    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-500 to-orange-600">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange} // ✅ Handle input change
              placeholder="Enter new password"
              className="w-full p-3 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange} // ✅ Handle input change
              placeholder="Confirm new password"
              className="w-full p-3 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          <button type="submit" className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition">Reset Password</button>
        </form>
      </div>
    </div>
  );
};
