import { use } from 'react';
import { AuthContext } from '@/contexts/firebaseContext';
// import {AuthContext} from "contexts/auth0Context";
// import { AuthContext } from "contexts/firebaseContext";

export default function useAuth() {
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}