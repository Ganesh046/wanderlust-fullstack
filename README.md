# 🌍 Wanderlust - Full Stack Travel Accommodation Booking Platform

![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.0-6DB33F?logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?logo=springsecurity&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?logo=hibernate&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?logo=json-web-tokens&logoColor=white)

Wanderlust is a full-stack travel accommodation booking application inspired by Airbnb. Users can browse stays, create their own listings, book accommodations, manage trips, and share reviews.

The frontend is built with **React**, while the backend is developed using **Spring Boot**, **Spring Security**, **JWT Authentication**, **Spring Data JPA (Hibernate)**, and **MySQL**. The application also integrates **Cloudinary** for image uploads and **OpenStreetMap Nominatim API** for geocoding listing locations.

---

## 🚀 Features

### Authentication

- User registration and login
- JWT-based authentication
- BCrypt password encryption
- Protected routes
- Owner and review author authorization

### Listings

- Browse all listings
- View listing details
- Create, update, and delete listings
- Upload listing images
- Search listings
- Filter listings by category

### Reviews

- Add reviews
- Delete your own reviews
- 5-star rating system

### Bookings

- Book available properties
- Prevent overlapping bookings
- Cancel bookings
- View My Trips
- View Incoming Guest Bookings

### Maps & Images

- Automatic geocoding using OpenStreetMap
- Display listing locations on a map
- Image upload and storage using Cloudinary

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React, React Router, Axios, Context API, CSS |
| **Backend** | Java 21, Spring Boot 4.1.0, Spring MVC, Spring Security, Spring Data JPA (Hibernate), Maven |
| **Database** | MySQL |
| **Cloud Services** | Cloudinary, OpenStreetMap Nominatim API |

---

## 📂 Project Structure

```text
wanderlust-fullstack/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── application.properties
│
└── README.md
```

---

## 🔒 Security

- JWT Authentication
- Stateless Authentication
- BCrypt Password Encoding
- Spring Security Filter Chain
- Custom JWT Authentication Filter
- Protected REST APIs
- Role-based Authorization

---

## 🏗️ Backend Architecture

```text
Controller
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
MySQL Database
```

The backend also includes:

- DTOs
- Entity Mappers
- Global Exception Handling
- Cloudinary Integration
- Geocoding Service

---

## ⚙️ Getting Started

### Clone the repository

```bash
git clone https://github.com/Ganesh046/wanderlust-fullstack.git
```

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend

```properties
JWT_SECRET=

DB_URL=
DB_USERNAME=
DB_PASSWORD=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend

```properties
VITE_API_BASE_URL=
```

---

## 📸 Screenshots

Screenshots will be added soon.

---

## 👨‍💻 Author

**Ganesh Majagi**

GitHub: https://github.com/Ganesh046
