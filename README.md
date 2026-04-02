# 🏋️‍♂️ Gym Trainer PWA

A high-performance, mobile-first Progressive Web Application (PWA) designed for serious lifters to track their progress, manage routines, and visualize their fitness journey.

![Gym Logger Preview](https://img.shields.io/badge/Status-Development-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase)

---

## 🌟 Key Features

- **🔥 Real-time Workout Tracking**: Seamlessly log your sets, reps, and weight during your session.
- **📋 Routine Templates**: Create custom templates for your favorite splits (Push/Pull/Legs, Upper/Lower, etc.).
- **📚 Comprehensive Exercise Library**: A built-in library of movements with the ability to add custom exercises.
- **🕒 Workout History**: Access your past sessions to stay on top of your progressive overload.
- **📱 Mobile-First UX**: Designed specifically for the gym environment with large touch targets and dark-mode optimization.
- **⚡ PWA Ready**: Install it on your home screen for an app-like experience without the App Store.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend/DB**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- A Firebase project (for Auth and Firestore)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd gym-trainer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```text
src/
├── app/             # Next.js App Router (pages & layouts)
│   ├── history/     # Workout history view
│   ├── login/       # Authentication pages
│   ├── movements/   # Exercise library
│   ├── templates/   # Workout routine templates
│   └── settings/    # User preferences
├── components/      # Reusable UI components
├── contexts/        # React Context providers (Auth, Theme)
├── lib/             # Firebase config and utilities
├── types/           # TypeScript interfaces and types
└── styles/          # Global styles and Tailwind config
```

---

## 📜 Database Rules

This project uses Firestore. Ensure your rules are configured to protect user data:
```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🛡 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ for the fitness community.*
