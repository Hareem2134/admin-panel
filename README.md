# Foodtuck Marketplace - Customized & International Cuisine Delivery Q-Commerce Website

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). The Foodtuck Marketplace is a dynamic, feature-rich eCommerce platform designed to provide a seamless online shopping experience. It includes a fully functional frontend built with React, Next.js, and TypeScript, and a separate admin panel for managing products, orders, and discount codes.

---

## Features

### Frontend Features
- **Product Detail Page:** Detailed product information, add to cart/wishlist, related products.
- **Search Bar:** Real-time filtering, auto-suggestions, optimized API calls.
- **Shopping Cart:** Persistent cart storage, quantity management, real-time price calculation.
- **Wishlist:** Save favorite products, integration with cart.
- **Checkout Flow:** Shipping details input, real-time order summary, order processing animation.
- **Reviews and Ratings:** Star rating system, review submission, display past reviews.
- **Pagination:** Efficient page navigation, dynamic page buttons.
- **Filter Panel:** Multi-category selection, price range filtering, tag-based grouping.
- **Related Products:** Recommendations based on user preferences.
- **Notifications:** Real-time success alerts and error messages.
- **Product Comparison:** Side-by-side comparison, sorting by attributes.
- **Multi-Language Support:** Dynamic language switching.
- **FAQ and Help Center:** Accordion-style UI for common questions.
- **Social Media Sharing:** Share products on Facebook, Twitter, WhatsApp, and Pinterest.

### Admin Panel Features
- **Product Management:** CRUD operations for products.
- **Order Management:** View and manage orders.
- **Discount Codes:** Generate and manage discount codes for promotions.

---

## Technologies Used

### Frontend
- **React:** For building user interfaces.
- **Next.js:** For server-side rendering and dynamic routing.
- **TypeScript:** For type safety and maintainability.
- **Tailwind CSS:** For responsive UI design.
- **Framer Motion:** For smooth animations.
- **Sanity CMS:** For scalable product data management.

### Backend (Admin Panel)
- **Node.js:** For server-side logic.
- **JWT:** For authentication and authorization.

---

## Getting Started

### Frontend
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/foodtuck-marketplace.git
   ```
2. Navigate to the frontend directory:
   ```bash
   cd foodtuck-marketplace/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Admin Panel
1. Navigate to the admin panel directory:
   ```bash
   cd foodtuck-marketplace/admin-panel
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:5000](http://localhost:5000) to access the admin panel.

---

### Frontend
- Visit `http://localhost:3000` to view the frontend.
- Use the search bar to find products, apply filters, and browse through categories.
- Add products to the cart or wishlist, and proceed to checkout.

### Admin Panel
- Visit `http://localhost:5000` to access the admin panel.
- Log in with admin credentials to manage products, orders, and discount codes.

---

## Backend (Admin Panel)

The admin panel is built using **Next.js** for server-side rendering and dynamic routing, **Sanity CMS** for scalable product data management, and **Clerk** for authentication and user management. It provides a robust interface for administrators to manage the eCommerce platform efficiently.

### Key Features:
- **Product Management:** Perform CRUD operations (Create, Read, Update, Delete) for products.
- **Order Management:** View and manage customer orders, including order status and details.
- **Discount Codes:** Generate and manage discount codes for promotions and special offers.
- **User Management:** Manage user accounts, roles, and permissions using **Clerk**.
- **Analytics Dashboard:** View sales, revenue, and customer insights.

### Technologies Used:
- **Next.js:** For building the admin panel with server-side rendering and API routes.
- **Sanity CMS:** For managing product data, categories, and inventory.
- **Clerk:** For secure authentication, user management, and role-based access control.
- **Tailwind CSS:** For a responsive and modern admin UI.
- **React Hook Form:** For efficient form handling and validation.
- **SWR or React Query:** For data fetching and caching.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---