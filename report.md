controllers/ → handle HTTP requests/responses
routes/      → define API endpoints
services/    → business/database logic
lib/         → shared utilities, including Prisma client






{
    "root": {
        "props": {
            "title": "Untitled Page",
            "backgroundColor": "#ffffff",
            "backgroundGradient": false,
            "gradientFrom": "#ffffff",
            "gradientTo": "#f8fafc",
            "contentWidth": "100%",
            "fontFamily": "inherit"
        }
    },
    "content": [
        {
            "type": "Navbar",
            "props": {
                "bannerText": "🚀 Discover our newly engineered agency templates →",
                "bannerBg": "#4f46e5",
                "bannerTextColor": "#ffffff",
                "logoText": "STUDIO NOVA",
                "logoUrl": "",
                "logoWidth": 140,
                "links": [
                    {
                        "label": "Home",
                        "href": "/",
                        "badge": ""
                    },
                    {
                        "label": "Services",
                        "href": "#services",
                        "badge": ""
                    },
                    {
                        "label": "Showcase",
                        "href": "#work",
                        "badge": "HOT"
                    },
                    {
                        "label": "Pricing",
                        "href": "#pricing",
                        "badge": ""
                    },
                    {
                        "label": "Contact",
                        "href": "#contact",
                        "badge": ""
                    }
                ],
                "headerMode": "sticky",
                "backgroundColor": "#ffffff",
                "textColor": "#0f172a",
                "linkColor": "#334155",
                "hoverColor": "#4f46e5",
                "showSearch": false,
                "showCTA": true,
                "ctaLabel": "Get Started",
                "ctaHref": "#signup",
                "ctaBg": "#0f172a",
                "ctaColor": "#ffffff",
                "borderBottom": true,
                "borderColor": "#e2e8f0",
                "animTrigger": "none",
                "animPreset": "none",
                "animLoop": "none",
                "animDuration": 500,
                "animDelay": 0,
                "animEasing": "cubic-bezier(0.16, 1, 0.3, 1)",
                "id": "Navbar-315600e4-f75b-4101-9239-ca44d19a7b55"
            }
        },
        {
            "type": "Section",
            "props": {
                "content": [],
                "maxWidth": "1240px",
                "paddingY": "64px",
                "paddingX": "24px",
                "backgroundColor": "#ffffff",
                "backgroundGradient": false,
                "gradientAngle": 180,
                "gradientFrom": "#ffffff",
                "gradientTo": "#f8fafc",
                "backgroundImage": "",
                "overlayColor": "#000000",
                "overlayOpacity": 0,
                "borderBottom": false,
                "borderColor": "#e5e7eb",
                "animTrigger": "none",
                "animPreset": "none",
                "animLoop": "none",
                "animDuration": 500,
                "animDelay": 0,
                "animEasing": "cubic-bezier(0.16, 1, 0.3, 1)",
                "id": "Section-c48c082e-28ca-4df5-8b44-722fe7ab2025"
            }
        }
    ],
    "zones": {}
}




{
    "id": "cmvm6lfaw000205l0e45u8d1v",
    "name": "2nd- portfolio",
    "slug": "2nd-portfolio-mvm6lfav",
    "description": "portfolio template 2",
    "globalLayout": null,
    "category": "portfolio 2",
    "categoryId": "cmvm6jvlf000005l0vsx4br6i",
    "thumbnail": null,
    "status": "DRAFT",
    "publishedAt": null,
    "createdAt": "2026-10-24T09:13:15.704Z",
    "updatedAt": "2026-10-25T19:56:57.392Z",
    "theme": null,
    "websiteCategory": {
        "id": "cmvm6jvlf000005l0vsx4br6i",
        "name": "portfolio 2",
        "slug": "portfolio-2",
        "description": "portfolio",
        "icon": "black",
        "thumbnail": null,
        "isActive": true,
        "sortOrder": 7,
        "createdAt": "2026-10-24T09:12:03.199Z",
        "updatedAt": "2026-10-24T09:12:03.199Z"
    },
    "pages": [
        {
            "id": "cmvm6lfaw000305l0kkz3fxrg",
            "name": "Home",
            "slug": "home",
            "order": 0,
            "templateId": "cmvm6lfaw000205l0e45u8d1v",
            "editorData": {
                "root": {
                    "props": {
                        "title": "Untitled Page",
                        "fontFamily": "inherit",
                        "gradientTo": "#f8fafc",
                        "contentWidth": "100%",
                        "gradientFrom": "#ffffff",
                        "backgroundColor": "#ffffff",
                        "backgroundGradient": false
                    }
                },
                "zones": {},
                "content": [
                    {
                        "type": "Navbar",
                        "props": {
                            "id": "Navbar-315600e4-f75b-4101-9239-ca44d19a7b55",
                            "ctaBg": "#0f172a",
                            "links": [
                                {
                                    "href": "/",
                                    "badge": "",
                                    "label": "Home"
                                },
                                {
                                    "href": "#services",
                                    "badge": "",
                                    "label": "Services"
                                },
                                {
                                    "href": "#work",
                                    "badge": "HOT",
                                    "label": "Showcase"
                                },
                                {
                                    "href": "#pricing",
                                    "badge": "",
                                    "label": "Pricing"
                                },
                                {
                                    "href": "#contact",
                                    "badge": "",
                                    "label": "Contact"
                                }
                            ],
                            "ctaHref": "#signup",
                            "logoUrl": "",
                            "showCTA": true,
                            "animLoop": "none",
                            "bannerBg": "#4f46e5",
                            "ctaColor": "#ffffff",
                            "ctaLabel": "Get Started",
                            "logoText": "STUDIO NOVA",
                            "animDelay": 0,
                            "linkColor": "#334155",
                            "logoWidth": 140,
                            "textColor": "#0f172a",
                            "animEasing": "cubic-bezier(0.16, 1, 0.3, 1)",
                            "animPreset": "none",
                            "bannerText": "🚀 Discover our newly engineered agency templates →",
                            "headerMode": "sticky",
                            "hoverColor": "#4f46e5",
                            "showSearch": false,
                            "animTrigger": "none",
                            "borderColor": "#e2e8f0",
                            "animDuration": 500,
                            "borderBottom": true,
                            "backgroundColor": "#ffffff",
                            "bannerTextColor": "#ffffff"
                        }
                    },
                    {
                        "type": "Section",
                        "props": {
                            "id": "Section-c48c082e-28ca-4df5-8b44-722fe7ab2025",
                            "content": [],
                            "animLoop": "none",
                            "maxWidth": "1240px",
                            "paddingX": "24px",
                            "paddingY": "64px",
                            "animDelay": 0,
                            "animEasing": "cubic-bezier(0.16, 1, 0.3, 1)",
                            "animPreset": "none",
                            "gradientTo": "#f8fafc",
                            "animTrigger": "none",
                            "borderColor": "#e5e7eb",
                            "animDuration": 500,
                            "borderBottom": false,
                            "gradientFrom": "#ffffff",
                            "overlayColor": "#000000",
                            "gradientAngle": 180,
                            "overlayOpacity": 0,
                            "backgroundColor": "#ffffff",
                            "backgroundImage": "",
                            "backgroundGradient": false
                        }
                    }
                ]
            },
            "sections": []
        }
    ]
}

















{
    "id": "cmvld1nbv000305q0gp2hu1xh",
    "name": "Home",
    "slug": "home",
    "order": 0,
    "editorData": {
        "root": {
            "props": {
                "title": "Untitled Page",
                "fontFamily": "inherit",
                "gradientTo": "#f8fafc",
                "contentWidth": "100%",
                "gradientFrom": "#ffffff",
                "backgroundColor": "#ffffff",
                "backgroundGradient": false
            }
        },
        "zones": {},
        "content": [
            {
                "type": "Navbar",
                "props": {
                    "id": "Navbar-fe5d0271-4f0c-4ca6-b3a3-675aa71c05a9",
                    "ctaBg": "#0f172a",
                    "links": [
                        {
                            "href": "/",
                            "badge": "",
                            "label": "Home"
                        },
                        {
                            "href": "#services",
                            "badge": "",
                            "label": "Services"
                        },
                        {
                            "href": "#work",
                            "badge": "HOT",
                            "label": "Showcase"
                        },
                        {
                            "href": "#contact",
                            "badge": "",
                            "label": "Contact"
                        }
                    ],
                    "ctaHref": "#signup",
                    "logoUrl": "https://img-cdn.publive.online/fit-in/1200x675/filters:format(webp)/afaqs/media/post_attachments/c9d7799868e9d5111913aa57ea7ba80c16bdb82d2d81d497b656f0173dcef7cd.jpg",
                    "showCTA": true,
                    "animLoop": "none",
                    "bannerBg": "#68ac69",
                    "ctaColor": "#ffffff",
                    "ctaLabel": "Get Started",
                    "logoText": "STUDIO NOVA",
                    "animDelay": 0,
                    "linkColor": "#334155",
                    "logoWidth": 123,
                    "textColor": "#0f172a",
                    "animEasing": "cubic-bezier(0.16, 1, 0.3, 1)",
                    "animPreset": "none",
                    "bannerText": "🚀 Discover our newly engineered agency templates →",
                    "headerMode": "sticky",
                    "hoverColor": "#4f46e5",
                    "showSearch": false,
                    "animTrigger": "none",
                    "borderColor": "#e2e8f0",
                    "animDuration": 500,
                    "borderBottom": true,
                    "backgroundColor": "#ffffff",
                    "bannerTextColor": "#ffffff"
                }
            },
            {
                "type": "Hero",
                "props": {
                    "id": "Hero-f87103ca-b735-4583-9e4a-68ef1d3d62b6",
                    "title": "Digital Products Built for Ambitious Brands",
                    "layout": "centered",
                    "eyebrow": "NEXT GENERATION WEB EXPERIENCES",
                    "animLoop": "none",
                    "imageAlt": "Digital platform dashboard",
                    "imageUrl": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
                    "paddingY": 96,
                    "animDelay": 0,
                    "textColor": "#ffffff",
                    "animEasing": "cubic-bezier(0.16, 1, 0.3, 1)",
                    "animPreset": "none",
                    "gradientTo": "#131b2e",
                    "imageWidth": 48,
                    "accentColor": "#6366f1",
                    "animTrigger": "none",
                    "description": "We architect, design, and engineer high-performance platforms that transform industry standards and convert visitors into loyal advocates.",
                    "ratingsText": "4.95 / 5 from 3,400+ satisfied builders",
                    "showRatings": true,
                    "animDuration": 500,
                    "borderRadius": 0,
                    "gradientFrom": "#090d16",
                    "overlayOpacity": 70,
                    "backgroundColor": "#090d16",
                    "backgroundImage": "https://static.vecteezy.com/system/resources/thumbnails/069/690/426/small/shopping-cart-filled-with-fresh-produce-bread-dairy-products-and-grocery-list-stands-in-well-lit-supermarket-aisle-showcasing-vibrant-selection-of-food-items-free-photo.jpeg",
                    "primaryButtonUrl": "#explore",
                    "primaryButtonText": "Explore Templates",
                    "backgroundGradient": true,
                    "secondaryButtonUrl": "#contact",
                    "secondaryButtonText": "Book Discovery Call",
                    "showSecondaryButton": true
                }
            },
            {
                "type": "ProductGrid",
                "props": {
                    "id": "ProductGrid-32c0d372-34a1-4690-86fd-f24c9d33b269",
                    "gap": "20px",
                    "cardBg": "#ffffff",
                    "layout": "row",
                    "badgeBg": "#0f172a",
                    "columns": "4",
                    "animLoop": "none",
                    "buttonBg": "#0f172a",
                    "imageFit": "cover",
                    "products": [
                        {
                            "name": "Product 1",
                            "badge": "25% OFF",
                            "price": "$120",
                            "rating": 5,
                            "inStock": "out-of-stock",
                            "category": "Ceramics",
                            "imageUrl": "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
                            "swatches": "#1e293b,#f1f5f9,#ca8a04",
                            "buttonUrl": "#product-1",
                            "buttonText": "Quick View",
                            "reviewsCount": 148,
                            "originalPrice": "$160"
                        },
                        {
                            "name": "Hand-Blown Smoked Glass Pendant",
                            "badge": "POPULAR",
                            "price": "$210",
                            "rating": 5,
                            "inStock": "in-stock",
                            "category": "Lighting",
                            "imageUrl": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
                            "swatches": "#334155,#f59e0b",
                            "buttonUrl": "#product-2",
                            "buttonText": "Quick View",
                            "reviewsCount": 94,
                            "originalPrice": ""
                        },
                        {
                            "name": "Solid White Oak Floating Bench",
                            "badge": "LIMITED",
                            "price": "$480",
                            "rating": 5,
                            "inStock": "low-stock",
                            "category": "Furniture",
                            "imageUrl": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
                            "swatches": "#d97706,#78350f,#1c1917",
                            "buttonUrl": "#product-3",
                            "buttonText": "Quick View",
                            "reviewsCount": 62,
                            "originalPrice": "$550"
                        },
                        {
                            "name": "Raw Terracotta Sculptural Vase",
                            "badge": "",
                            "price": "$95",
                            "rating": 4,
                            "inStock": "in-stock",
                            "category": "Ceramics",
                            "imageUrl": "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80",
                            "swatches": "#c2410c,#78350f",
                            "buttonUrl": "#product-4",
                            "buttonText": "Quick View",
                            "reviewsCount": 31,
                            "originalPrice": "$125"
                        },
                        {
                            "name": "Minimalist Stoneware Carafe",
                            "badge": "NEW",
                            "price": "$88",
                            "rating": 5,
                            "inStock": "in-stock",
                            "category": "Ceramics",
                            "imageUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
                            "swatches": "#0f172a,#d97706,#4f46e5",
                            "buttonUrl": "#shop",
                            "buttonText": "Add to Bag",
                            "reviewsCount": 38,
                            "originalPrice": "$110"
                        }
                    ],
                    "animDelay": 0,
                    "marginTop": "24px",
                    "starColor": "#f59e0b",
                    "animEasing": "cubic-bezier(0.16, 1, 0.3, 1)",
                    "animPreset": "none",
                    "cardRadius": 16,
                    "priceColor": "#0f172a",
                    "titleColor": "#0f172a",
                    "viewAllUrl": "#catalog",
                    "animTrigger": "loop",
                    "hoverEffect": "scale-sm",
                    "imageHeight": 240,
                    "showViewAll": true,
                    "viewAllText": "Browse Complete Catalog",
                    "animDuration": 500,
                    "marginBottom": "48px",
                    "sectionTitle": "Curated Seasonal Collection",
                    "badgeTextColor": "#ffffff",
                    "buttonTextColor": "#ffffff",
                    "cardBorderColor": "#e2e8f0",
                    "headerAlignment": "center",
                    "sectionSubtitle": "",
                    "filterCategories": "All, Ceramics, Lighting, Furniture, Accessories",
                    "originalPriceColor": "#94a3b8",
                    "showCategoryFilter": true
                }
            },
            {
                "type": "ProductGrid",
                "props": {
                    "id": "ProductGrid-857dd10c-53fd-41bf-8f9a-66ab52c17509",
                    "gap": "24px",
                    "cardBg": "#ffffff",
                    "layout": "grid",
                    "badgeBg": "#0f172a",
                    "columns": "4",
                    "animLoop": "none",
                    "buttonBg": "#0f172a",
                    "imageFit": "cover",
                    "products": [
                        {
                            "name": "Architectural Ceramic Vessel No. 04",
                            "badge": "25% OFF",
                            "price": "$120",
                            "rating": 5,
                            "inStock": "in-stock",
                            "category": "Ceramics",
                            "imageUrl": "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
                            "swatches": "#1e293b,#f1f5f9,#ca8a04",
                            "buttonUrl": "#product-1",
                            "buttonText": "Quick View",
                            "reviewsCount": 148,
                            "originalPrice": "$160"
                        },
                        {
                            "name": "Hand-Blown Smoked Glass Pendant",
                            "badge": "POPULAR",
                            "price": "$210",
                            "rating": 5,
                            "inStock": "in-stock",
                            "category": "Lighting",
                            "imageUrl": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
                            "swatches": "#334155,#f59e0b",
                            "buttonUrl": "#product-2",
                            "buttonText": "Quick View",
                            "reviewsCount": 94,
                            "originalPrice": ""
                        },
                        {
                            "name": "Solid White Oak Floating Bench",
                            "badge": "LIMITED",
                            "price": "$480",
                            "rating": 5,
                            "inStock": "low-stock",
                            "category": "Furniture",
                            "imageUrl": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
                            "swatches": "#d97706,#78350f,#1c1917",
                            "buttonUrl": "#product-3",
                            "buttonText": "Quick View",
                            "reviewsCount": 62,
                            "originalPrice": "$550"
                        },
                        {
                            "name": "Raw Terracotta Sculptural Vase",
                            "badge": "",
                            "price": "$95",
                            "rating": 4,
                            "inStock": "in-stock",
                            "category": "Ceramics",
                            "imageUrl": "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80",
                            "swatches": "#c2410c,#78350f",
                            "buttonUrl": "#product-4",
                            "buttonText": "Quick View",
                            "reviewsCount": 31,
                            "originalPrice": "$125"
                        }
                    ],
                    "animDelay": 0,
                    "marginTop": "24px",
                    "starColor": "#f59e0b",
                    "animEasing": "cubic-bezier(0.16, 1, 0.3, 1)",
                    "animPreset": "none",
                    "cardRadius": 16,
                    "priceColor": "#0f172a",
                    "titleColor": "#0f172a",
                    "viewAllUrl": "#catalog",
                    "animTrigger": "none",
                    "hoverEffect": "lift-md",
                    "imageHeight": 240,
                    "showViewAll": true,
                    "viewAllText": "Browse Complete Catalog",
                    "animDuration": 500,
                    "marginBottom": "48px",
                    "sectionTitle": "Curated Seasonal Collection",
                    "badgeTextColor": "#ffffff",
                    "buttonTextColor": "#ffffff",
                    "cardBorderColor": "#e2e8f0",
                    "headerAlignment": "left",
                    "sectionSubtitle": "Handcrafted architectural pieces designed for timeless living spaces.",
                    "filterCategories": "All, Ceramics, Lighting, Furniture, Accessories",
                    "originalPriceColor": "#94a3b8",
                    "showCategoryFilter": true
                }
            },
            {
                "type": "AnnouncementBar",
                "props": {
                    "id": "AnnouncementBar-d16e175a-9348-4045-a9ac-742288bd61bc",
                    "icon": "sparkles",
                    "text": "⚡ Special Offer: Unlock 20% off all annual platform subscriptions today.",
                    "animLoop": "none",
                    "closable": true,
                    "linkHref": "#pricing",
                    "linkText": "Claim Deal →",
                    "animDelay": 0,
                    "textColor": "#ffffff",
                    "animEasing": "cubic-bezier(0.16, 1, 0.3, 1)",
                    "animPreset": "none",
                    "animTrigger": "none",
                    "animDuration": 500,
                    "backgroundColor": "#0f172a"
                }
            },
            {
                "type": "Newsletter",
                "props": {
                    "id": "Newsletter-4c55bb2f-794e-4a05-b831-efe51a29f527",
                    "animLoop": "none",
                    "headline": "Stay Ahead of Digital Innovation",
                    "animDelay": 0,
                    "guarantee": "Zero spam. One-click unsubscribe anytime.",
                    "marginTop": "20px",
                    "animEasing": "cubic-bezier(0.16, 1, 0.3, 1)",
                    "animPreset": "none",
                    "buttonText": "Subscribe",
                    "accentColor": "#0f172a",
                    "animTrigger": "none",
                    "description": "Join 15,000+ engineers, designers, and founders getting our weekly architectural teardowns.",
                    "placeholder": "Enter your work email...",
                    "animDuration": 500,
                    "marginBottom": "24px"
                }
            },
            {
                "type": "PromoBanner",
                "props": {
                    "id": "PromoBanner-b1afb057-1ac3-45d7-b7bf-6ea2aa3af190",
                    "bgColor": "#10b981",
                    "subtext": "Use checkout code for instant savings across all featured creator assets.",
                    "animLoop": "none",
                    "buttonBg": "#ffffff",
                    "couponBg": "rgba(255, 255, 255, 0.2)",
                    "headline": "Spring Design Collection — Up to 35% Off",
                    "animDelay": 0,
                    "buttonUrl": "#catalog",
                    "marginTop": "16px",
                    "textColor": "#ffffff",
                    "animEasing": "cubic-bezier(0.16, 1, 0.3, 1)",
                    "animPreset": "none",
                    "buttonText": "Shop Collection",
                    "couponCode": "STUDIO35",
                    "animTrigger": "none",
                    "animDuration": 500,
                    "marginBottom": "24px",
                    "buttonTextColor": "#0f172a",
                    "couponBorderColor": "rgba(255, 255, 255, 0.4)"
                }
            },
            {
                "type": "Footer",
                "props": {
                    "id": "Footer-74db9559-2c07-4826-9a5a-c391b049ec18",
                    "logoUrl": "",
                    "animLoop": "none",
                    "animDelay": 0,
                    "brandName": "STUDIO NOVA",
                    "githubUrl": "https://github.com",
                    "linkColor": "#ffffff",
                    "marginTop": "64px",
                    "textColor": "#ffffff",
                    "animEasing": "cubic-bezier(0.16, 1, 0.3, 1)",
                    "animPreset": "none",
                    "navColumns": [
                        {
                            "title": "Product",
                            "link1Url": "#features",
                            "link2Url": "#templates",
                            "link3Url": "#integrations",
                            "link4Url": "#releases",
                            "link1Text": "Features",
                            "link2Text": "Templates",
                            "link3Text": "Integrations",
                            "link4Text": "Releases"
                        },
                        {
                            "title": "Company",
                            "link1Url": "#about",
                            "link2Url": "#careers",
                            "link3Url": "#press",
                            "link4Url": "#contact",
                            "link1Text": "About Us",
                            "link2Text": "Careers",
                            "link3Text": "Press Kit",
                            "link4Text": "Contact"
                        },
                        {
                            "title": "Resources",
                            "link1Url": "#docs",
                            "link2Url": "#community",
                            "link3Url": "#tutorials",
                            "link4Url": "#support",
                            "link1Text": "Documentation",
                            "link2Text": "Community",
                            "link3Text": "Tutorials",
                            "link4Text": "Support"
                        }
                    ],
                    "twitterUrl": "https://twitter.com",
                    "accentColor": "#ffffff",
                    "animTrigger": "none",
                    "description": "Crafting digital experiences with architectural precision, modular component engines, and unmatched creative speed.",
                    "linkedinUrl": "https://linkedin.com",
                    "animDuration": 500,
                    "marginBottom": "0px",
                    "copyrightText": "© 2026 Studio Nova Inc. All rights reserved.",
                    "borderTopColor": "#ffffff",
                    "showNewsletter": true,
                    "backgroundColor": "#10b981",
                    "newsletterHeadline": "Subscribe to architectural teardowns",
                    "newsletterPlaceholder": "Enter your email..."
                }
            }
        ]
    },
    "sections": []
}