# Fetch Dog Adoption Web App 🐾 

## Overview 🌐
This web application, built for dog lovers, enables users to search through a database of shelter dogs with the aim of finding them a new home. The app uses React as the primary framework with Chakra UI for the user interface and several other libraries to ensure a seamless user experience.

## General Requirements 📋 
- Users input their name and email on a login screen to authenticate.
- Authenticated users browse available dogs, filter by breed, view paginated results sorted by breed (modifiable), and select their favorite dogs.
- All fields of the Dog object are presented, and users generate matches based on favorite dogs.

## Additional Requirements 📌
- The app is hosted online with the source code stored in a public Git repository.
- The app includes documentation to run the site locally.

## Tech Stack 🛠
- **React**: For building the user interface.
- **Chakra UI**: For styling components.
- **Axios**: For making API requests.
- **React Query**: For querying data.
- **React Router Dom**: For routing.
- **Vite**: For building the application and local development.
- **Jest**: For unit tests.
- **Zustand**: For state management.

## API Reference 📚 
- Base URL: `https://frontend-take-home-service.fetch.com`

### Endpoints
- **Authentication**
  - `POST /auth/login`
  - `POST /auth/logout`
- **Dog Information**
  - `GET /dogs/breeds`
  - `GET /dogs/search`
  - `POST /dogs`
  - `POST /dogs/match`
- **Location Information**
  - `POST /locations`
  - `POST /locations/search`


## Setup and Installation 🚀
### Prerequisites
- Node.js (14.x or higher recommended)
- npm or yarn

### Steps
1. Clone the Repository
   ```
   https://github.com/kvo189/fetch-take-home-2.git
   ```
2. Navigate to Project Directory
   ```
   cd fetch-take-home-2
   ```
3. Install Dependencies
   ```
   npm install
   # Or using yarn
   yarn
   ```
4. Running TailwindCSS - To watch and build your TailwindCSS, run the following command:
   ```
   npm run tailwind
   ```
5. Running Tests
   ```
   npm run test
   ```
6. Start the Development Server
   ```
   npm run dev
   # Or using yarn
   yarn dev
   ```
7. Build the Project
   ```
   npm run build
   # Or using yarn
   yarn build
   ```

## Links
- Deployed Site: https://fetch-take-home-2.vercel.app/
- Public Repository: https://github.com/kvo189/fetch-take-home-2

## Project Structure 🏗

```
├─ src/                  # Source directory containing all application code
│  ├─ App.tsx            # Main App component file
│  ├─ main.tsx           # Entry point of the application
│  ├─ index.css          # Global styles
│  ├─ assets/            # Stores static files like images or SVGs
│  ├─ components/        # Holds reusable UI components
│  ├─ config/            # Keeps configuration files
│  ├─ context/           # Contains Context API related files
│  ├─ features/          # Logic, components, and types related to specific features
│  ├─ hooks/             # Stores custom React hooks
│  ├─ lib/               # Initializes third-party libraries and manages utility functions
│  ├─ providers/         # Manages providers such as theme or authentication providers
│  ├─ routes/            # Defines the routing logic and route-specific components
│  └─ utils/             # Holds utility functions and helpers
├─ tailwind.config.js    # Configuration file for TailwindCSS
├─ tsconfig.json         # Configuration file for TypeScript
└─ vite.config.ts        # Configuration file for Vite

```

##  Routing and Routes 🌐

The routing in this project is managed by `react-router-dom`, a standard library for implementing routing in React applications. Below is a summary of how routing is structured within this application:

#### 1. **AppRoutes**
Located in `src/routes/index.tsx`, `AppRoutes` is the main component where all the application routes are defined and configured. It combines `authRoutes`, `commonRoutes`, and `searchRoutes` to form the application’s routing structure.

   - **`commonRoutes`**
     - **`/` (Root)**
       - **Component:** `Landing`
       - **Description:** This route renders the Landing component, which contains a Call-to-Action to direct users to `/auth/login`.

   - **`authRoutes`**
     - **`/auth/*`**
       - **Component:** `AuthRoutes`
       - **Description:** This route is a placeholder for all authentication-related routes like login.

   - **`searchRoutes`**
     - **`/search/*`**
       - **Component:** `SearchRoutes`
       - **Description:** This route is a placeholder for all search-related routes such as dog search and match.

#### 2. **SearchRoutes**
The `SearchRoutes` component, located within the search feature, defines the sub-routes related to the search functionality.

   - **`/search/match`**
     - **Component:** `DogMatch`
     - **Description:** This route renders when the API is called to `/dogs/match`.

   - **`/search/dog`**
     - **Component:** `DogSearch`
     - **Description:** This route contains filtering and sorting options, along with pagination and the feature to favorite dogs.

   - **`/search/` (Root)**
     - **Component:** `Locator`
     - **Description:** This route helps pinpoint where the user is to ease the searching process.

#### 3. **Route Navigation Flow**
   - The user lands on the `Landing` component and is directed to `/auth/login` through a Call-to-Action.
   - Upon successful login, the user is routed to `/search`.
   - Inside `/search`, the user has the option to navigate to `/search/dog` for dog searches, `/search/match` for matching, and the root `/search/` to use the `Locator`.

#### 4. **Lazy Loading**
The application uses `lazyImport` utility to lazily load the `AuthRoutes` and `SearchRoutes` components, ensuring optimal performance by only loading the components when they are needed.
