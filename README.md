# BookWise - Advanced Library Management System

A modern, full-stack library management system built with React and Node.js, featuring advanced functionality and a professional user interface.

## 🌟 Features

### 🔐 Authentication & User Management
- **Professional Sign-up/Sign-in Pages**: Modern, responsive design with comprehensive form validation
- **Secure Authentication**: Passport.js with bcrypt password hashing
- **Session Management**: Persistent login sessions with cookies
- **User Profiles**: Complete user profile management with editing capabilities

### 📚 Book Management
- **Comprehensive Book Catalog**: Full CRUD operations for books
- **Advanced Search**: Real-time search with suggestions and filters
- **Book Categories & Genres**: Organized book classification
- **Book Availability Tracking**: Real-time availability status

### 🔔 Notification System
- **Real-time Notifications**: In-app notification bell with live updates
- **Notification Types**: Info, success, warning, and error notifications
- **Notification Management**: Mark as read, delete, and bulk operations
- **Admin Broadcasting**: System-wide notification broadcasting

### 🛒 Reservation System
- **Book Reservations**: Request books with pickup scheduling
- **Reservation Management**: Admin approval workflow
- **Status Tracking**: Pending, approved, rejected, completed statuses
- **Pickup Codes**: Secure pickup verification system

### ⭐ Rating & Review System
- **Book Ratings**: 5-star rating system with reviews
- **Review Management**: Add, edit, and delete reviews
- **Rating Statistics**: Average ratings and distribution charts
- **Top Rated Books**: Popular books based on ratings

### 🏪 Marketplace
- **Book Trading**: Buy/sell books within the community
- **Listing Management**: Create, update, and delete listings
- **Interest System**: Express interest in available books
- **Marketplace Stats**: Trading statistics and analytics

### 📊 Dashboard & Analytics
- **Comprehensive Dashboard**: Real-time statistics and metrics
- **Visual Charts**: Interactive charts for trends and analytics
- **Popular Books**: Most requested and rated books
- **Activity Feed**: Recent system activity and updates

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with tablet and desktop support
- **Dark/Light Theme**: Theme toggle with system preference detection
- **Modern Components**: Professional, accessible UI components
- **Smooth Animations**: Engaging micro-interactions and transitions

### 🔍 Advanced Search
- **Intelligent Search**: Real-time search with autocomplete
- **Search Suggestions**: Book, author, and genre suggestions
- **Recent Searches**: Search history with quick access
- **Keyboard Navigation**: Full keyboard support for accessibility

## 🚀 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **React Icons**: Comprehensive icon library
- **React Toastify**: Toast notifications
- **CSS3**: Modern CSS with Flexbox and Grid
- **Responsive Design**: Mobile-first approach

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **Passport.js**: Authentication middleware
- **bcryptjs**: Password hashing
- **Express Session**: Session management
- **CORS**: Cross-origin resource sharing

### Development Tools
- **Nodemon**: Development server auto-restart
- **Morgan**: HTTP request logger
- **Dotenv**: Environment variable management

## 📁 Project Structure

```
LibraryManagement/
├── client/                     # React frontend
│   ├── public/                # Static assets
│   └── src/
│       ├── pages/
│       │   ├── Components/    # Reusable components
│       │   │   ├── DashboardStats.jsx
│       │   │   ├── NotificationBell.jsx
│       │   │   ├── SearchBar.jsx
│       │   │   ├── ThemeToggle.jsx
│       │   │   └── Navbar.jsx
│       │   ├── LoginSingup/   # Authentication pages
│       │   │   ├── SignIn.jsx
│       │   │   └── SignUp.jsx
│       │   └── Pages/         # Main application pages
│       └── Assets/            # CSS and static resources
├── server/                     # Node.js backend
│   ├── api/
│   │   ├── controller/        # Business logic
│   │   ├── models/           # Database models
│   │   └── routes/           # API routes
│   ├── config/               # Configuration files
│   └── index.js              # Server entry point
└── README.md                 # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup
```bash
cd server
npm install
npm start
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

### Environment Variables
Create a `.env` file in the server directory:
```env
DB_URL=mongodb://localhost:27017/librarymanagement
SECRET=your-secret-key-here
PORT=5000
```

## 🎯 Key Features Implemented

### 1. Professional Authentication System
- ✅ Modern signup/login pages with validation
- ✅ Password strength requirements
- ✅ Email format validation
- ✅ Secure session management
- ✅ Error handling and user feedback

### 2. Advanced Notification System
- ✅ Real-time notification bell
- ✅ Notification types (info, success, warning, error)
- ✅ Mark as read/delete functionality
- ✅ Admin notification broadcasting
- ✅ Notification persistence

### 3. Intelligent Search System
- ✅ Real-time search with suggestions
- ✅ Search history and recent searches
- ✅ Keyboard navigation support
- ✅ Search filters and sorting
- ✅ Autocomplete functionality

### 4. Comprehensive Dashboard
- ✅ Real-time statistics and metrics
- ✅ Interactive charts and graphs
- ✅ Popular books and trends
- ✅ Activity feed and notifications
- ✅ Responsive design

### 5. Modern UI/UX
- ✅ Professional design system
- ✅ Dark/light theme support
- ✅ Responsive mobile-first design
- ✅ Smooth animations and transitions
- ✅ Accessibility features

### 6. Advanced Backend Features
- ✅ RESTful API design
- ✅ Database models and relationships
- ✅ Authentication middleware
- ✅ Error handling and validation
- ✅ Scalable architecture

## 🔧 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /logedinuser` - Get current user

### Books
- `GET /allBook` - Get all books
- `POST /addBook` - Add new book
- `GET /search/:query` - Search books
- `POST /addToCart` - Add book to cart

### Notifications
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark notification as read
- `DELETE /notifications/:id` - Delete notification

### Reservations
- `POST /reservations` - Create reservation
- `GET /reservations/user` - Get user reservations
- `PUT /reservations/:id/status` - Update reservation status

### Ratings
- `POST /ratings` - Add book rating
- `GET /ratings/book/:bookId` - Get book ratings
- `DELETE /ratings/:id` - Delete rating

### Marketplace
- `POST /marketplace/list` - List book for sale
- `GET /marketplace` - Get all listings
- `POST /marketplace/:id/interest` - Express interest

## 🎨 Design System

### Color Palette
- **Primary**: #667eea (Blue)
- **Secondary**: #764ba2 (Purple)
- **Success**: #48bb78 (Green)
- **Warning**: #ed8936 (Orange)
- **Error**: #e53e3e (Red)
- **Neutral**: #4a5568 (Gray)

### Typography
- **Font Family**: Inter, system fonts
- **Headings**: 700 weight
- **Body**: 400-500 weight
- **Small Text**: 300-400 weight

### Spacing
- **Base Unit**: 8px
- **Small**: 4px, 8px
- **Medium**: 16px, 24px
- **Large**: 32px, 48px

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Touch-friendly interface
- Swipe gestures
- Optimized navigation
- Reduced data usage

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 🚀 Performance Optimizations

- Lazy loading components
- Image optimization
- Bundle splitting
- Caching strategies
- Database indexing
- API response optimization

## 🧪 Testing

The application includes comprehensive error handling and validation:

- Form validation on frontend
- API validation on backend
- Error boundary components
- User feedback systems
- Loading states and indicators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Future Enhancements

- [ ] Real-time chat system
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Integration with external APIs
- [ ] Advanced recommendation engine
- [ ] Social features and book clubs
- [ ] Payment integration for marketplace
- [ ] Advanced reporting system

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**BookWise** - Making library management modern, efficient, and user-friendly! 📚✨