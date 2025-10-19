# 🚀 Quick Command Reference

## Installation Commands

### Server Setup
```powershell
cd d:\LibraryManagement\server
npm install
```

### Client Setup
```powershell
cd d:\LibraryManagement\client
npm install --legacy-peer-deps
```

## Running the Application

### Start Backend Server (Terminal 1)
```powershell
cd d:\LibraryManagement\server
npm start
```
✅ Server runs on: **http://localhost:5000**

### Start Frontend Application (Terminal 2)
```powershell
cd d:\LibraryManagement\client
npm start
```
✅ Application opens at: **http://localhost:3000**

## Quick Copy-Paste Commands

### Complete Setup (Run in order)
```powershell
# 1. Install server dependencies
cd d:\LibraryManagement\server
npm install

# 2. Install client dependencies
cd d:\LibraryManagement\client
npm install --legacy-peer-deps
```

### Run Application (Use 2 separate terminals)

**Terminal 1 - Backend:**
```powershell
cd d:\LibraryManagement\server
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd d:\LibraryManagement\client
npm start
```

## Troubleshooting Commands

### If client install fails:
```powershell
cd d:\LibraryManagement\client
npm install --legacy-peer-deps --force
```

### Clear cache and reinstall:
```powershell
# Server
cd d:\LibraryManagement\server
rm -rf node_modules package-lock.json
npm install

# Client
cd d:\LibraryManagement\client
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** Default connection (check server/.env)

## Default Credentials

**Admin:**
- Username: admin
- Password: admin123

**User:**
- Username: user
- Password: user123

---

## 🎯 What to Expect

After running both commands, you should see:

**Backend Terminal:**
```
Server Is Connected to Port 5000
MongoDB Connected Successfully
```

**Frontend Terminal:**
```
Compiled successfully!
webpack compiled with 0 warnings
```

The browser will automatically open to http://localhost:3000

---

## ✨ New Features Available

1. **Enhanced Book Cards** - Hover over books to see actions
2. **Rating System** - Click star icon to rate books
3. **Reservations** - Reserve unavailable books
4. **Notifications** - Bell icon in navbar shows updates
5. **Advanced Search** - Use filters to find books
6. **Dashboard Stats** - View library statistics
7. **Dark/Light Mode** - Toggle theme in navbar

Enjoy your professional library management system! 📚
