import './router/router.js';
import './views/employee-list-view.js';
import './views/employee-add-view.js';
import './views/employee-edit-view.js';
import './components/navigation-menu.js';
import './components/locale-picker.js';
import { setLocale } from './localization.js';

const htmlLang = document.documentElement.lang;
setLocale(htmlLang);
