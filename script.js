// script.js
$(document).ready(function() {
    const menuData = [
        {
            icon: "fas fa-book",
            text: "Knowledge",
            url: "https://www.google.com" // GANTI DENGAN URL YANG SESUAI
        },
        {
            icon: "fas fa-car",
            text: "Check",
            url: "https://www.bing.com" // GANTI DENGAN URL YANG SESUAI
        },
        {
            icon: "fas fa-chart-line",
            text: "Dashboard",
            url: "https://www.example.com/dashboard" // GANTI DENGAN URL YANG SESUAI
        },
        {
            icon: "fas fa-envelope",
            text: "Contact",
            url: "https://www.duckduckgo.com" // GANTI DENGAN URL YANG SESUAI
        },
        {
            icon: "fas fa-user-circle",
            text: "Profil",
            url: "https://www.example.com/profile" // GANTI DENGAN URL YANG SESUAI
        },
        {
            icon: "fas fa-cogs",
            text: "Settings",
            url: "https://www.yahoo.com" // GANTI DENGAN URL YANG SESUAI
        },
        
        {
            icon: "fas fa-calendar-days",
            text: "Schedule",
            url: "https://www.google.com" // GANTI DENGAN URL YANG SESUAI
        },
        {
            icon: "fas fa-cart-shopping",
            text: "Shop",
            url: "https://www.bing.com" // GANTI DENGAN URL YANG SESUAI
        },
        {
            icon: "fas fa-truck",
            text: "Delivery",
            url: "https://www.example.com/dashboard" // GANTI DENGAN URL YANG SESUAI
        },
        {
            icon: "fas fa-screwdriver-wrench",
            text: "Services",
            url: "https://www.duckduckgo.com" // GANTI DENGAN URL YANG SESUAI
        },
        {
            icon: "fas fa-droplet",
            text: "Oil",
            url: "https://www.example.com/profile" // GANTI DENGAN URL YANG SESUAI
        },
        {
            icon: "fas fa-car-battery",
            text: "Battery",
            url: "https://www.yahoo.com" // GANTI DENGAN URL YANG SESUAI
        },
        
        {
            icon: "fas fa-cloud",
            text: "Cloud Services",
            url: "https://www.yahoo.com" // GANTI DENGAN URL YANG SESUAI
        },
        {
            icon: "fas fa-shield-halved",
            text: "Protection",
            url: "https://www.yahoo.com" // GANTI DENGAN URL YANG SESUAI
        }
    ];

    const menuPanel = $('#menuPanel');

    menuData.forEach(item => {
        const menuItemHtml = `
            <div class="col-6 col-md-4 col-lg-2"> <a href="${item.url}" class="menu-item d-flex flex-column justify-content-center align-items-center">
                    <i class="icon ${item.icon}"></i>
                    <span class="text">${item.text}</span>
                </a>
            </div>
        `;
        
        menuPanel.append(menuItemHtml);
    });

    menuPanel.on('click', '.menu-item', function(event) {
        const url = $(this).attr('href');
        // window.location.href = url; // Navigasi ke URL
    });
});
