document.addEventListener('DOMContentLoaded', () => {
    // Language Handling
    const translations = {
        en: {
            "trendingHighlights": "Trending Highlights",
            "searchLinks": "Search links...",
            "digitalServices": "Digital Services",
            "entertainment": "Entertainment",
            "privacySecurity": "Privacy/Security",
            "financial": "Financial",
            "adultContent": "Adult Content",
            "utilities": "Utilities",
            "community": "Community"
        },
        de: {
            "trendingHighlights": "Trend-Highlights",
            "searchLinks": "Links suchen...",
            "digitalServices": "Digitale Dienste",
            "entertainment": "Unterhaltung",
            "privacySecurity": "Privatsphäre/Sicherheit",
            "financial": "Finanzen",
            "adultContent": "Inhalte für Erwachsene",
            "utilities": "Dienstprogramme",
            "community": "Gemeinschaft"
        },
        fr: {
            "trendingHighlights": "Tendances du moment",
            "searchLinks": "Rechercher des liens...",
            "digitalServices": "Services Numériques",
            "entertainment": "Divertissement",
            "privacySecurity": "Confidentialité/Sécurité",
            "financial": "Financier",
            "adultContent": "Contenu Adulte",
            "utilities": "Utilitaires",
            "community": "Communauté"
        },
        es: {
            "trendingHighlights": "Tendencias destacadas",
            "searchLinks": "Buscar enlaces...",
            "digitalServices": "Servicios Digitales",
            "entertainment": "Entretenimiento",
            "privacySecurity": "Privacidad/Seguridad",
            "financial": "Financiero",
            "adultContent": "Contenido para adultos",
            "utilities": "Utilidades",
            "community": "Comunidad"
        }
    };

    function setLanguage(lang) {
        localStorage.setItem('language', lang);
        document.documentElement.setAttribute('lang', lang);

        // Translate text
        document.querySelector('.hero h2').textContent = translations[lang]["trendingHighlights"];
        document.getElementById('search-input').placeholder = translations[lang]["searchLinks"];
        document.querySelector('[data-category="digital-services"] h2').textContent = translations[lang]["digitalServices"];
        document.querySelector('[data-category="entertainment"] h2').textContent = translations[lang]["entertainment"];
        document.querySelector('[data-category="privacy-security"] h2').textContent = translations[lang]["privacySecurity"];
        document.querySelector('[data-category="financial"] h2').textContent = translations[lang]["financial"];
        document.querySelector('[data-category="adult-content"] h2').textContent = translations[lang]["adultContent"];
        document.querySelector('[data-category="utilities"] h2').textContent = translations[lang]["utilities"];
        document.querySelector('[data-category="community"] h2').textContent = translations[lang]["community"];
    }

    document.querySelectorAll('nav button').forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.id;
            setLanguage(lang);
        });
    });

    const currentLanguage = localStorage.getItem('language') || 'en';
    setLanguage(currentLanguage);

    // Load links and trending data
    loadLinks();
    loadTrending();

    // Category Collapsing
    document.querySelectorAll('.category h2').forEach(header => {
        header.addEventListener('click', () => {
            const category = header.parentElement;
            const list = category.querySelector('ul');
            list.classList.toggle('show');
        });
    });

    // Search Functionality
    document.getElementById('search-input').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterLinks(searchTerm);
    });

    function filterLinks(searchTerm) {
        document.querySelectorAll('.category li').forEach(item => {
            const linkText = item.textContent.toLowerCase();
            if (linkText.includes(searchTerm)) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    }

    // Ad Redirection Logic - Redirect to ad simulation page
    function maybeRedirectToAd(event) {
        event.preventDefault(); // Prevent the original link from opening immediately
        const originalUrl = event.target.href; // Get the original URL

        if (Math.random() < 0.7) {
            fetch('ads.json')
                .then(response => response.json())
                .then(ads => {
                    const randomIndex = Math.floor(Math.random() * ads.length);
                    const adUrl = ads[randomIndex].url;
                    // Open the ad simulation page in a new tab, passing the original URL
                    window.open(`index.html?url=${encodeURIComponent(originalUrl)}`, '_blank');
                })
                .catch(error => {
                    console.error('Error loading ads:', error);
                    // If ad loading fails, open the original URL directly in a new tab
                    window.open(originalUrl, '_blank');
                });
        } else {
            // If no ad, open the original URL directly in a new tab
            window.open(originalUrl, '_blank');
        }
    }

    // Load Links from JSON
    function loadLinks() {
        fetch('links.json')
            .then(response => response.json())
            .then(data => {
                for (const category in data) {
                    const ul = document.getElementById(category);
                    data[category].forEach(link => {
                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        a.href = link.url;
                        a.textContent = link.text;
                        a.addEventListener('click', maybeRedirectToAd); // Attach ad redirect
                        li.appendChild(a);
                        ul.appendChild(li);
                    });
                }
            })
            .catch(error => console.error('Error loading links:', error));
    }

    // Load Trending Items from JSON
    function loadTrending() {
        fetch('trending.json')
            .then(response => response.json())
            .then(trending => {
                const trendingDiv = document.getElementById('trending');
                trending.forEach(item => {
                    const a = document.createElement('a');
                    a.href = item.url;
                    a.textContent = item.text;
                    a.addEventListener('click', maybeRedirectToAd); // Attach ad redirect
                    trendingDiv.appendChild(a);
                    trendingDiv.appendChild(document.createElement('br'));
                });
            })
            .catch(error => console.error('Error loading trending:', error));
    }
});
