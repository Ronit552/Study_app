
import React from 'react';
import Button from '../ui/Button';
import ModeToggle from '../ui/ModeToggle';
import Icon from '../shared/Icon';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
                        <Icon name="Menu" className="h-6 w-6" />
                    </Button>
                </div>
                <div className="flex items-center space-x-2">
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
};

export default Header;
