"use client";
import { useEffect } from 'react';
import { initAnalytics } from '@/lib/firebase/client';

export function AnalyticsInit() {
  useEffect(() => { initAnalytics(); }, []);
  return null;
}
