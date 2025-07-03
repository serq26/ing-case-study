import { Router } from '@vaadin/router';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

router.setRoutes([
  { path: '/', component: 'employee-list-page' },
  { path: '/employees', component: 'employee-list-page' },
  { path: '/add-employee', component: 'employee-add-page' },
  { path: '/edit-employee/:id', component: 'employee-edit-page' },
]);

export default router;
