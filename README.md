# Tzeva Adom Statistics

## Overview
Tzeva Adom Statistics is a web application that visualizes and analyzes alert data for the Tzeva Adom system, providing insights into the frequency and distribution of alerts across various cities and areas.

## Installation
 1. Clone the repository -
```git clone https://github.com/Carmel-Amarilio/Tzeva-Adom-Statistics.git```


2. install dependencies -
```npm install```

3. Run the development server -
```npm run dev```

4. Open your browser and navigate to -
http://localhost:5174/Tzeva-Adom-Statistics

## Architecture

The Tzeva Adom Statistics Frontend project is organized to ensure a clean separation of concerns, making the codebase more scalable and maintainable. Below is an overview of the folder structure and how to navigate through the project.

### Key Folders and Files

- **`/public`**: Contains public assets available to the app at build time.
    - **`/translations`**: JSON files (en.json, he.json) for supporting multiple languages.

- **`/src`**: The main source directory for the project, which includes all application logic, components, assets, and services.
  
  - **`/assets`**: Contains static assets such as fonts and images.
    - **`/img`**: Contains image assets like logos or icons.
    - **`/styles`**: SCSS style files that are reused across the project.
  
  - **`/cmps`**: Short for "components," this folder holds reusable and independent UI components.
    - **`/Charts`**: Components related to the feed feature.
      - **`BrushBarChart.tsx`**: Displays a brushable bar chart for data visualization.
    - **`FilterBy.tsx`**:  Component for filtering the alert data
    - **`Loader.tsx`**: A loading spinner component displayed during data fetching.
    - **`TzevaAdomChart.tsx`**: The main chart component for displaying aggregated alert statistics.
    - **`TzevaAdomMap.tsx`**: Integrates Google Maps to visualize alert locations.
    - **`TzevaAdomTable.tsx`**: Displays alert data in a table format for easy browsing.
    - **`CityChart.tsx`**: Component for visualizing city-specific alert data.
  
  - **`/models`**: Contains TypeScript models and interfaces for defining data structures.
    - **`models.ts`**: Defines the types and interfaces used throughout the application for data consistency.
  
  - **`/services`**: Contains service files that handle business logic and API interactions.
    - **`i18n.service.ts`**: Manages internationalization and language settings.
    - **`TzevaAdom.service.ts`**: Main service for interacting with Tzeva Adom alert data.
    - **`util.service.ts`**: Utility service for helper functions used across various parts of the app.
  
  
  - **`/views`**: Contains the main page components that represent different views of the application.
    - **`TzevaAdomIndex.tsx`**: The main view for displaying Tzeva Adom data.
  
  - **`App.tsx`**: The root component that sets up the main structure of the application, including routes and global state providers.
  
  - **`main.tsx`**: The entry point for the application where the React app is initialized and rendered to the DOM.

## Assumptions / Limitations

Certain features and best practices typical in production-level applications were simplified for this project. Below are some assumptions and limitations:

1. **Accessibility Features**:
 - While the application uses a basic responsive design, accessibility features such as support for screen readers, alternative text for images, or high-contrast modes for users with visual impairments have not been fully implemented.
 - No advanced adjustments were made for text size scaling for users with disabilities (e.g., WCAG-compliant font scaling).

2. **Language Localization**:
 - The app supports English and Hebrew, but does not include additional internationalization features like locale-based formatting.


3. **Error Handling**:
 - Basic error handling is in place, but comprehensive error messages, user-friendly fallback UIs, or retry mechanisms for failed API calls were not deeply implemented.
 - Graceful degradation and progressive enhancement to ensure the app functions on older browsers were not prioritized.

4. **Testing**:
 - End-to-end (E2E) tests or unit tests with testing frameworks like Jest or Cypress have not been fully integrated.


These limitations reflect a deliberate focus on core functionality for the purposes of this project. In a production environment, addressing these aspects would be essential for creating a robust, secure, and accessible application.


## Links
- You can view the live demo at [GitHub Pages](https://carmel-amarilio.github.io/Tzeva-Adom-Statistics/).

