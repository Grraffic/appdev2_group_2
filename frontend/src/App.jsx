import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CalendarDays,
  Clock,
  User,
  Pencil,
  Trash2,
  CheckCircle,
} from "lucide-react";

export default function AppointmentApp() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    status: "Pending",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/appointments");
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/appointments/${editingId}`,
          form
        );
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/appointments", form);
      }
      setForm({ name: "", date: "", time: "", status: "Pending" });
      fetchAppointments();
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
  };

  const handleEdit = (appt) => {
    setForm({
      name: appt.name,
      date: appt.date,
      time: appt.time,
      status: appt.status,
    });
    setEditingId(appt._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 font-sans bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">
            📅 Appointment Scheduler
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Manage your schedule with ease and precision
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-2xl space-y-4"
        >
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Client name"
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900/50 hover:border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900/50 hover:border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900/50 hover:border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900/50 hover:border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200"
            >
              <option className="bg-gray-800">Pending</option>
              <option className="bg-gray-800">Confirmed</option>
              <option className="bg-gray-800">Completed</option>
            </select>
          </div>

          <button
            type="submit"
            className={`mt-4 w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
              editingId
                ? "bg-yellow-400/90 hover:bg-yellow-500 text-gray-900"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            } shadow-lg hover:shadow-xl active:scale-[0.98]`}
          >
            {editingId ? "Update Appointment" : "Add Appointment"}
          </button>
        </form>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
              📅
            </span>
            Upcoming Appointments
          </h2>

          {appointments.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-gray-500 font-medium">No appointments found</p>
              <p className="text-sm text-gray-600">
                Add an appointment to get started
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-700/50">
              {appointments.map((appt) => (
                <li
                  key={appt._id}
                  className="py-4 px-3 hover:bg-gray-700/20 rounded-lg transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="text-blue-400" size={20} />
                        <p className="text-lg font-medium text-white">
                          {appt.name}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-300 bg-gray-700/30 px-3 py-1 rounded-full">
                          <CalendarDays className="text-green-400" size={16} />
                          {appt.date}
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 bg-gray-700/30 px-3 py-1 rounded-full">
                          <Clock className="text-indigo-400" size={16} />
                          {appt.time}
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 bg-gray-700/30 px-3 py-1 rounded-full">
                          <CheckCircle className="text-yellow-400" size={16} />
                          {appt.status}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(appt)}
                        className="p-2 rounded-lg hover:bg-yellow-500/10 text-yellow-500 hover:text-yellow-400 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(appt._id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
