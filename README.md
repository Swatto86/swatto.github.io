# Swatto's Useful Utilities Website

A Next.js-powered website showcasing various Windows utilities for system administrators and IT professionals. Built with TypeScript, Tailwind CSS, and Vercel KV for download tracking.

## 🚀 Featured Utilities

### ConnectX

Remote Desktop Connection Manager designed for system administrators to simplify connecting to multiple RDP hosts.

### ChecksumCheck

Fast and Simple File Checksum Verification Tool built in Rust.

### PSTInsight

PST File Viewer and Export Utility that allows viewing, searching, and exporting emails from PST files without requiring Outlook installation.

### SwatLogSweep

Event Log Search Utility providing efficient searching capabilities across Windows event logs.

## 🛠 Tech Stack

🛠 Tech Stack
Core

Framework: Next.js 14.2.16
Language: TypeScript 5.3.3
Runtime Environment: Node.js ≥18.x

Styling & UI

CSS Framework: Tailwind CSS 3.4.1
UI Components:

Radix UI (Dialog 1.1.2, Slot 1.0.2, Toast 1.2.2)
shadcn/ui components

Icons: Lucide React 0.330.0
Font: Inter (Google Fonts)
CSS Processing:

PostCSS 8.4.33
Autoprefixer
tailwindcss-animate 1.0.7

State Management & Utilities

Class Utilities:

clsx 2.1.0
class-variance-authority 0.7.0
tailwind-merge 2.2.1
Validation: Zod 3.23.8
Theme Management: next-themes 0.2.1

Infrastructure

Database: Vercel KV 1.0.1
Analytics: Vercel Analytics 1.1.1
Deployment Platform: Vercel

Performance & SEO

PWA Support: next-pwa 5.6.0
SEO: next-sitemap 4.2.3
Critical CSS: critters 0.0.20

Development Tools

Code Formatting:

Prettier 3.2.5
prettier-plugin-tailwindcss 0.5.11

Type Checking: TypeScript

Security & Headers

Strict Content Security Policy (CSP)
HSTS
X-Frame-Options
X-Content-Type-Options
Referrer Policy
Permissions Policy

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/yourusername/your-repo-name.git
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file with the following variables:

```bash
KV_URL=your_kv_url
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
NEXT_PUBLIC_APP_URL=your_app_url
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build

```bash
npm run build
```

## 🧪 Features

- Responsive design for mobile and desktop
- Theme Support:
  - Colourful theme (default)
  - Dark theme
  - Light theme
  - Theme persistence
- Download count tracking
- SHA256 checksum verification
- Smooth scroll navigation
- Interactive screenshot viewer
- Animated UI elements
- Toast notifications
- SEO optimized

## 🎨 Theme Configuration

The application supports three distinct themes:

- Colourful: (Default): Custom color palette with vibrant gradients
- Dark: Optimized for low-light environments
- Light:Classic light mode interface

Themes are persisted in local storage using the key `swatto-theme`. The theme can be changed using the theme picker in the navigation menu.

## 🔑 Environment Variables

- `KV_URL`: Vercel KV database URL
- `KV_REST_API_URL`: Vercel KV REST API URL
- `KV_REST_API_TOKEN`: Vercel KV REST API token
- `NEXT_PUBLIC_APP_URL`: Public URL of the application

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please email: <feedback@swatto.co.uk>

## 🔒 Security

All utilities are guaranteed to be free from malware and viruses. However, it's recommended to scan downloaded files with your preferred antivirus software before running them.

## 🌟 Acknowledgments

Special thanks to the following open-source projects used in PSTInsight:

- [XstReader](https://github.com/iluvadev/XstReader)
- [MsgKit](https://github.com/Sicos1977/MsgKit)
