// GDPR Cookie Consent Manager - asuntoautoni.fi
class CookieManager {
    constructor() {
        this.COOKIE_NAME = 'asuntoautoni_cookie_consent';
        this.COOKIE_DURATION = 365; // päivää
        this.GA_MEASUREMENT_ID = 'G-49J5D8J4GG'; // Nykyinen GA4 ID
        
        this.init();
    }

    init() {
        // Tarkista onko suostumus jo annettu
        const consent = this.getCookieConsent();
        
        if (!consent) {
            // Näytä banner 2 sekunnin kuluttua
            setTimeout(() => {
                this.showCookieBanner();
            }, 2000);
        } else {
            // Jos analytiikka on hyväksytty, varmista että GA4 on käytössä
            if (consent.analytics) {
                this.enableGoogleAnalytics();
            } else {
                this.disableGoogleAnalytics();
            }
        }
    }

    getCookieConsent() {
        const cookie = this.getCookie(this.COOKIE_NAME);
        if (cookie) {
            try {
                return JSON.parse(cookie);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    setCookieConsent(consent) {
        const consentData = {
            analytics: consent.analytics || false,
            necessary: true,
            timestamp: new Date().toISOString()
        };
        
        this.setCookie(this.COOKIE_NAME, JSON.stringify(consentData), this.COOKIE_DURATION);
        
        // Päivitä Google Analytics tila
        if (consentData.analytics) {
            this.enableGoogleAnalytics();
        } else {
            this.disableGoogleAnalytics();
        }
        
        return consentData;
    }

    showCookieBanner() {
        const banner = this.createCookieBanner();
        document.body.appendChild(banner);
        
        // Animoi sisään
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }

    hideCookieBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                if (banner.parentNode) {
                    banner.parentNode.removeChild(banner);
                }
            }, 400);
        }
    }

    createCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookieConsentBanner';
        banner.className = 'cookie-consent-banner';
        
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <div class="cookie-banner-icon">🍪</div>
                    <div class="cookie-banner-info">
                        <h3>Käytämme evästeitä</h3>
                        <p>Parannamme käyttökokemustasi evästeiden avulla. Analytiikkaevästeet auttavat ymmärtämään, miten käytät sivustoa.</p>
                    </div>
                </div>
                <div class="cookie-banner-actions">
                    <button class="cookie-btn cookie-btn-settings" onclick="cookieManager.showSettings()">
                        Asetukset
                    </button>
                    <button class="cookie-btn cookie-btn-decline" onclick="cookieManager.declineOptional()">
                        Hylkää valinnaiset
                    </button>
                    <button class="cookie-btn cookie-btn-accept" onclick="cookieManager.acceptAll()">
                        Hyväksy kaikki
                    </button>
                </div>
            </div>
        `;
        
        return banner;
    }

    showSettings() {
        const modal = this.createSettingsModal();
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    createSettingsModal() {
        const currentConsent = this.getCookieConsent();
        const analyticsChecked = currentConsent ? currentConsent.analytics : false;
        
        const modal = document.createElement('div');
        modal.id = 'cookieSettingsModal';
        modal.className = 'cookie-settings-modal';
        
        modal.innerHTML = `
            <div class="cookie-modal-overlay" onclick="cookieManager.hideSettings()"></div>
            <div class="cookie-modal-content">
                <div class="cookie-modal-header">
                    <h2>Evästeasetukset</h2>
                    <button class="cookie-modal-close" onclick="cookieManager.hideSettings()">&times;</button>
                </div>
                
                <div class="cookie-modal-body">
                    <p class="cookie-modal-description">
                        Voit hallita evästeasetuksiasi alla. Välttämättömät evästeet ovat aina käytössä sivuston perustoimintojen takaamiseksi.
                    </p>
                    
                    <div class="cookie-categories">
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <div class="cookie-category-info">
                                    <h4>Välttämättömät evästeet</h4>
                                    <p>Nämä evästeet ovat välttämättömiä sivuston toiminnan kannalta.</p>
                                </div>
                                <div class="cookie-toggle">
                                    <label class="toggle-switch">
                                        <input type="checkbox" checked disabled>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <div class="cookie-category-info">
                                    <h4>Analytiikkaevästeet</h4>
                                    <p>Google Analytics auttaa ymmärtämään sivuston käyttöä ja parantamaan palvelua.</p>
                                </div>
                                <div class="cookie-toggle">
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="analyticsToggle" ${analyticsChecked ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cookie-modal-actions">
                        <button class="cookie-btn cookie-btn-settings" onclick="cookieManager.hideSettings()">
                            Peruuta
                        </button>
                        <button class="cookie-btn cookie-btn-accept" onclick="cookieManager.saveSettings()">
                            Tallenna valinnat
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }

    hideSettings() {
        const modal = document.getElementById('cookieSettingsModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    }

    acceptAll() {
        this.setCookieConsent({ analytics: true });
        this.hideCookieBanner();
        this.showNotification('Kaikki evästeet hyväksytty');
    }

    declineOptional() {
        this.setCookieConsent({ analytics: false });
        this.hideCookieBanner();
        this.showNotification('Vain välttämättömät evästeet hyväksytty');
    }

    saveSettings() {
        const analyticsToggle = document.getElementById('analyticsToggle');
        const analyticsAccepted = analyticsToggle ? analyticsToggle.checked : false;
        
        this.setCookieConsent({ analytics: analyticsAccepted });
        this.hideSettings();
        this.hideCookieBanner();
        
        const message = analyticsAccepted ? 
            'Evästeasetukset tallennettu - Analytics käytössä' : 
            'Evästeasetukset tallennettu - Vain välttämättömät';
        this.showNotification(message);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cookie-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    enableGoogleAnalytics() {
        // Tarkista että gtag on olemassa
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
            gtag('config', this.GA_MEASUREMENT_ID);
        }
    }

    disableGoogleAnalytics() {
        // Estä Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
        
        // Poista GA-evästeet
        document.cookie.split(";").forEach(function(c) { 
            if(c.indexOf('_ga') === 0 || c.indexOf('_gid') === 0) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            }
        });
    }

    // Utility methods
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}

// Luo globaali instanssi
window.cookieManager = new CookieManager();