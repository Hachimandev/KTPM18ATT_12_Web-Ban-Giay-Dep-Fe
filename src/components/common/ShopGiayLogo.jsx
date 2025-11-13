import React from 'react';

const SvgLogo = ({ className = "w-7 h-6", color = "#F97316" }) => (
    <svg className={className} viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_4_1308)">
            <path d="M19.5 0C16.5141 0 12 1.5 12 1.5V7.5C14.25 7.5 15.5625 8.25 16.875 9C18.1875 9.75 19.5 10.5 21.75 10.5C24.3938 10.5 30 9.75 30 6C30 2.25 24 0 19.5 0ZM6 4.5C6 6.15469 7.34531 7.5 9 7.5H10.5V1.5H9C7.34531 1.5 6 2.84531 6 4.5ZM13.5 24C18 24 24 21.75 24 18C24 14.25 18.3938 13.5 15.75 13.5C13.5 13.5 12.1875 14.25 10.875 15C9.5625 15.75 8.25 16.5 6 16.5V22.5C6 22.5 10.5141 24 13.5 24ZM0 19.5C0 21.1547 1.34531 22.5 3 22.5H4.5V16.5H3C3 16.5 0 17.8453 0 19.5Z" fill={color} />
        </g>
        <defs>
            <clipPath id="clip0_4_1308">
                <path d="M0 0H30V24H0V0Z" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

const ShopGiayLogo = ({ size = "text-2xl", color = "text-black" }) => (
    <div className={`flex items-center gap-2 ${size} font-bold ${color}`}>
        <SvgLogo className="w-7 h-6" color="#F97316" />
        ShopGiay
    </div>
);

export default ShopGiayLogo;