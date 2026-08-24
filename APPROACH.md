# Technical Approach

**Problem**: Build a responsive, multilingual, voice-first shopping assistant prioritizing performance, reliability, and local processing without external APIs.

**Architecture**: The app uses a React + TypeScript SPA architecture bundled with Vite. State is managed via custom hooks (`useShoppingList`, `useSpeechEngine`, `usePreferences`) and persisted directly to `localStorage`.

**Voice & Text NLP Parity**: To ensure voice and text are equally capable first-class interactions, both inputs route through a shared deterministic `IntentParser`. The parser uses centralized dictionaries extracting commands (Add, Remove, Modify, Search), quantities, units, and price bounds using regex and localized keyword matching.

**UI Localization & Styling**: A robust `i18n` engine separates the presentation layer from business logic. The application dynamically synchronizes `document.documentElement.dir` and `lang` for full multi-language support and seamlessly translates intents via dictionary lookups. A robust custom design system built with Tailwind CSS integrates a polished native Dark Mode, responsive layouts, and interactive micro-animations to enhance user experience.

**Recommendations & Search**: Recommendations run locally based on frequency-maps stored in `localStorage` and catalog metadata. The `Discover` component merges text search, manual filters, and parsed voice intents into a single responsive product grid.
