// 🌱 FarmDirect Authentication & Onboarding Views with Bilingual Support (English / हिन्दी)
import { Icons } from '../lib/icons.js';
import { FarmDirectApi } from '../lib/supabase.js';
import { LanguageManager } from '../lib/translations.js';

export function renderOnboarding(container, onNavigate, registrationState) {
  const { t } = LanguageManager;
  const currentLang = LanguageManager.getCurrentLanguage();

  container.innerHTML = `
    <div class="auth-wrapper">
      <div class="auth-card">
        <!-- Language Switcher in Top Right -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <div style="display:flex; align-items:center; gap:0.55rem;">
            <img 
              src="/logo.png" 
              alt="FarmDirect Logo" 
              style="width:36px; height:36px; border-radius:8px; object-fit:contain; box-shadow:0 2px 6px rgba(22, 163, 74, 0.2);"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div style="display:none; width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg, #16a34a, #15803d); color:#ffffff; align-items:center; justify-content:center;">
              <span style="width:18px; height:18px; display:inline-block;">${Icons.leaf}</span>
            </div>
            <span class="brand-name" style="font-size:1.2rem; font-weight:900; color:#14532d;">FarmDirect</span>
          </div>

          <button id="auth-lang-btn" style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:20px; padding:3px 10px; font-size:0.75rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:4px;">
            <span>🌐</span>
            <span style="${currentLang === 'en' ? 'color:#15803d; font-weight:800;' : 'color:#64748b;'}">EN</span>
            <span style="color:#cbd5e1;">|</span>
            <span style="${currentLang === 'hi' ? 'color:#15803d; font-weight:800;' : 'color:#64748b;'}">हिन्दी</span>
          </button>
        </div>

        <!-- Tagline -->
        <div style="text-align:center; margin-bottom:1rem;">
          <span class="brand-tagline" style="font-size:0.82rem; color:#64748b; font-weight:500;">
            ${currentLang === 'hi' ? 'खेत से लोगों तक — सीधा • निष्पक्ष • बेहतर' : 'From Farm to People — Direct. Fair. Better.'}
          </span>
        </div>

        <!-- Screen 1: Hero Card -->
        <div class="onboarding-hero-image-wrap">
          <img 
            src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80" 
            alt="Farmer in field" 
            class="onboarding-hero-img" 
          />
          <div class="onboarding-hero-overlay">
            <h2 class="onboarding-hero-title">${t('onboardingHeroTitle')}</h2>
            <p class="onboarding-hero-desc">${t('onboardingHeroDesc')}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="onboarding-btn-row">
          <button id="btn-goto-login" class="btn-auth-full btn-auth-primary">${t('btnGotoLogin')}</button>
          
          <div style="margin-top:0.75rem; text-align:center;">
            <div style="font-size:0.8rem; font-weight:700; color:#475569; margin-bottom:0.5rem;">${t('newToFarmDirect')}</div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.65rem;">
              <button id="btn-onboard-farmer" class="register-role-choice-btn farmer" style="padding:0.75rem 0.85rem;">
                <span class="register-role-icon">👨‍🌾</span>
                <div style="text-align:left;">
                  <div style="font-weight:700; font-size:0.85rem; color:#15803d;">${t('regRoleFarmer')}</div>
                  <div style="font-size:0.7rem; color:#64748b;">${t('regRoleFarmerDesc')}</div>
                </div>
              </button>
              <button id="btn-onboard-buyer" class="register-role-choice-btn buyer" style="padding:0.75rem 0.85rem;">
                <span class="register-role-icon">🛒</span>
                <div style="text-align:left;">
                  <div style="font-weight:700; font-size:0.85rem; color:#0369a1;">${t('regRoleBuyer')}</div>
                  <div style="font-size:0.7rem; color:#64748b;">${t('regRoleBuyerDesc')}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#auth-lang-btn').addEventListener('click', () => {
    LanguageManager.setLanguage(currentLang === 'en' ? 'hi' : 'en');
    renderOnboarding(container, onNavigate, registrationState);
  });

  container.querySelector('#btn-goto-login').addEventListener('click', () => onNavigate('login'));

  container.querySelector('#btn-onboard-farmer').addEventListener('click', () => {
    registrationState.role = 'farmer';
    onNavigate('signup');
  });

  container.querySelector('#btn-onboard-buyer').addEventListener('click', () => {
    registrationState.role = 'buyer';
    onNavigate('signup');
  });
}

export function renderRoleSelection(container, onNavigate, registrationState) {
  renderOnboarding(container, onNavigate, registrationState);
}

export function renderLogin(container, onNavigate, registrationState) {
  const { t } = LanguageManager;
  const currentLang = LanguageManager.getCurrentLanguage();

  container.innerHTML = `
    <div class="auth-wrapper">
      <div class="auth-card">
        <!-- Header with Language Switcher -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <div style="display:flex; align-items:center; gap:0.55rem;">
            <img 
              src="/logo.png" 
              alt="FarmDirect Logo" 
              style="width:36px; height:36px; border-radius:8px; object-fit:contain; box-shadow:0 2px 6px rgba(22, 163, 74, 0.2);"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div style="display:none; width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg, #16a34a, #15803d); color:#ffffff; align-items:center; justify-content:center;">
              <span style="width:18px; height:18px; display:inline-block;">${Icons.leaf}</span>
            </div>
            <span class="brand-name" style="font-size:1.2rem; font-weight:900; color:#14532d;">FarmDirect</span>
          </div>

          <button id="auth-lang-btn" style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:20px; padding:3px 10px; font-size:0.75rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:4px;">
            <span>🌐</span>
            <span style="${currentLang === 'en' ? 'color:#15803d; font-weight:800;' : 'color:#64748b;'}">EN</span>
            <span style="color:#cbd5e1;">|</span>
            <span style="${currentLang === 'hi' ? 'color:#15803d; font-weight:800;' : 'color:#64748b;'}">हिन्दी</span>
          </button>
        </div>

        <h2 style="font-size:1.45rem; font-weight:800; margin-bottom:0.25rem;">${t('loginTitle')}</h2>
        <p style="font-size:0.85rem; color:#64748b; margin-bottom:1.25rem;">${t('loginSubtitle')}</p>

        <!-- Error Message Alert -->
        <div id="login-error-msg" style="display:none; background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; border-radius:8px; padding:0.65rem 0.85rem; font-size:0.8rem; margin-bottom:1rem; text-align:left;"></div>

        <form id="login-form" class="auth-form">
          <div>
            <label style="font-size:0.8rem; font-weight:600; color:#334155; margin-bottom:4px; display:block;">${t('loginEmailLabel')}</label>
            <div class="input-with-icon-wrap">
              <span class="input-icon-left">${Icons.mail}</span>
              <input 
                type="email" 
                id="login-email" 
                class="input-styled" 
                placeholder="${t('loginEmailPlaceholder')}" 
                value="" 
                required 
              />
            </div>
          </div>

          <div>
            <label style="font-size:0.8rem; font-weight:600; color:#334155; margin-bottom:4px; display:block;">${t('loginPwLabel')}</label>
            <div class="input-with-icon-wrap">
              <span class="input-icon-left">${Icons.lock}</span>
              <input 
                type="password" 
                id="login-password" 
                class="input-styled" 
                placeholder="${t('loginPwPlaceholder')}" 
                value="" 
                required 
              />
              <button type="button" id="btn-toggle-pw" class="input-toggle-eye">${Icons.eye}</button>
            </div>
          </div>

          <div style="text-align:right; margin-top:-0.3rem;">
            <a href="#" id="link-forgot-pw" style="font-size:0.8rem; color:#64748b;">${t('forgotPassword')}</a>
          </div>

          <button type="submit" id="btn-login-submit" class="btn-auth-full btn-auth-primary" style="margin-top:0.5rem;">
            ${t('btnLogin')}
          </button>
        </form>

        <div class="auth-divider">
          <span>${t('authDivider')}</span>
        </div>

        <!-- Role Registration Quick Select -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.65rem; margin-top:0.5rem;">
          <button id="btn-register-farmer-direct" class="register-role-choice-btn farmer">
            <span class="register-role-icon">👨‍🌾</span>
            <div style="text-align:left;">
              <div style="font-weight:700; font-size:0.85rem; color:#15803d;">${t('regFarmerDirect')}</div>
              <div style="font-size:0.7rem; color:#64748b; line-height:1.2;">${t('regRoleFarmerDesc')}</div>
            </div>
          </button>

          <button id="btn-register-buyer-direct" class="register-role-choice-btn buyer">
            <span class="register-role-icon">🛒</span>
            <div style="text-align:left;">
              <div style="font-weight:700; font-size:0.85rem; color:#0369a1;">${t('regBuyerDirect')}</div>
              <div style="font-size:0.7rem; color:#64748b; line-height:1.2;">${t('regRoleBuyerDesc')}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#auth-lang-btn').addEventListener('click', () => {
    LanguageManager.setLanguage(currentLang === 'en' ? 'hi' : 'en');
    renderLogin(container, onNavigate, registrationState);
  });

  const pwInput = container.querySelector('#login-password');
  container.querySelector('#btn-toggle-pw').addEventListener('click', () => {
    pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
  });

  const errorDiv = container.querySelector('#login-error-msg');
  const submitBtn = container.querySelector('#btn-login-submit');

  container.querySelector('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';
    submitBtn.innerText = currentLang === 'hi' ? 'लॉगिन हो रहा है...' : 'Logging in...';
    submitBtn.disabled = true;

    const emailVal = container.querySelector('#login-email').value.trim();
    const pwVal = container.querySelector('#login-password').value;

    const res = await FarmDirectApi.loginUser(emailVal, pwVal);

    if (res.success) {
      onNavigate('app');
    } else {
      submitBtn.innerText = t('btnLogin');
      submitBtn.disabled = false;
      errorDiv.innerText = res.error || (currentLang === 'hi' ? 'अमान्य ईमेल या पासवर्ड। कृपया नीचे पंजीकरण करें।' : 'Invalid email or password. Please register below if new.');
      errorDiv.style.display = 'block';
    }
  });

  container.querySelector('#btn-register-farmer-direct').addEventListener('click', () => {
    registrationState.role = 'farmer';
    onNavigate('signup');
  });

  container.querySelector('#btn-register-buyer-direct').addEventListener('click', () => {
    registrationState.role = 'buyer';
    onNavigate('signup');
  });

  container.querySelector('#link-forgot-pw').addEventListener('click', (e) => {
    e.preventDefault();
    alert(currentLang === 'hi' ? 'कृपया अपना ईमेल पता दर्ज करें।' : 'Please sign in or register with your email address.');
  });
}

// -----------------------------------------------------------------------------
// SIGNUP VIEW: Full Bilingual Email Registration
// -----------------------------------------------------------------------------
export function renderSignup(container, onNavigate, registrationState) {
  const isFarmer = registrationState.role === 'farmer';
  const { t } = LanguageManager;
  const currentLang = LanguageManager.getCurrentLanguage();

  container.innerHTML = `
    <div class="auth-wrapper">
      <div class="auth-card">
        <!-- Header with Language Switcher -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <div style="display:flex; align-items:center; gap:0.55rem;">
            <img 
              src="/logo.png" 
              alt="FarmDirect Logo" 
              style="width:36px; height:36px; border-radius:8px; object-fit:contain; box-shadow:0 2px 6px rgba(22, 163, 74, 0.2);"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div style="display:none; width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg, #16a34a, #15803d); color:#ffffff; align-items:center; justify-content:center;">
              <span style="width:18px; height:18px; display:inline-block;">${Icons.leaf}</span>
            </div>
            <span class="brand-name" style="font-size:1.2rem; font-weight:900; color:#14532d;">FarmDirect</span>
          </div>

          <button id="auth-lang-btn" style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:20px; padding:3px 10px; font-size:0.75rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:4px;">
            <span>🌐</span>
            <span style="${currentLang === 'en' ? 'color:#15803d; font-weight:800;' : 'color:#64748b;'}">EN</span>
            <span style="color:#cbd5e1;">|</span>
            <span style="${currentLang === 'hi' ? 'color:#15803d; font-weight:800;' : 'color:#64748b;'}">हिन्दी</span>
          </button>
        </div>

        <!-- Role Badge Header -->
        <div style="display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:9999px; margin-bottom:0.75rem; font-size:0.75rem; font-weight:700; ${isFarmer ? 'background:#dcfce7; color:#15803d;' : 'background:#e0f2fe; color:#0369a1;'}">
          <span>${isFarmer ? t('farmerAccountBadge') : t('buyerAccountBadge')}</span>
          <button id="btn-toggle-role-signup" style="margin-left:6px; font-size:0.7rem; text-decoration:underline; cursor:pointer; color:inherit;">
            ${isFarmer ? t('switchRoleToBuyer') : t('switchRoleToFarmer')}
          </button>
        </div>

        <h2 style="font-size:1.4rem; font-weight:800; margin-bottom:0.25rem;">
          ${isFarmer ? t('signupTitleFarmer') : t('signupTitleBuyer')}
        </h2>
        <p style="font-size:0.85rem; color:#64748b; margin-bottom:1.25rem;">
          ${isFarmer ? t('signupDescFarmer') : t('signupDescBuyer')}
        </p>

        <!-- Error/Status Message -->
        <div id="signup-status-msg" style="display:none; border-radius:8px; padding:0.65rem 0.85rem; font-size:0.8rem; margin-bottom:1rem; text-align:left;"></div>

        <form id="signup-form" class="auth-form">
          <!-- Full Name -->
          <div>
            <label style="font-size:0.8rem; font-weight:600; color:#334155; margin-bottom:4px; display:block;">${t('signupNameLabel')}</label>
            <div class="input-with-icon-wrap">
              <span class="input-icon-left">${Icons.user}</span>
              <input 
                type="text" 
                id="signup-name" 
                class="input-styled" 
                placeholder="${t('signupNamePlaceholder')}" 
                value="${registrationState.name || ''}" 
                required 
              />
            </div>
          </div>

          <!-- Email Address -->
          <div>
            <label style="font-size:0.8rem; font-weight:600; color:#334155; margin-bottom:4px; display:block;">${t('signupEmailLabel')}</label>
            <div class="input-with-icon-wrap">
              <span class="input-icon-left">${Icons.mail}</span>
              <input 
                type="email" 
                id="signup-email" 
                class="input-styled" 
                placeholder="${t('signupEmailPlaceholder')}" 
                value="${registrationState.email || ''}" 
                required 
              />
            </div>
          </div>

          <!-- Phone Number -->
          <div>
            <label style="font-size:0.8rem; font-weight:600; color:#334155; margin-bottom:4px; display:block;">${t('signupPhoneLabel')}</label>
            <div class="input-with-icon-wrap">
              <span class="input-icon-left">${Icons.phone}</span>
              <input 
                type="tel" 
                id="signup-phone" 
                class="input-styled" 
                placeholder="${t('signupPhonePlaceholder')}" 
                value="${registrationState.phone || '+91 98765 00000'}" 
                required 
              />
            </div>
          </div>

          <!-- Location -->
          <div>
            <label style="font-size:0.8rem; font-weight:600; color:#334155; margin-bottom:4px; display:block;">
              ${t('signupLocationLabel')}
            </label>
            <div class="input-with-icon-wrap">
              <span class="input-icon-left">${Icons.mapPin}</span>
              <input 
                type="text" 
                id="signup-location" 
                class="input-styled" 
                placeholder="${t('signupLocationPlaceholder')}" 
                value="Meerut, Uttar Pradesh" 
                required 
              />
            </div>
          </div>

          <!-- Unique Password -->
          <div>
            <label style="font-size:0.8rem; font-weight:600; color:#334155; margin-bottom:4px; display:block;">${t('signupPwLabel')}</label>
            <div class="input-with-icon-wrap">
              <span class="input-icon-left">${Icons.lock}</span>
              <input 
                type="password" 
                id="signup-password" 
                class="input-styled" 
                placeholder="${t('signupPwPlaceholder')}" 
                minlength="6"
                value="${registrationState.password || ''}" 
                required 
              />
              <button type="button" id="btn-toggle-pw" class="input-toggle-eye">${Icons.eye}</button>
            </div>
          </div>

          <button type="submit" id="btn-signup-submit" class="btn-auth-full btn-auth-primary" style="margin-top:0.75rem;">
            ${t('btnSignup')}
          </button>
        </form>

        <div style="margin-top:1.25rem; font-size:0.85rem; color:#64748b;">
          ${t('linkToLogin')}
        </div>
      </div>
    </div>
  `;

  container.querySelector('#auth-lang-btn').addEventListener('click', () => {
    LanguageManager.setLanguage(currentLang === 'en' ? 'hi' : 'en');
    renderSignup(container, onNavigate, registrationState);
  });

  const pwInput = container.querySelector('#signup-password');
  container.querySelector('#btn-toggle-pw').addEventListener('click', () => {
    pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
  });

  container.querySelector('#btn-toggle-role-signup').addEventListener('click', (e) => {
    e.preventDefault();
    registrationState.role = isFarmer ? 'buyer' : 'farmer';
    renderSignup(container, onNavigate, registrationState);
  });

  const statusMsg = container.querySelector('#signup-status-msg');
  const submitBtn = container.querySelector('#btn-signup-submit');

  container.querySelector('#signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    statusMsg.style.display = 'none';
    submitBtn.innerText = currentLang === 'hi' ? 'पंजीकरण हो रहा है...' : 'Registering & Saving to Database...';
    submitBtn.disabled = true;

    const name = container.querySelector('#signup-name').value.trim();
    const email = container.querySelector('#signup-email').value.trim();
    const phone = container.querySelector('#signup-phone').value.trim();
    const location = container.querySelector('#signup-location').value.trim();
    const password = pwInput.value;

    const res = await FarmDirectApi.registerUser({
      name,
      email,
      phone,
      location,
      password,
      role: isFarmer ? 'farmer' : 'buyer',
      avatar: isFarmer ? '👨‍🌾' : '🛒'
    });

    if (res.success) {
      statusMsg.style.background = '#f0fdf4';
      statusMsg.style.color = '#15803d';
      statusMsg.style.border = '1px solid #86efac';
      statusMsg.innerText = currentLang === 'hi' ? '✓ खाता पंजीकृत! डैशबोर्ड खुल रहा है...' : '✓ Account registered! Launching dashboard...';
      statusMsg.style.display = 'block';

      setTimeout(() => {
        onNavigate('app');
      }, 500);
    } else {
      submitBtn.innerText = t('btnSignup');
      submitBtn.disabled = false;
      statusMsg.style.background = '#fef2f2';
      statusMsg.style.color = '#b91c1c';
      statusMsg.style.border = '1px solid #fecaca';
      statusMsg.innerText = res.error || (currentLang === 'hi' ? 'पंजीकरण विफल रहा।' : 'Registration failed. Please check your details.');
      statusMsg.style.display = 'block';
    }
  });

  const loginLink = container.querySelector('#signup-form').nextElementSibling;
  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      onNavigate('login');
    });
  }
}
