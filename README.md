# IEEE RRCE — The Future of Innovation

IEEE website for the IEEE Student Branch at Rajarajeswari College of Engineering.

A responsive, static website prototype for the IEEE Student Branch at Rajarajeswari College of Engineering. It uses HTML, CSS and vanilla JavaScript; no build step or package installation is required.

## Run in VS Code

1. Extract `ieee-rrce.zip` or open this `ieee-rrce` folder in VS Code.
2. Open `index.html` in a browser. For the best experience, install the **Live Server** VS Code extension, right-click `index.html`, and select **Open with Live Server**.
3. Keep an internet connection for the remote photography, web fonts, QR-code library and linked learning resources. The rest of the site runs locally.

## Features

- Responsive navigation, light/dark theme preference and reduced-motion support.
- Searchable/filterable demonstration events and project concepts, detail dialogs and a gallery lightbox.
- Learning-resource search and local bookmarks.
- IEEE AI Assistant with predefined contextual responses and quick navigation.
- Career roadmap and project idea tools, including local save/copy actions.
- Browser-local collaboration board, interest/contact form validation, sample ID card with QR code and printable sample certificate.
- Future Lab technology explorer, illustrative campus map and optional Web Speech API voice navigation.

## Prototype content and privacy

This is a front-end demonstration. Events, people, projects, dashboard numbers and locations are illustrative until verified. The project does not claim that suggested societies are active RRCE chapters. Forms validate locally but do not transmit submissions; collaboration posts, bookmarks, saved ideas and the selected theme stay in the current browser's local storage. The sample ID and certificate are not official IEEE credentials or proof of attendance.

Replace demonstration content with information verified by the college or IEEE RRCE branch before publishing. Do not add personal contact details without permission.

## Project structure

```text
ieee-rrce/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── README.md
```

## Customize

- Edit section content and structure in `index.html`.
- Adjust visual design and responsive breakpoints in `css/style.css`.
- Update sample event, project, resource, roadmap and assistant data in `js/main.js`.
- Image URLs use Unsplash; replace them with appropriately licensed, optimized images for production.

## Deployment

Deploy the contents of this folder to any static web host, such as GitHub Pages, Netlify or Cloudflare Pages. Set `index.html` as the entry point. No server-side API or secrets are used.
