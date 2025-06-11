# 💰 FinSight – Personal Finance Tracker

FinSight is a full-stack finance tracker application built with **Next.js 15 (App Router)**, **PostgreSQL**, **Prisma ORM**, and **Tailwind CSS**. It enables users to manage personal expenses, set monthly budgets, and gain spending insights through powerful visualizations.

---

## 🚀 Features

### ✅ Stage 1 – Transaction Tracker (✅ Completed)
- Add, edit, and delete transactions (amount, date, description)
- View a list of all transactions
- Monthly expense bar chart using **Recharts**
- Basic form validation (required fields, valid amount/date)

### ✅ Stage 2 – Categories & Dashboard (✅ Completed)
- All features from Stage 1, plus:
- Predefined categories (e.g., Food, Rent, Travel)
- Category-wise pie chart
- Dashboard includes:
  - Total monthly expenses
  - Category-wise breakdown
  - Most recent transactions

### ✅ Stage 3 – Budgeting & Insights (✅ Completed)
- All features from Stage 2, plus:
- Set monthly budgets per category
- Budget vs Actual comparison chart
- Simple spending insights:
  - Over-budget alerts
  - Top spending category
  - Spending trends

---

## 🧱 Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, shadcn/ui, Recharts
- **Backend**: API Routes (App Router), Prisma ORM
- **Database**: PostgreSQL (via Docker or hosted)
- **Deployment**: Vercel

---

## 📦 Getting Started (Local Development)

### 1. **Clone the Repository**
```bash
git clone https://github.com/gouravsharma-00/FinSight
cd FinSight
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up PostgreSQL with Docker
If you don't have Docker, install it from https://www.docker.com/products/docker-desktop and run
```bash
docker-compose up -d
```

### 4. Set Up Environment Variables
Create a .env file:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finance_db"
```
### 5. Push Prisma Schema to Database
```bash
npx prisma generate
npx prisma db push
```

### 6. Run the App
```bash
npm run dev
```
App should now be running at: http://localhost:3000