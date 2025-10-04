<div align="center">

# ZACODEC — Muhammad Zain | Web Developer Portfolio

Modern, luxurious, colorful, and blazing‑fast portfolio inspired by JetBrains. Beautiful cards, tasteful motion, and a background‑led theme.

<p>
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000" />
  <img alt="Status" src="https://img.shields.io/badge/Deployed%20via-GitHub%20Pages-0a7cff?style=for-the-badge&logo=github" />
</p>

</div>


> Live Demo (after publishing): https://ZACODEC-IO.github.io/zacodec-portfolio
>
> Change ZACODEC-IO and zacodec-portfolio if you pick a different GitHub username or repository name.


## Table of Contents
- Overview
- Features & UI Highlights
- Tech Stack
- Project Structure
- Quick Start (Local)
- Publish to GitHub (GitHub Pages)
  - Option A: One‑shot PowerShell script (Windows)
  - Option B: GitHub CLI (gh)
  - Option C: Git only (manual remote)
  - Option D: GitHub Web UI
- Custom Domain (Optional)
- Troubleshooting Pages
- Author


## Overview
This is a single‑page portfolio for Muhammad Zain (ZACODEC). It showcases projects, a refined skills gallery, a sticky experience timeline with a live‑updating details panel, and performance‑friendly animations. The site is fully static — perfect for GitHub Pages.


## Features & UI Highlights
- Luxurious background‑led theme with animated gradient mesh and per‑section light mixed gradients
- Modern interactive cards: 3D hover tilt, glow that follows the cursor, gentle shadows
- ScrollSpy highlighting for the navbar, plus a slim scroll progress bar
- Seamless marquee in Testimonials with pause‑on‑hover and reduced‑motion support
- Experience section with a sticky, structured detail panel (no duplicate content)
- Accessible by default: semantic landmarks, skip link, visible focus, reduced‑motion safety
- Blazing fast: zero dependencies, GPU‑friendly transforms, CSS‑driven visuals


## Tech Stack
- HTML5, CSS3
- Vanilla JavaScript (IntersectionObserver, tilt/parallax, cursor glow)
- No frameworks, no build step


## Project Structure
- index.html — Main page
- css/styles.css — Styles and animations
- js/script.js — Interactivity and behavior
- CV/ — Your CV PDF
- run.ps1 — Windows helper to open the site locally


## Quick Start (Local)
- Double‑click index.html, or
- PowerShell in this folder: Start-Process .\index.html
- Optional local server for best parity:
  - Python: python -m http.server 5500 (then http://localhost:5500)
  - Node: npx serve -l 5500 (or npx http-server -p 5500)


## Author
- Muhammad Zain — ZACODEC
- Email: f2023266257@umt.edu.pk | Alternate: zainmustafam041@gmail.com
- LinkedIn: https://www.linkedin.com/in/muhammad-zain007/
- GitHub: https://github.com/ZACODEC-IO

---
Made with care, motion, and performance. ✨
