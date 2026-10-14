
# PhishGuard — Phishing Awareness Center

## Overview

PhishGuard is an interactive cybersecurity awareness web application designed to help users recognize phishing attempts and develop safer online habits.

The project provides educational content, an interactive quiz, a basic phishing message checker, and a safe phishing-awareness simulation.

## Features

- **Phishing Awareness:** Learn about phishing attacks and common warning signs.
- **Interactive Quiz:** Test your understanding of phishing and online safety.
- **Message Checker:** Identify suspicious text patterns and potential URL warning signs.
- **Phishing Simulation:** Practice classifying sample messages as phishing or legitimate.
- **Responsive Interface:** Access the application on desktop and mobile screens.

## Technologies Used

- HTML5
- CSS3
- JavaScript

## Project Structure

```text
PhishGuard/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run

1. Download or clone this repository.
2. Keep all project files in the same directory.
3. Open `index.html` in a modern web browser.
4. Use the navigation links to explore the educational sections and interactive tools.

No backend, database, or additional JavaScript libraries are required.

## Security Limitations

The message checker uses basic text-pattern matching and limited URL inspection. It does not query threat-intelligence services, verify domain reputation, or visit suspicious URLs.

Its findings are educational indicators, not a definitive security verdict. A message with no detected warning signs may still be malicious.

The simulation uses fictional educational examples and does not send messages or collect credentials.

## Educational Purpose

This project was developed for cybersecurity awareness and educational demonstration. It is not a replacement for professional email-security tools or incident-response procedures.
