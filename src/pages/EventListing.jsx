import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "/src/assets/css/EventListing.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Default events
  const defaultEvents = [];

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    const allEvents = [...defaultEvents, ...storedEvents];
    setEvents(allEvents);
    setFilteredEvents(allEvents);

    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, []);

  const canCreateEvent =
    currentUser &&
    typeof currentUser.email === "string" &&
    currentUser.email.toLowerCase().endsWith(".org");

  // Apply Filters
  useEffect(() => {
    let temp = [...events];

    if (searchText.trim() !== "") {
      temp = temp.filter((ev) =>
        ev.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (categoryFilter) {
      temp = temp.filter((ev) => ev.category === categoryFilter);
    }

    if (locationFilter.trim() !== "") {
      temp = temp.filter((ev) =>
        ev.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      temp = temp.filter((ev) => ev.date === dateFilter);
    }

    setFilteredEvents(temp);
  }, [searchText, categoryFilter, locationFilter, dateFilter, events]);

  if (currentUser === undefined) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>;
  }

  return (
    <motion.div
      className="events-page container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Heading */}
      <motion.h2
        className="Heading-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Upcoming Events
      </motion.h2>

      {/* Filters Section */}
      <motion.div
        className="filters"
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <input
          type="text"
          placeholder="Search by title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Tech">Tech</option>
          <option value="Food">Food</option>
          <option value="Podcast">Podcast</option>
          <option value="Conference">Press Conference</option>
        </select>

        <input
          type="text"
          placeholder="Search by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </motion.div>

      {/* Event Cards */}
      <AnimatePresence mode="wait">
        {filteredEvents.length === 0 ? (
          <motion.div
            key="no-events"
            style={{ textAlign: "center", marginTop: "50px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2>No events found.</h2>
          </motion.div>
        ) : (
          <motion.div
            key="events-grid"
            className="card-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredEvents.map((ev, index) => (
              <motion.div
                key={ev.id}
                className="card event-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.03,
                  y: -4,
                  boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
                }}
              >
                <div className="card-body">
                  <h3>{ev.title}</h3>
                  <p>📅 <b>Date:</b> {ev.date}</p>
                  <p>📍 <b>Location:</b> {ev.location}</p>
                  <p>🏷️ <b>Category:</b> {ev.category}</p>
                  <p className="p">📝 <b>Description:</b> {ev.description}</p>

                  <Link to={`/events/${ev.id}`} className="btn btn-primary">
                    Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Event Button (only for .org users) */}
      {canCreateEvent && (
        <motion.div
          style={{ marginBottom: "40px", textAlign: "center" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/CreateEvent" className="btn btn-primary">
            Create New Event
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
