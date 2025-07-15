## ⚡ **Project: Simple User Authentication API**

### 💡 What it does

* Users can **register** with email & password.
* Users can **login** and get a "fake token" (we won’t do real JWT yet unless you want).
* Users can **see their profile info** if they are "logged in".

---

### ✅ What’s new compared to notes app

* You handle **users**, not just simple notes.
* You need to **store passwords securely** (we use bcrypt to hash passwords).
* You add **authentication logic** (checking login credentials).

---

### 💻 **Tech to use**

* Node.js
* Express
* `bcryptjs` for password hashing
* Store users in an **array or JSON file** (if you don’t want to use DB yet).

---

### 🗺️ **Endpoints you will create**

✅ **POST /register** — register a new user.
✅ **POST /login** — login user and return success message or "fake token".
✅ **GET /profile** — only accessible if "logged in" (for now, you can just simulate it).

---

### 💪 **Level up options after this**

* Add **JWT** for real authentication tokens.
* Store users in a database (MongoDB, PostgreSQL).
* Add logout, reset password, etc.

---

## ✉️ **Your next step**

If you want, I can help you step by step (without showing code first) — for example:
1️⃣ Setup project & install bcrypt.
2️⃣ Make a register route.
3️⃣ Then login route.
4️⃣ Then protected route.

