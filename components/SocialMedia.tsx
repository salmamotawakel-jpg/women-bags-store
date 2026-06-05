import { Facebook, Instagram,  Youtube,  } from 'lucide-react';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa'
import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import Link from 'next/link';


interface Props {
    className?: string;
    iconClassName?: string;
    tooltipClassName?: string;
}

const socialLink = [
  
    {
        title: "Facebook",
        href: "https:/www.youtube.com/@reactjsBD",
        icon: <Facebook className="w-5 h-5" />
    },
    {
        title: "Instagram",
        href: "https:/www.youtube.com/@reactjsBD",
        icon: <Instagram className="w-5 h-5" />
    },
    {
        title: "Yotube",
        href: "https:/www.youtube.com/@reactjsBD",
        icon: <Youtube className="w-5 h-5" />
    },
    {
        title: "Tiktok",
        href: "https:/www.youtube.com/@reactjsBD",
        icon: <FaTiktok className="w-5 h-5" />
    },
    {
        title: "Whatsapp",
        href: "https:/www.youtube.com/@reactjsBD",
        icon: <FaWhatsapp className="w-5 h-5" />
    },
    
];



const SocialMedia = ({className,iconClassName,tooltipClassName}:Props) => {
  return <TooltipProvider>
        <div className={cn(" flex items-center gap-3.5",
            className
        )}>
            {socialLink?.map((item)=> (
                <Tooltip key={item?.title}>
                <TooltipTrigger asChild>
                    <Link key={item?.title} href={item?.href}
                    className={cn(" p-2 border rounded-full hover:text-white hover:border-shop_light_green hoverEffect", iconClassName)}>
                       {item?.icon}
                    </Link>
                </TooltipTrigger>
                <TooltipContent className={cn(" bg-white text-darkColor font-semibold",tooltipClassName)}>
                    {item?.title}
                </TooltipContent>
                </Tooltip>
            ))}
        </div>
  </TooltipProvider>
};

export default SocialMedia