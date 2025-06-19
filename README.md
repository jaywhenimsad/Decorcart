# DecorCart - Furniture & Home Decor E-Commerce Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

A full-stack online furniture store built with:
- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Authentication**: JWT

## Features

### User Side
- Browse furniture & decor products
- Add to cart & checkout system
- Order tracking
- User authentication

### Admin Side
- Product management (CRUD)
- Order processing
- Inventory control
- Sales analytics

## Installation

1. Clone the repository:
```bash
[git clone https://github.com/your-username/DecorCart.git](https://github.com/jaywhenimsad/Decorcart.git)
cd DecorCart
```

2. Configure the .env in backend/.env
```
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=decorcart_db
JWT_SECRET=your_secret_key
```


3. Install dependencies:
```
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```
4. Run The Application:
```
# Backend (from /backend)
npm start

# Frontend (from /frontend)
npm start
```
