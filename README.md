# Property Inspection UI

A simple React-based form that allows users to submit property inspection requests. It collects basic details such as address, inspection type, preferred date, and requestor email.

**Live Site**: [https://lukaa98.github.io/property-inspection-ui/](https://lukaa98.github.io/property-inspection-ui/)

---

## Built With

- [React](https://reactjs.org/)
- [Create React App](https://create-react-app.dev/)
- [Material UI (MUI)](https://mui.com/) – for modern, responsive form components
- [gh-pages](https://www.npmjs.com/package/gh-pages) – for deployment to GitHub Pages

---

## Features

- Simple and intuitive form UI with four fields:
  - **Property Address**
  - **Inspection Type**
  - **Date Needed**
  - **Requestor Email**
- Responsive layout using MUI
- Deployable as a static site via GitHub Pages

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Lukaa98/property-inspection-ui.git
cd property-inspection-ui
npm install
npm start
```

---

## Deployment

This project is deployed manually using [gh-pages](https://www.npmjs.com/package/gh-pages).

```bash
npm run deploy
```

This command will:
- Build the app (`npm run build`)
- Push the `build/` folder to the `gh-pages` branch
- Publish the site at: [https://lukaa98.github.io/property-inspection-ui/](https://lukaa98.github.io/property-inspection-ui/)

> ⚠️ **Note:** Only authorized users should run `npm run deploy`, as it will overwrite the live site on GitHub Pages.
