
"use client";

import { X } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOutsideClick } from '../hooks';
import SocialMedia from './SocialMedia';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {

    const pathname = usePathname();
    const sidebarRef = useOutsideClick<HTMLDivElement>(onClose)
    const [animationStates, setAnimationStates] = useState<boolean[]>([]);

    const menuItems = [
        { name: 'Home', path: '/' },
        { name: 'Favorite', path: '/wishlist' },
        { name: 'Orders', path: '/orders' },
        { name: 'Contact', path: '/contact' },
    ];

    // عدد العناصر الكلي (menuItems + Social Media)
    const totalItems = menuItems.length + 1;

    useEffect(() => {
        if (isOpen) {
            setAnimationStates([]);
            for (let i = 0; i < totalItems; i++) {
                setTimeout(() => {
                    setAnimationStates(prev => {
                        const newStates = [...prev];
                        newStates[i] = true;
                        return newStates;
                    });
                }, i * 180);
            }
        } else {
            setAnimationStates([]);
        }
    }, [isOpen, totalItems]);

    return (
        <div className={`fixed inset-y-0 left-0 z-[100] w-full bg-gray-200/90 ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}>
            <div ref={sidebarRef} className="min-w-72 max-w-96 h-screen p-6 flex flex-col gap-6 bg-gray-100 shadow-xl">
                
                <div className="relative z-20 flex flex-col gap-8 h-full">
                    <div className="flex justify-end mt-8">
                        <button onClick={onClose} className="text-gray-700 hover:text-[#e49b8e] transition-colors duration-300">
                            <X size={28} className="drop-shadow-md" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        {menuItems.map((item, index) => {
                            
                            const isActive = pathname === item.path;
                            const isVisible = animationStates[index];
                            
                            return (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    onClick={onClose}
                                    className={`
                                        flex items-center gap-4 
                                        tracking-wide
                                        transition-all duration-300
                                        hover:text-[#e9abab] hover:translate-x-2
                                        ${isActive ? 'text-[#e8abab]' : 'text-gray-900'}
                                        transform
                                        ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}
                                        transition-all duration-500 ease-out
                                    `}
                                    style={{
                                        fontSize: '1.4rem',
                                        fontFamily: "'Dancing Script', 'cursive'",
                                        fontWeight: '500',
                                        letterSpacing: '0.01em',
                                        transitionDelay: `${index * 80}ms`
                                    }}
                                >
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                        
                        <div 
                            className="mt-2"
                            style={{
                                transform: animationStates[menuItems.length] ? 'translateX(0)' : 'translateX(-2rem)',
                                opacity: animationStates[menuItems.length] ? 1 : 0,
                                transition: 'all 0.5s ease-out',
                                transitionDelay: `${menuItems.length * 80}ms`
                            }}
                        >
                            <SocialMedia />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SideMenu;