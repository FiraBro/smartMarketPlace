# smartMarketPlace

A modern, full-featured e-commerce platform that seamlessly connects independent sellers with buyers, empowering entrepreneurship and simplifying online shopping.

## Overview

smartMarketPlace is a dynamic online marketplace designed to bridge the gap between sellers and buyers. We provide sellers with a powerful storefront management system and give buyers a safe, intuitive, and personalized shopping experience. Whether you're starting your first online business or looking for unique products, our platform is your one-stop solution.

## Key Features

 ### For Buyers
 
Personalized Dashboard: Track orders, wishlists, and saved payment.

Advanced Search & Filtering: Find exactly what you're looking for with filters for price, category, seller rating, and more.

Product Reviews & Ratings: Make informed decisions based on community feedback.

Order Tracking: Real-time updates on your order status from purchase to delivery.

Wishlist & Save for Later: Curate your favorite items easily.

 ### For Seller
 
Easy Store Setup: Create and customize your own digital storefront in minutes.

Product Management: Effortlessly add, edit, and organize your product catalog with bulk import/export options.

Inventory & Order Management: Keep track of stock levels and process customer orders efficiently.

Sales Analytics Dashboard: Gain insights into your performance with visual charts and reports.

Secure Payout System: Get paid reliably with automated and transparent payout schedules.

 ### PlatForm-Wide

Robust Admin Panel: Comprehensive backend for platform management, user moderation, and analytics.

Responsive Design: A seamless experience on desktops, tablets, and mobile devices.

Scalable Architecture: Built to handle growth in users, sellers, and transactions.

### Tech Stack

Frontend: React.js / Tailwind Css 

Backend: Node.js (Express) 

Database: MongoDB

Authentication: session / OAuth 2.0

Cloud Storage: Cloudinary (for images)

Payments: P2P Form

Deployment: Docker, Vercel 

### Infrastructure

Containerization: Docker & Docker Compose

Reverse Proxy: Nginx

Logging: ELK Stack (Elasticsearch, Logstash, Kibana)

### Quick Start with Docker

Docker Engine 20.10+

Docker Compose 2.0+

Git
### 1. Clone the Repository

```bash
git clone https://github.com/FiraBro/smartMarketPlace.git
cd smartMarketPlace
```

### 2. Environment Configuration

```env
PORT=5000
SECRET=your_secret_key
MONGODB_URI=mongodb://localhost:27017/smartmarketplace

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

### 3. Start the Applications

```bash
docker-compose up -d
```
