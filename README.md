# Ultimate Organizer

![Hero Banner](public/images/hero-banner.png)

Ultimate Organizer is a comprehensive web application designed to streamline the management of wedding and event planning. It provides distinct dashboards and functionalities for both administrators and clients, ensuring a smooth and organized event preparation process.

## ✨ Features

### Admin Dashboard
*   **Client Management:** Add, view, edit, and delete client records.
*   **Invoice Generation & Management:** Automatically generate and send invoices to clients, with options to view and manage existing invoices.
*   **Traditional Attire (Baju Adat) Management:** A dedicated module to manage traditional attire inventory, including adding new items, updating details, and tracking stock.
*   **Event Timeline Management:** Create, update, and track the progress of various event activities for each client.
*   **Meeting Management:** View and manage meeting requests from clients, including approval and rejection.
*   **Comprehensive Statistics:** Get an overview of total clients, completed events, active events, and revenue.
*   **Calendar View:** Visualize upcoming meetings and events on a calendar.

### User Dashboard
*   **Personalized Dashboard:** View a summary of their event details, including date, location, and package.
*   **Progress Tracking:** Monitor the overall progress of their event through a percentage-based indicator and detailed activity timelines.
*   **Traditional Attire Catalog:** Browse the available collection of traditional attire.
*   **Meeting Scheduling:** Easily request and schedule meetings with the event organizers.

### General Features
*   **User Authentication & Authorization:** Secure login, registration, and password management with role-based access control (Admin and User roles).
*   **Responsive Design:** Optimized for various screen sizes.
*   **Appearance Settings:** Toggle between light and dark themes.
*   **Search & Pagination:** Efficiently search and navigate through data tables.

## 🚀 Technologies Used

*   **Backend:**
    *   Laravel 12 (PHP Framework)
    *   Spatie/laravel-permission (Role & Permission Management)
    *   Barryvdh/laravel-dompdf (PDF Generation for Invoices)
    *   Laravel Mail (Email Notifications)
*   **Frontend:**
    *   React 19 (JavaScript Library)
    *   Inertia.js (Adapter for Laravel & React)
    *   TypeScript
    *   Vite (Frontend Tooling)
    *   Tailwind CSS (Utility-first CSS Framework)
    *   Shadcn/ui (UI Components)
    *   date-fns & dayjs (Date Manipulation)
    *   react-currency-input-field (Currency Formatting)
    *   sonner (Toast Notifications)

## ⚙️ Installation & Setup

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

*   PHP >= 8.2
*   Composer
*   Node.js >= 20
*   npm (Node Package Manager)

### Steps

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd Ultimate-Organizer
    ```

2.  **Install PHP Dependencies:**
    ```bash
    composer install
    ```

3.  **Install Node.js Dependencies:**
    ```bash
    npm install
    ```

4.  **Environment Configuration:**
    *   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    *   Generate an application key:
        ```bash
        php artisan key:generate
        ```
    *   Configure your database connection in the `.env` file. By default, it uses SQLite. If you prefer MySQL or PostgreSQL, update the `DB_CONNECTION` and other relevant `DB_` variables.
        ```dotenv
        DB_CONNECTION=sqlite
        # DB_DATABASE=/path/to/your/database.sqlite # For SQLite, default is database/database.sqlite
        # For MySQL:
        # DB_CONNECTION=mysql
        # DB_HOST=127.0.0.1
        # DB_PORT=3306
        # DB_DATABASE=laravel
        # DB_USERNAME=root
        # DB_PASSWORD=
        ```

5.  **Run Database Migrations and Seeders:**
    This will create the necessary tables and populate them with initial data, including an admin user.
    ```bash
    php artisan migrate --seed
    ```

6.  **Create Storage Symlink:**
    This is crucial for accessing uploaded images (e.g., Baju Adat) and generated invoices.
    ```bash
    php artisan storage:link
    ```

7.  **Start the Development Servers:**
    You'll need to run both the Laravel development server and the Vite frontend server.
    ```bash
    npm run dev
    ```
    This command uses `concurrently` to run `php artisan serve`, `php artisan queue:listen`, and `vite` simultaneously.

## 🖥️ Usage

Once the development servers are running, you can access the application in your web browser:

*   **Application URL:** `http://localhost:8000` (or the URL provided by `php artisan serve`)

### Default Credentials

An admin user is created by the seeder:

*   **Email:** `admin@uo.com`
*   **Password:** `admin123`

You can register new `user` accounts directly from the login page.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please feel free to open an issue or submit a pull request.

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE.md).
