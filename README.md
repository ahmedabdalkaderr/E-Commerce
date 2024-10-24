
## Project Overview
This e-commerce application is designed to provide a seamless online shopping experience. It allows users to browse, purchase, and review products. Administrators and vendors can manage products, categories, and brands. The system is built using Node.js, Express, and MongoDB, offering scalability and efficiency in managing product listings, orders, and user interactions.

## Features
User authentication with JWT (JSON Web Tokens).

Role-based access control (customers, vendors, admins).

Product management (create, update, delete products).

Cart and order management.

Image upload with Multer and Sharp.

Input validation using Express Validator.

Logging with Morgan.

Password hashing with bcrypt for security.


## Technologies Used
Backend: Node.js, Express.js.

Database: MongoDB (via Mongoose).

Authentication: JWT (jsonwebtoken).

File Uploads: Multer, Sharp.

Security: bcrypt for password encryption.

Environment Configuration: dotenv.

Validation: express-validator.

Compression: compression middleware for performance improvement.


## Installation
1. **Clone the repository**:
   ```
   git clone https://github.com/your-username/lms.git
   ```
2. **Install the dependencies**:
   ```
   npm install
   ```
3. **Create a .env file in the root of your project and add the following environment variables**:

   NODE_ENV=development.

   MONGO_URI=your_mongodb_connection_string.

   JWT_SECRET=your_jwt_secret.

4. **Start the application mode**:

   for development 
   ```
   npm run dev
   ```

   for production 
   ```
   npm run prod
   ```
