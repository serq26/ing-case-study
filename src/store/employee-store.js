export const employeeStore = {
  employees: JSON.parse(localStorage.getItem('employees') || '[]'),

  add(emp) {
    this.employees.push(emp);
    this.save();
  },

  update(updatedEmp) {
    const idx = this.employees.findIndex(e => e.id === updatedEmp.id);
    if (idx !== -1) this.employees[idx] = updatedEmp;
    this.save();
  },

  remove(id) {
    this.employees = this.employees.filter(e => e.id !== id);
    this.save();
  },

  save() {
    localStorage.setItem('employees', JSON.stringify(this.employees));
  },
};
