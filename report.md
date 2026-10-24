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