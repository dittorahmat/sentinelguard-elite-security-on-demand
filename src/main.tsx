import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'

const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const BookingPage = lazy(() => import('@/pages/BookingPage').then(m => ({ default: m.BookingPage })))
const PersonnelPage = lazy(() => import('@/pages/PersonnelPage').then(m => ({ default: m.PersonnelPage })))
const CommandCenterPage = lazy(() => import('@/pages/CommandCenterPage').then(m => ({ default: m.CommandCenterPage })))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-400 font-mono text-sm uppercase tracking-widest animate-pulse">Loading...</p>
    </div>
  </div>
)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/book",
    element: <Suspense fallback={<PageLoader />}><BookingPage /></Suspense>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/personnel",
    element: <Suspense fallback={<PageLoader />}><PersonnelPage /></Suspense>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/command-center",
    element: <Suspense fallback={<PageLoader />}><CommandCenterPage /></Suspense>,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)