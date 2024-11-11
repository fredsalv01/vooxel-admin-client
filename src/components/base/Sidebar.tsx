import React from 'react';
import { Button, Spacer } from '@nextui-org/react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, children }) => {
  return (
    <aside
      style={{
        width: isOpen ? '300px' : '0px',
        height: '100vh',
        backgroundColor: '#1A1A1A',
        color: '#FFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isOpen ? '1rem' : '0rem',
        transition: 'width 0.3s',
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 9999,
        overflow: 'hidden',
        
      }}
    >
      {/* Sidebar Toggle Button */}
      <Button
        onClick={toggleSidebar}
        style={{ 
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateX(0)' : 'translateX(50px)',
            transition: 'opacity 0.3s, transform 0.3s',
            pointerEvents: isOpen ? 'auto' : 'none', // Disables click when hidden
        }}
      > Cerrar
      </Button>
      <Spacer y={1} />

      {/* Sidebar Content */}
      {isOpen && (
        <div style={{ 
          width: '100%',
          textAlign: 'center',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateX(0)' : 'translateX(50px)',
          transition: 'opacity 0.3s, transform 0.3s',
        }}>
          {children}
        </div>
      )}
    </aside>
  );
};
