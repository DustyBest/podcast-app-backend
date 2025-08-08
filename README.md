# 🎧 Personal News Podcast App - Backend

> A lightweight Node.js + TypeScript API that aggregates RSS feeds from multiple news sources and serves the latest episodes for the podcast player frontend.

[![Deployed on Railway](https://img.shields.io/badge/🚀_Deployed_on-Railway-green?style=for-the-badge)](https://railway.app)
[![Frontend Repo](https://img.shields.io/badge/🔗_Frontend-View_Code-blue?style=for-the-badge)](https://github.com/DustyBest/podcast-app-frontend)

## ✨ Overview

This is the **backend API** for my personal news podcast application. When Google started deprecating Assistant features, I needed a reliable way to aggregate my morning news feeds. This Express server handles RSS parsing from multiple sources and serves clean episode data to the React frontend.

**🎯 Built for**: Reliable news aggregation and podcast episode serving  
**🚀 Deployed on**: Railway

## 🎪 Key Features

### 📡 **RSS Feed Aggregation**
- **Multi-Source**: Aggregates from WSJ, BBC, IGN, NHK, and other trusted news sources
- **Latest Episodes**: Automatically fetches the most recent episode from each feed
- **Error Resilience**: Continues serving available episodes even if some feeds fail
- **Smart Parsing**: Handles various RSS formats and podcast metadata

### ⚡ **Fast & Reliable API**
- **Single Endpoint**: Clean `/api/episodes` endpoint serving JSON data
- **CORS Enabled**: Configured for cross-origin requests from frontend
- **Error Handling**: Proper HTTP status codes and error responses
- **TypeScript**: Full type safety throughout the codebase

## 🏗️ Technical Architecture

### **Backend Stack**
```
Node.js + TypeScript + Express
├── 🚀 Express 5.1.0 - Modern web framework
├── 📡 RSS Parser - Feed parsing and aggregation
├── 🌐 CORS - Cross-origin resource sharing
└── 🔧 TypeScript - Full type safety
```

### **API Structure**
```
GET /api/episodes
└── Returns array of latest episodes:
    {
      title: string;
      audioUrl: string;
      description: string;
      source: string;
      image?: string;
      pubDate: string;
    }
```

### **RSS Sources**
Currently aggregating from:
- **Wall Street Journal** - What's News, Tech News Briefing
- **BBC** - Global News Podcast
- **IGN** - Game Entertainment News
- **NHK** - English News
- **CBS** - News updates
- **And more...**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/DustyBest/podcast-app-backend.git
cd podcast-app-backend

# Install dependencies
npm install

# Start development server
npm start
```

### Development
```bash
# Run with TypeScript compilation
npm run build

# Start the server
npm start
```

### Environment Variables
```bash
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development         # Environment mode
```

## 📊 API Response Format

### GET /api/episodes
Returns an array of the latest episodes from all configured RSS feeds:

```json
[
  {
    "title": "What's News in Markets",
    "audioUrl": "https://example.com/episode.mp3",
    "description": "Today's market updates and analysis...",
    "source": "The Wall Street Journal",
    "image": "https://example.com/artwork.jpg",
    "pubDate": "2024-01-08T10:00:00.000Z"
  }
]
```

## 🌐 Deployment

**Production**: Deployed on Railway with automatic deployments from the main branch.

**API Structure**: RESTful API serving podcast episodes at `/api/episodes`

## 📊 Performance

- **⚡ Fast Response**: Concurrent RSS feed fetching with Promise.all
- **🔄 Resilient**: Continues serving available episodes if some feeds fail
- **📦 Lightweight**: Minimal dependencies and clean architecture
- **🎵 Efficient**: Optimized for podcast episode metadata extraction

## 📄 License

MIT License - feel free to use this code for your own projects!

---

**Built with ❤️ by Me**  
*Reliable news aggregation for the modern podcast experience*
