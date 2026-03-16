# 🛒 ShopKart — E-Commerce with UPI Payment

A full-featured React e-commerce mini project with user authentication, cart management, and UPI payment simulation.

---

## 🚀 Features

- **Authentication** — Register, Login, Logout with localStorage persistence
- **Protected Routes** — Orders & Profile pages require login
- **Product Catalog** — 12 products with search, filter, sort
- **Cart System** — Add/remove items, quantity controls, per-user cart
- **Checkout** — UPI (PhonePe/GPay/Paytm/BHIM), Credit/Debit Card, Cash on Delivery
- **Order History** — Full order records saved per user
- **User Profile** — Avatar, stats, recent orders
- **Responsive** — Mobile-friendly layout
- **Toast Notifications** — Feedback for every action

---

## 📁 Project Structure

```
shopkart/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / .module.css
│   │   ├── CartSidebar.jsx / .module.css
│   │   ├── CheckoutModal.jsx / .module.css
│   │   ├── ProductCard.jsx / .module.css
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ToastContext.jsx
│   ├── pages/
│   │   ├── Home.jsx / .module.css
│   │   ├── Products.jsx / .module.css
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Auth.module.css
│   │   ├── Orders.jsx / .module.css
│   │   └── Profile.jsx / .module.css
│   ├── styles/
│   │   └── global.css
│   ├── utils/
│   │   └── products.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ installed ([download](https://nodejs.org))
- npm or yarn

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

---

## ☁️ Deploy to Vercel

### Method 1: Via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ShopKart"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/shopkart.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com) → Sign up / Log in
   - Click **"Add New Project"**
   - Click **"Import"** next to your `shopkart` repo
   - Framework: **Vite** (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click **"Deploy"**
   - ✅ Done! Your URL: `https://shopkart.vercel.app`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Inside shopkart folder
cd shopkart

# Deploy (follow prompts)
vercel

# For production
vercel --prod
```

### Method 3: Drag & Drop

1. Build first: `npm run build`
2. Go to [vercel.com/new](https://vercel.com/new)
3. Drag the **`dist/`** folder onto the page
4. Done! Instant deploy.

---

## 🔧 Build for Production

```bash
npm run build
# Output is in /dist folder
```

---

## 🌐 Other Hosting Options

| Platform   | Command / Steps                            | Free Tier |
|------------|---------------------------------------------|-----------|
| **Netlify**  | `netlify deploy --dir=dist --prod`         | ✅ Yes    |
| **GitHub Pages** | Use `gh-pages` npm package            | ✅ Yes    |
| **Firebase** | `firebase deploy`                         | ✅ Yes    |
| **Render**   | Connect GitHub repo, set build = `npm run build`, publish = `dist` | ✅ Yes |

---

## 🧪 Test Accounts

After registering any account, you can also use the **"Try Demo Account"** button on the Login page.
Or register your own at `/register`.

---

## 📝 Notes

- Passwords are stored in localStorage for demo purposes. In production, use a backend with bcrypt hashing.
- UPI payment is simulated (no real transactions).
- All data persists in browser localStorage.
