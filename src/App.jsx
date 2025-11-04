import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Events from './pages/EventListing'
import EventDetails from './pages/EventDetail'
import Dashboard from './pages/Dashboard'
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterForEvent from "./pages/RegisterForEvent";
import PrivateRoute from './routes/AppRoutes'

function App() {
  return (
    <>
      <Navbar />

      <main style={{ paddingTop: '0px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute role="organizer">
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/dashboard/create" element={
            <PrivateRoute role="organizer"><CreateEvent /></PrivateRoute>
          } />
          <Route path="/dashboard/edit/:id" element={
            <PrivateRoute role="organizer"><EditEvent /></PrivateRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/:id" element={<RegisterForEvent />} />
            <Route path="/CreateEvent" element={<CreateEvent />} />
        </Routes>
      </main>
    </>
  )
}

export default App
