import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EventsPage from './pages/EventsPage/EventsPage';
import BookingsPage from './pages/BookingsPage/BookingsPage';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user } = useAuth();

  const renderPage = () => {
    switch(currentPage){
      case 'home': return <Home setCurrentPage={setCurrentPage}/>;
      case 'login': return <Login setCurrentPage={setCurrentPage}/>;
      case 'signup': return <Signup setCurrentPage={setCurrentPage}/>;
      case 'events': return <EventsPage />;
      case 'bookings': return <BookingsPage />;
      case 'admin': return user?.role==='admin' ? <AdminPanel /> : <h1>Access Denied</h1>;
      default: return <Home setCurrentPage={setCurrentPage}/>;
    }
  }

  return (
    <>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
