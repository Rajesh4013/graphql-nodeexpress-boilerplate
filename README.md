# GraphQL Node Express Boilerplate

A robust and scalable boilerplate for building high-performance Node.js applications using Express and GraphQL.

## **Features**

- **Node.js + Express**: Provides a lightweight and fast backend framework for building server-side applications.
- **GraphQL API**: Enables the creation of flexible, efficient, and well-structured APIs.
- **Reloading with Nodemon**: Automatically restarts the server upon detecting file changes.
- **Extensible Architecture**: Built to scale with your application's growing complexity.
- **Environment Configuration**: Centralized environment management using `.env` files.

## **Getting Started**

### **Clone the Repository**

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/Rajesh4013/graphql-nodeexpress-boilerplate
```

---

### **Install Dependencies**

Navigate to the project directory and install the required dependencies:

```bash
cd graphql-nodeexpress-boilerplate
yarn install
```

---

### **Environment Setup**

Update your `.env` file in the root directory and configure it with the necessary environment variables. For example:

```
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/database
```

---

### **Start the Server**

Run the following command to start the server:

```bash
yarn start
```

This will start the application using `nodemon`, allowing the server to automatically restart whenever code changes are detected.

---

### **Access the Application**

Once the server is running, access the GraphQL playground at:

```
http://localhost:5000/graphql
```

---

## **Project Structure**

The project is structured to promote scalability and maintainability:

```
graphql-nodeexpress-boilerplate/
    |
    ├── prisma/                
    ├── resolvers/             
    ├── repos/                
    ├── utils/ 
    ├── workers/
    ├── app.js                 
    ├── .env
    ├── .gitignore
    ├── config.js
    ├── connection.js
    ├── context.js
    ├── schema.js                  
    ├── Dockerfile
    ├── README.md
    └── package.json           
```

---
