# Database Setup & Connection Guide

## 📋 Quick Start (Every Time You Open Project)

### 1️⃣ **Start Backend Server**
```bash
cd server
npm run dev
```
✅ This automatically loads `.env` and connects to Supabase database
✅ Server runs on `http://localhost:5000`

### 2️⃣ **Browse Database (Optional)**
```bash
cd server
$env:DATABASE_URL='postgresql://postgres:T@vzBCj&z56ytQi@db.ficibjlqewvjakfvavyr.supabase.co:5432/postgres'
npx prisma studio
```
📊 Opens Prisma Studio at `http://localhost:5555` to view/edit data

### 3️⃣ **Sync Database Schema (After DB Changes)**
```bash
cd server
npx prisma db pull
```
🔄 Updates `prisma/schema.prisma` if database schema changed externally

### 4️⃣ **Generate Prisma Client**
```bash
cd server
npx prisma generate
```
✨ Regenerates Prisma types after schema changes

---

## ⚙️ Why This Works

**Problem:** Node.js doesn't automatically load `.env` files
**Solution:** 
- `import "dotenv/config"` at the TOP of `server/src/app.ts` loads environment variables
- When you run `npm run dev`, it loads the DATABASE_URL from `.env`
- Prisma can now access the database connection string

---

## 🗄️ Database Details

**Provider:** PostgreSQL (Supabase)  
**Host:** `db.ficibjlqewvjakfvavyr.supabase.co`  
**Username:** `postgres`  
**Database:** `postgres`  
**Port:** `5432`  
**Connection String:** See `server/.env`

---

## 🚀 Full Development Workflow

```bash
# 1. Open project
cd c:\Users\ivanp\Desktop\LinedUp

# 2. Install dependencies (first time only)
npm install
cd server && npm install && cd ..

# 3. Start backend
cd server
npm run dev

# 4. In another terminal, start frontend
npm start

# 5. In another terminal, view database (optional)
cd server
npx prisma studio --browser=none
# Then open http://localhost:5555 in browser
```

---

## ❗ Troubleshooting

**Q: "DATABASE_URL not found" error**
A: Make sure you're running from `server` directory and `.env` file exists

**Q: Prisma Studio won't connect**
A: Set environment variable first:
```bash
$env:DATABASE_URL='postgresql://postgres:T@vzBCj&z56ytQi@db.ficibjlqewvjakfvavyr.supabase.co:5432/postgres'
npx prisma studio
```

**Q: Server crashes after starting**
A: Check if port 5000 is already in use:
```bash
netstat -ano | findstr :5000
```

**Q: Schema not updating**
A: Run `npx prisma generate` after `db pull`:
```bash
npx prisma db pull
npx prisma generate
```

---

## 📁 Key Files

- **`server/.env`** - Database connection credentials
- **`server/src/app.ts`** - Main app file (has dotenv import)
- **`server/prisma/schema.prisma`** - Database schema definition
- **`server/src/utils/prisma.ts`** - Prisma client config
