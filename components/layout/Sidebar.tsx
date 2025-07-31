import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants';
import Icon from '../shared/Icon';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
    const { theme } = useTheme();

    const linkClasses = "flex items-center p-2 text-base font-normal rounded-lg transition-colors";
    const activeLinkClasses = theme === 'dark' ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900";
    const inactiveLinkClasses = "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700";

    return (
        <>
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 w-64 h-screen transition-transform md:translate-x-0",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-secondary">
                    <div className="flex items-center pl-2.5 mb-5">
                        <Icon name="Zap" className="h-8 w-8 mr-3 text-primary" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap text-foreground">
                            Focus Flow
                        </span>
                    </div>
                    <ul className="space-y-2">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.label}>
                                <NavLink
                                    to={item.href}
                                    className={({ isActive }) =>
                                        cn(linkClasses, isActive ? activeLinkClasses : inactiveLinkClasses)
                                    }
                                    onClick={() => (window.innerWidth < 768) && toggleSidebar()}
                                >
                                    <Icon name={item.icon as any} className="w-6 h-6 text-muted-foreground" />
                                    <span className="ml-3">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 dark:bg-gray-900/80 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
};

export default Sidebar;