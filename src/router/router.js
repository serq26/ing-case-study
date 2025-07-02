import { Router } from '@vaadin/router';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

router.setRoutes([
  { path: '/', component: 'employee-list-view' },
  { path: '/employees', component: 'employee-list-view' },
  { path: '/add-employee', component: 'employee-add-view' },
  { path: '/edit-employee/:id', component: 'employee-edit-view' },
]);

export default router;
