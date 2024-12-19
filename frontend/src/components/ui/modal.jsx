import React, { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, children, darkMode }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`relative w-full max-w-md transform overflow-hidden rounded-lg p-6 text-left shadow-xl transition-all
            ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                >
                    {children}
                    <button
                        onClick={onClose}
                        className={`absolute top-4 right-4 p-2 rounded-full hover:bg-opacity-80
              ${darkMode ? 'hover:bg-gray-700 bg-gray-600' : 'hover:bg-gray-100'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};