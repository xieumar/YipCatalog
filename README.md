# YipCatalog

YipCatalog is a mobile product catalog application built with React Native and Expo. It allows authenticated users to create, manage, and display a limited catalog of products, each with a name, price, and image. The application focuses on clean architecture, modern state management, and a scalable project structure suitable for real-world mobile applications.

## Features

*   **User Authentication:** Secure sign up, login, and logout functionalities.
*   **Product Catalog:** Gallery-style listing of products.
*   **Product Management:** Ability to add new products with a name, price, and image.
*   **Product Limit:** Enforced limit on the number of products a user can create.
*   **Detail View:** Dedicated product detail screens.
*   **Profile View:** User-specific profile displaying their owned products.
*   **Persistent Sessions:** Maintained authentication sessions across app restarts.
*   **Modern UI:** Clean and modern user interface with a centralized design system.

## Tech Stack

*   **Framework:** React Native with Expo (SDK 54)
*   **Language:** TypeScript
*   **Navigation:** `expo-router` (v6) for file-system-based routing.
*   **State Management:** `Zustand` (v5) for global state management.
*   **Backend & Database:** `Supabase` (`supabase-js v2`) for user authentication and data persistence.
*   **UI Components:** Custom-built components for maximum control and consistency.
*   **Icons:** `@expo/vector-icons` for a rich icon set.
*   **Storage:** `AsyncStorage` (used internally by Supabase for session persistence).

## Project Structure

The project follows a modular and feature-oriented structure:

```
├── app/                      # Application screens and routing logic
│   ├── (auth)/               # Authentication screens (login, signup)
│   ├── (tabs)/               # Main authenticated tab navigation
│   ├── products/             # Product detail screens ([id].tsx)
│   ├── _layout.tsx           # Root layout and navigation setup
│   └── index.tsx             # Application entry point
├── components/               # Reusable UI components
│   ├── auth/                 # Authentication-related UI components
│   ├── products/             # Product-related UI components
│   └── ui/                   # Shared, generic UI components (e.g., modals)
├── store/                    # Global state management with Zustand
│   ├── authStore.ts          # Authentication state and logic
│   └── productStore.ts       # Product state and CRUD logic
├── lib/                      # External library initializations
│   └── supabase.ts           # Supabase client initialization
├── constants/                # Application-wide constants
│   └── theme.ts              # Centralized design system definition
├── hooks/                    # Custom React hooks
│   └── useProtectedRoute.ts  # Route protection based on authentication state
├── types/                    # Shared TypeScript type definitions
└── utils/                    # Utility functions
```

This structure effectively separates routing concerns from application logic and groups code by feature, enhancing maintainability and scalability.

## Navigation & Routing

Navigation is implemented using `expo-router`, leveraging its file-system-based routing capabilities:

*   The **root layout** (`app/_layout.tsx`) dynamically routes the user to either the authentication flow or the main application based on their authentication status.
*   The `(auth)` route group defines the navigation stack for **login and signup screens**.
*   The `(tabs)` route group provides the main authenticated interface, which includes the **product feed (Home) and user profile screens**.
*   **Dynamic routes**, such as `products/[id].tsx`, are utilized for displaying individual product detail screens.
*   A **floating action button (FAB)** in the tab navigation facilitates quick access to the "Add Product" screen.

## State Management

Global state is efficiently managed using `Zustand`, with a clear separation of concerns into domain-specific stores:

*   **`authStore.ts`**:
    *   Manages user session state, authentication status (`isAuthenticated`), and loading indicators.
    *   Directly integrates with Supabase authentication.
    *   Subscribes to `onAuthStateChange` events from Supabase for reactive updates to the authentication state across the application.
*   **`productStore.ts`**:
    *   Handles the fetching, creation, and deletion of product data.
    *   Stores product data retrieved from Supabase.
    *   Ensures product-related logic is decoupled from UI components, promoting reusability and maintainability.

This approach guarantees predictable state updates and a clean separation of concerns, crucial for a maintainable application.

## Backend & Data Layer

`Supabase` is employed as the backend-as-a-service solution, initialized and configured within `lib/supabase.ts`:

*   **Authentication:** Utilizes Supabase Auth for robust email/password authentication, including secure and persistent user sessions.
*   **Database:** Product data is stored in a PostgreSQL database, with all CRUD operations (Create, Read, Update, Delete) handled through Supabase client queries executed within the `Zustand` stores.

## UI & Design System

The application boasts a custom, centralized design system, meticulously defined in `constants/theme.ts`:

*   **Theming:** The `theme` object encapsulates a consistent color palette, spacing units, border radii, and typography styles, ensuring visual harmony throughout the application.
*   **Custom Components:** Components like `ThemedText` and `ThemedView` are designed to consume this theme, ensuring visual consistency and future-proofing for potential theme-switching capabilities (e.g., light/dark modes).
*   **Reusable Elements:** The UI is constructed using a combination of primitive React Native components and custom-built, reusable elements such as modals and buttons, which reduces duplication and promotes a cohesive user experience.
*   **Accessibility:** Features like keyboard-aware layouts on authentication screens are implemented to enhance user accessibility.

## Environment Setup

To get the development environment running:

1.  **Create a `.env` file** in the project root with your Supabase credentials:

    ```
    EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

2.  **Install dependencies** and start the development server:

    ```bash
    npm install
    npx expo start
    ```

3.  **Run the app** using the Expo Go app on your mobile device or an emulator/simulator.

## Limitations & Trade-offs

*   **Custom UI Development:** The application primarily uses custom-built UI components instead of a comprehensive third-party component library. While offering full control, this may increase development and maintenance effort.
*   **Platform-Specific Code:** Some platform-specific files (e.g., for iOS vs. web) exist to handle minor differences, a common but manageable aspect of cross-platform development.
*   **Offline Support:** Comprehensive offline data synchronization and support are not currently implemented.
*   **Image Handling:** Product images are currently handled via base64 strings. Integration with Supabase Storage for more efficient image uploads and management is a planned improvement.

## Future Improvements

*   **Supabase Storage Integration:** Implement direct integration with Supabase Storage for optimized image uploads and retrieval.
*   **Server-Side Optimizations:** Introduce server-side filtering and pagination for improved performance with larger datasets.
*   **Automated Testing:** Develop a comprehensive suite of automated tests to ensure application stability and reliability.
*   **Offline Capabilities:** Add robust offline caching and synchronization features for a better user experience in low-connectivity environments.
*   **UI/UX Enhancements:** Refine animations and transitions to create a more polished and engaging user interface.

## Summary

YipCatalog demonstrates a clean, scalable React Native architecture utilizing Expo, Zustand, and Supabase. It effectively showcases modern navigation patterns, structured state management, and a thoughtful UI system, making it suitable as both a foundation for production applications and a strong technical case study.