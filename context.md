# Proposly — AI-Powered Proposal Generator for Freelancers

## 🌟 Project Idea

**Proposly** helps freelancers generate personalized, high-quality proposals using OpenAI to save time and win more jobs. Ideal for platforms like Upwork, Fiverr, and Freelancer.

---

## 🎯 Goal

Build a SaaS web application that allows users to:
- Paste job posts
- Auto-generate AI proposals
- Customize tone and style
- Track past proposals
- Use credits or subscription-based usage

---

## 👥 User Types

- **Guest**: Access to the landing page and basic info.
- **Registered User**: Can generate and save proposals, edit profile, manage billing.
- **Admin (optional)**: Manages users, billing logs, and proposal analytics.

---

## 🧠 User Flow

1. Sign up/Login
2. Fill in profile (skills, experience, tone)
3. Paste job post
4. Click "Generate Proposal"
5. View/edit/export proposal
6. Track credit usage or subscribe

---

## 📋 Core Features (MVP)

- ✍️ **AI Proposal Generation**: Paste job post and generate a proposal via OpenAI.
- 🙋‍♂️ **User Profile**: Define skills, experience, tone of writing.
- 📁 **Proposal History**: List, view, edit, or copy past proposals.
- 💳 **Credit System**: Free tier with limited credits, upgrade to generate more.
- 📤 **Copy/Download**: Export proposals as text or download.
- 🔐 **Authentication**: JWT-based login/signup; optional Google OAuth.
- 💸 **Billing**: Stripe integration for pay-per-use or subscription.

---

## 🚀 Future Features (Post-MVP)

- 🔌 Upwork/Fiverr integration (scraping or API if available)
- 🧩 Chrome Extension for in-platform use
- 🧠 Proposal Feedback and Scorecard
- 🗃️ Template Library with pre-trained styles
- 📊 A/B Testing and Proposal Analytics
- 👥 Team/Agency Mode with shared credit pool

---

## 📄 Pages Required

### 1. Landing Page
- CTA, Features, Pricing, Testimonials

### 2. Signup / Login
- Email/password form, Google OAuth (optional)

### 3. Dashboard
- Welcome section, remaining credits, quick links

### 4. Generate Proposal
- Input box (job description)
- Dropdowns for tone, category
- Output area for generated text
- Buttons: Copy, Save, Regenerate

### 5. Proposal History
- List of proposals with filters
- Edit, view, delete, and export

### 6. Profile Page
- Add/edit skills
- Experience summary
- Preferred tone of writing

### 7. Billing Page
- Plan details
- Usage logs
- Upgrade/downgrade/cancel

### 8. Admin Panel (optional)
- User list and usage logs
- Credit adjustments
- Logs of proposal generations

---

## 🧱 Tech Stack

### 🔧 Backend (Django REST)
- Django Rest Framework
- Simple JWT for auth
- PostgreSQL
- OpenAI API integration
- Stripe for billing
- Celery (optional for async tasks)

### 🎨 Frontend (React)
- React with Redux Toolkit
- Tailwind CSS
- React Icons
- Framer Motion
- Axios for API calls




