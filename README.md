# 🎨 Panelize Frontend

This is the **frontend** for **Panelize**, a full-stack application that turns user-written stories into AI-generated comic or manga panels using GPT-4, DALL·E 3, and BLIP.

---

## 🛠️ Built With

- ⚡ **Vite** — next-gen frontend tooling
- 🧠 **React + TypeScript** — UI logic and type safety
- 💅 **Tailwind CSS** — utility-first styling
- 🧩 **shadcn/ui** — accessible, headless UI components
- 🌍 **REST API** integration — connects to a Flask backend at `/api/generate-panels`

---

## ✨ Features

- 📝 Story input form with theme and panel customization
- 🎨 Real-time UI rendering of DALL·E-generated panels
- 💬 Dynamic captions using BLIP for each panel
- 🔁 Handles loading states, resets, and toast notifications
- 🧪 Works locally with proxy-based CORS setup

---

## 📦 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/panelize-frontend.git
cd panelize-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

> App will be live at: [http://localhost:5173](http://localhost:5173) (or 8080 if set in `vite.config.ts`)

---

## 🔄 Backend Connection

Make sure the Flask backend is running at:
```bash
http://127.0.0.1:5000
```

The frontend uses a **proxy** configured in `vite.config.ts`:
```ts
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:5000',
      changeOrigin: true,
      secure: false
    }
  }
}
```


## 📝 License

MIT License © 2025 Anthony Lamelas
