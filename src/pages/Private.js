import React from 'react';
import { useSelector } from 'react-redux';
import {  Navigate } from 'react-router-dom';

function Private({ component}) {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
 
  return isAuthenticated ? (
    <component/>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default Private;