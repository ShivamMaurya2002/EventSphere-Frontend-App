import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "/src/assets/css/Dashboard.css";

// Define general variants for components (slide up and fade in)
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Define variants for the stat cards to stagger their appearance
const statContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Dashboard() {
  const navigate = useNavigate();

  // Default fallback event
  const defaultEvents = [
    {
      id: 1,
      title: "Music Fest 2025",
      date: "2025-10-20",
      location: "Bangalore",
      category: "Music",
      capacity: 200,
      attendees: 150,
      seatsLeft: 50,
      revenue: 15000,
      description: "An electrifying music event featuring top artists!",
    },
  ];

  const [myEvents, setMyEvents] = useState([]);

  // ✅ Load data dynamically whenever localStorage changes
  useEffect(() => {
    const loadEvents = () => {
      const stored = JSON.parse(localStorage.getItem("events")) || [];
      if (stored.length === 0) {
        localStorage.setItem("events", JSON.stringify(defaultEvents));
        setMyEvents(defaultEvents);
      } else {
        setMyEvents(stored);
      }
    };

    loadEvents();

    // Listen for changes (works if event created in same tab or another tab)
    window.addEventListener("storage", loadEvents);

    // Clean-up listener on unmount
    return () => window.removeEventListener("storage", loadEvents);
  }, []);

  // Delete event
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = myEvents.filter((event) => event.id !== id);
      setMyEvents(updatedEvents);
      localStorage.setItem("events", JSON.stringify(updatedEvents));
    }
  };

  // Navigate actions
  const handleCreateEvent = () => navigate("/CreateEvent");
  const handleEdit = (id) => navigate(`/dashboard/edit/${id}`);

  // === Derived Stats ===
  const totalRevenue = myEvents.reduce(
    (sum, e) => sum + Number(e.revenue || 0),
    0
  );
  const totalAttendees = myEvents.reduce(
    (sum, e) => sum + Number(e.attendees || 0),
    0
  );

  // Chart Data 
  // Note: Only generate unique categories for Pie Chart
  const categoryRevenueMap = myEvents.reduce((acc, e) => {
    const category = e.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + Number(e.revenue || 0);
    return acc;
  }, {});

  const revenueData = Object.keys(categoryRevenueMap).map(key => ({
    name: key,
    value: categoryRevenueMap[key],
  }));

  const registrationsData = myEvents.map((e) => ({
    name: e.title,
    registrations: e.attendees,
  }));

  const attendanceTrendData = myEvents.map((e) => ({
    name: e.title,
    attendees: e.attendees,
    capacity: e.capacity,
  }));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00C49F"];

  // Determine Event Status 
  const getStatus = (event) => {
    const fillPercent = (event.attendees / event.capacity) * 100;
    if (fillPercent >= 100) return "full";
    if (fillPercent >= 80) return "almost-full";
    return "open";
  };

  return (
    // Outer motion div for full page transition
    <motion.div
      className="dashboard-container"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
      }}
    >
      {/* Header (quick fade) */}
      <motion.header
        className="dashboard-header"
        variants={fadeIn}
      >
        <h2>Organizer Dashboard</h2>
        <p>Manage your events, track performance, and view analytics.</p>
      </motion.header>

      {/* Stats Cards (staggered fade) */}
      <motion.div
        className="stats-boxes"
        variants={statContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div className="stat-card" variants={fadeIn}>
          <h3>Total Events</h3>
          <p className="stat-value">{myEvents.length}</p>
        </motion.div>
        <motion.div className="stat-card" variants={fadeIn}>
          <h3>Total Attendees</h3>
          <p className="stat-value">{totalAttendees}</p>
        </motion.div>
        <motion.div className="stat-card" variants={fadeIn}>
          <h3>Total Revenue (₹)</h3>
          <p className="stat-value">{totalRevenue.toLocaleString()}</p>
        </motion.div>
      </motion.div>

      {/* Event Table (slide in slightly later) */}
      <motion.div
        className="event-section"
        variants={fadeIn}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
      >
        <div className="event-header">
          <h3>My Events</h3>
          <button onClick={handleCreateEvent} className="create-btn">
            + Create Event
          </button>
        </div>

        <div className="table-responsive">
          <table className="event-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Seats</th>
                <th>Registered</th>
                <th>Seats Left</th>
                <th>Status</th> {/* Column header for status */}
                <th>Revenue (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myEvents.length > 0 ? (
                myEvents.map((event) => {
                  const status = getStatus(event); // Calculate status here
                  return (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{event.date}</td>
                      <td>{event.location}</td>
                      <td>{event.capacity}</td>
                      <td>{event.attendees}</td>
                      <td>{event.seatsLeft}</td>
                      <td>
                        {/* Display the calculated status */}
                        <span className={`status ${status}`}>
                          {status === "full"
                            ? "Full"
                            : status === "almost-full"
                              ? "Almost Full"
                              : "Open"}
                        </span>
                      </td>
                      <td>{Number(event.revenue || 0).toLocaleString()}</td>
                      <td className="actions">
                        <motion.button
                          className="edit-btn"
                          onClick={() => handleEdit(event.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          className="delete-btn"
                          onClick={() => handleDelete(event.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Delete
                        </motion.button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                    No events found...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Analytics Section (Slide in with a small delay) */}
      <motion.div
        className="analytics-section"
        variants={fadeIn}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.3 }}
      >
        <h3>📊Event Analytics</h3>

        {/* Charts Grid - Use staggering for individual charts */}
        <motion.div
          className="charts-grid"
          variants={statContainer} // Re-using statContainer for chart staggering
        >
          {/* Bar Chart - Registrations per Event */}
          <motion.div className="chart-card" variants={fadeIn}>
            <h4>Registrations per Event</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={registrationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={50} /> {/* Better label handling */}
                <YAxis />
                <Tooltip />
                <Bar dataKey="registrations" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart - Revenue by Category */}
          <motion.div className="chart-card" variants={fadeIn}>
            <h4>Revenue by Category</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={revenueData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {revenueData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Line Chart - Attendance Trends */}
          <motion.div className="chart-card" variants={fadeIn}>
            <h4>Attendance Trends</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={50} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendees" stroke="#82ca9d" name="Attendees" />
                <Line type="monotone" dataKey="capacity" stroke="#ff7300" name="Capacity" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}