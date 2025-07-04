# Ing Case Study

## Project Overview

This is a **LitElement** based web application designed to help HR staff manage the company's employee information efficiently.  
The application supports listing, adding, editing, and deleting employee records with localization, responsive design, and state management features.

---

## Technologies

- [Lit](https://lit.dev/) — Modern Web Components development library  
- [@vaadin/router](https://vaadin.com/router) — SPA routing  
- [Redux Toolkit](https://redux-toolkit.js.org/) — State management  
- [Notyf](https://github.com/caroso1222/notyf) — Notifications  
- [@lit/localize](https://lit.dev/docs/tools/localize/) — Localization support  
- Testing with [@open-wc/testing](https://open-wc.org/testing/)

---

## Installation

````bash
git clone https://github.com/serq26/ing-case-study.git
cd ing-case-study
npm install
````

---

## Usage

### Start development server

````bash
npm run serve
````

Open your browser at `http://localhost:8000` to see the application.

---

## Tests

Tests are written using [@web/test-runner](https://modern-web.dev/docs/test-runner/overview/).

### Run tests

````bash
npm run test
````

---

## Code Quality

- ESLint and Prettier are used for linting and formatting.
- `lint-staged` and `husky` automate linting and formatting on git commits.

---

## License

This project is licensed under the BSD-3-Clause License.  
See the LICENSE file for details.