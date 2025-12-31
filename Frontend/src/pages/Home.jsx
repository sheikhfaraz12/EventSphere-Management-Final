import React from 'react';
import { HeroSection } from '../components/HeroSection';

export default function Home({ setCurrentPage, user }) {
  // user object: null (not logged in) or {role: 'attendee'|'exhibitor'|'admin'}
  return <HeroSection setCurrentPage={setCurrentPage} user={user} />;
}
