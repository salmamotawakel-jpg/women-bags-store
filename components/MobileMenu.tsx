"use client";

import {   AlignJustify } from 'lucide-react'
import React, { useState } from 'react'
import SideMenu from './SideMenu';

const MobileMenu = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
       <button onClick={()=> setIsSidebarOpen(!isSidebarOpen)}>
          <AlignJustify className="h-5 w-5 hover:text-darkColor hoverEffect md:hidden hover:cursor-pointer" />
       </button>
    <div className=" md:hidden">
         <SideMenu
         isOpen={isSidebarOpen}
         onClose={() => setIsSidebarOpen(false)}
          />
    </div>
    </>
  )
}

export default MobileMenu