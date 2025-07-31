
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import TimersPage from './pages/TimersPage';
import TasksPage from './pages/TasksPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import { TimerCategory } from './types';

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AppProvider>
                <MainApp />
            </AppProvider>
        </ThemeProvider>
    );
};

const MainApp: React.FC = () => {
    const { theme } = useTheme();

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    className: 'bg-card text-foreground border border-border',
                    duration: 3000,
                }}
            />
            <HashRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/timers" element={<TimersPage />} />
                        <Route path="/timers/study" element={<TimersPage initialCategory={TimerCategory.STUDY} />} />
                        <Route path="/timers/coding" element={<TimersPage initialCategory={TimerCategory.CODING} />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/history" element={<HistoryPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </Layout>
            </HashRouter>
        </>
    )
}

export default App;
