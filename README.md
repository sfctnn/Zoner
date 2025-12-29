<div align="center">

# 🎯 ZONER

### The Professional Self-Hosted Amazon Price Tracker & Deal Hunter

![Zoner Preview](./docs/preview.png)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

**Scout products. Track prices. Get notified. All from your own machine.**

[Features](#-features) • [Installation](#-installation) • [Configuration](#%EF%B8%8F-configuration) • [Architecture](#-architecture) • [License](#-license)

</div>

---

## ✨ Features

| Feature                    | Description                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| 🔍 **Scout Mode**          | Search Amazon directly from the app. Supports multi-region: 🇺🇸 USA, 🇹🇷 Turkey, 🇩🇪 Germany, 🇬🇧 UK |
| 📉 **Smart Monitoring**    | Set a "Target Price" or "Discount % Threshold" — get alerted when conditions are met             |
| ⚡ **Real-Time Tracking**  | Background Python engine checks prices at user-defined intervals (5-60 min)                      |
| 🔔 **Discord Integration** | Rich embed notifications sent directly to your phone/server via webhooks                         |
| 💾 **SQLite Persistence**  | Tracked products survive restarts with local database storage                                    |
| 🔒 **Rate Limiting**       | Built-in protection against API abuse (10 searches/min, 20 tracks/min)                           |
| 🛡️ **Privacy Focused**     | No cloud auth, no external servers. 100% self-hosted on your machine                             |

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.11+ ([Download](https://python.org/))
- **Git** ([Download](https://git-scm.com/))

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/zoner.git
cd zoner
```

### Step 2: Backend Setup (Python)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload --port 8000
```

✅ Backend running at: `http://localhost:8000`

### Step 3: Frontend Setup (React)

```bash
# Open a new terminal, navigate to project root
cd zoner

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

---

## ⚙️ Configuration

### Discord Webhook Setup

1. Open Discord and go to your server
2. **Server Settings** → **Integrations** → **Webhooks**
3. Click **New Webhook** and copy the URL
4. Paste the URL in **Zoner Settings** → **Discord Webhook URL**
5. Click **Test Webhook** to verify

### Region Selection

Select your Amazon marketplace in the Settings page:

| Region     | Domain        | Currency |
| ---------- | ------------- | -------- |
| 🇺🇸 USA     | amazon.com    | $        |
| 🇹🇷 Turkey  | amazon.com.tr | ₺        |
| 🇩🇪 Germany | amazon.de     | €        |
| 🇬🇧 UK      | amazon.co.uk  | £        |

### Environment Variables (Optional)

Create a `.env` file in the `backend/` folder:

```env
# ScraperAPI key for bypassing CAPTCHAs (optional, but recommended)
SCRAPER_API_KEY=your_key_here

# Restrict CORS for production (comma-separated)
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│                     (React + Vite)                          │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐  ┌───────────┐  │
│  │  Scout  │  │Dashboard │  │  Settings  │  │ Webhooks  │  │
│  └────┬────┘  └────┬─────┘  └─────┬──────┘  └─────┬─────┘  │
│       │            │              │               │         │
│       └────────────┴──────────────┴───────────────┘         │
│                           │                                 │
│                    AppContext.jsx                           │
│                    (State Management)                       │
│                           │                                 │
│                    amazonApi.js                             │
│                    (API Service)                            │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP (localhost:8000)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                              │
│                   (Python + FastAPI)                        │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  /search     │    │   /track     │    │  /tracked    │  │
│  │  (GET)       │    │   (POST)     │    │  (GET/DEL)   │  │
│  └──────┬───────┘    └──────┬───────┘    └──────────────┘  │
│         │                   │                               │
│         ▼                   ▼                               │
│  ┌──────────────┐    ┌──────────────┐                      │
│  │  ScraperAPI  │    │   SQLite     │                      │
│  │  (Scraping)  │    │   (zoner.db) │                      │
│  └──────────────┘    └──────────────┘                      │
│                             │                               │
│                    APScheduler                              │
│                   (Background Jobs)                         │
│                             │                               │
│                    Discord Webhook                          │
│                   (Notifications)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
zoner/
├── backend/
│   ├── main.py           # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   ├── zoner.db          # SQLite database (auto-created)
│   └── .env              # Environment variables
├── src/
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── context/          # AppContext for state
│   └── data/             # Utility functions
├── public/
│   └── favicon.png       # App icon
├── index.html            # Entry HTML
├── package.json          # Node dependencies
└── README.md             # You are here!
```

---

## 🔌 API Endpoints

| Method   | Endpoint                       | Description              | Rate Limit |
| -------- | ------------------------------ | ------------------------ | ---------- |
| `GET`    | `/health`                      | Health check             | -          |
| `GET`    | `/search?query=...&domain=...` | Search Amazon products   | 10/min     |
| `POST`   | `/track`                       | Add product to tracking  | 20/min     |
| `GET`    | `/tracked`                     | Get all tracked products | -          |
| `DELETE` | `/tracked/{id}`                | Remove tracked product   | -          |

---

## ⚠️ Disclaimer

> **This project is for educational and personal use only.**
>
> Web scraping may violate Amazon's Terms of Service. Use responsibly and at your own risk. The developers are not responsible for any misuse of this software or any consequences arising from its use.
>
> This tool is designed for personal price tracking and should not be used for commercial purposes, high-frequency scraping, or any activity that could harm Amazon's services.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

**I dont even know why i did this :p**

⭐ Star this repo if you find it useful! please improve it :)

</div>
