import './router/router.js';
import './pages/employee-list-page.js';
import './pages/employee-add-page.js';
import './pages/employee-edit-page.js';
import './pages/not-found-page.js';
import './components/navigation-menu/navigation-menu.js';
import './components/language-picker/language-picker.js';
import './components/footer-element/footer-element.js';
import { setLocale } from './localization.js';

const htmlLang = document.documentElement.lang;
setLocale(htmlLang);
