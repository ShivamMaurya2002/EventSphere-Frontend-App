import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '/src/assets/css/EventDetail.css';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  // Default sample events
  const defaultEvents = [
    {
      id: 1,
      title: "Music Fest 2025",
      date: "2025-10-20",
      location: "Mumbai",
      category: "Music",
      capacity: 200,
      attendees: 150,
      revenue: 400,
      description: "Groove with top artists and DJs at Mumbai's biggest music night.",
      isDefault: true
    },
    {
      id: 2,
      title: "FutureStack Tech Summit",
      date: "2025-11-05",
      location: "Bengaluru",
      category: "Technology",
      capacity: 500,
      attendees: 380,
      revenue: 1200,
      description: "India's premier conference on AI, ML, and Cloud infrastructure with global speakers.",
      isDefault: true
    },
    {
      id: 3,
      title: "The Great Indian Food Carnival",
      date: "2025-12-15",
      location: "Delhi",
      category: "Food",
      capacity: 1000,
      attendees: 920,
      revenue: 850,
      description: "A culinary journey featuring authentic Indian street food and gourmet dishes from various states.",
      isDefault: true
    }
  ];

  useEffect(() => {
    // Fetch events from localStorage
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];

    // Merge default and stored events
    const mergedEvents = [...defaultEvents];
    storedEvents.forEach(stored => {
      const index = mergedEvents.findIndex(e => e.id === stored.id);
      if (index > -1) {
        mergedEvents[index] = { ...stored, isDefault: false };
      } else {
        mergedEvents.push(stored);
      }
    });

    // Find event by ID
    const foundEvent = mergedEvents.find(e => e.id === Number(id));
    if (foundEvent) {
      const seatsLeft =
        foundEvent.seatsLeft !== undefined
          ? foundEvent.seatsLeft
          : foundEvent.capacity - (foundEvent.attendees || 0);

      setEvent({ ...foundEvent, seatsLeft });
    } else {
      setEvent(null);
    }
  }, [id]);

  // --- UPDATED Framer Motion Variants for Smooth Upward Transition ---
  const pageVariants = {
    initial: { opacity: 0, y: 30 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -30 }
  };

  // Card Transition: Subtle pop-in for the detail card, slightly slower.
  const cardVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.6, ease: "easeInOut" } }
  };

  if (!event) {
    return (
      <motion.div
        className="Event-Detail"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{ duration: 0.6 }}
      >
        <div className="event-card not-found">
          <h2 className="event-title">Event Not Found</h2>
          <Link to="/events" className="btn btn-primary">Back to Events</Link>
        </div>
      </motion.div>
    );
  }

  // Determine if the Register/Sold Out button should be shown
  const showRegisterButton = !event.isDefault;

  return (
    // 1. Page-level motion.div for a smooth slide-up effect
    <motion.div
      className="Event-Detail"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.6 }}
    >
      {/* 2. Card-level motion.div for a subtle pop-in effect */}
      <motion.div
        className="event-card event-detail-card"
        initial="initial"
        animate="animate"
        variants={cardVariants}
      >
        <h1>{event.title}</h1>
        <p><b>📅 Event Date:</b> {event.date}</p>
        <p><b>📍 Event Location:</b> {event.location}</p>
        <p><b>🏷️ Event Category:</b> {event.category}</p>
        <p><b>💺 Total Seats For This Event:</b> {event.capacity}</p>
        <p><b>👥 Total Registered Seats:</b> {event.attendees || 0}</p>
        <p><b>🪑 Total Seats Left:</b> {event.seatsLeft}</p>
        <p><b>💰 Total Revenue Per Event:</b> ₹{event.revenue || 0}</p>
        <p className="p"><b>📝 Description:</b> {event.description}</p>

        {/* Conditional rendering for Register/Sold Out button */}
        {showRegisterButton && (
          (event.seatsLeft > 0) ? (
            <Link to={`/register/${event.id}`} className="register">
              Register Now
            </Link>
          ) : (
            <button disabled className="btn btn-primary">
              Sold Out
            </button>
          )
        )}

        <Link to="/events" className="back">
          Back to Event
        </Link>
      </motion.div>
    </motion.div>
  );
}