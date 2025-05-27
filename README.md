# QTube — Curate Custom YouTube Playlists with Timestamps

QTube is a project built that allows users to create custom YouTube playlists with precise start and end timestamps for each video segment. It integrates with Google and YouTube APIs using OAuth2 authorization, making it easy to search, authenticate, and manage video content securely.

## Features

- **Google Sign-In with OAuth2**  
  Secure user authentication using Google accounts to access YouTube content via access tokens.

- **Search and Import YouTube Videos**  
  Use YouTube Data API to search and select videos to add to your custom playlists.

- **Create Timestamped Playlists**  
  Curate video playlists by selecting specific time ranges from each video, ideal for highlights, tutorials, or focused content viewing.

- **Persistent Playlist Management**  
  Save, update, and organize your playlists using a clean, database-backed UI.

- **Drag and Drop Reordering**  
  Reorder videos in your playlist seamlessly using [Dnd Kit](https://dndkit.com/).

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with the App Router for server components and dynamic routing.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
- **UI Components**: [shadcn/ui](https://ui.shadcn.dev/) for clean, accessible components.
- **State & DB**: [Drizzle ORM](https://orm.drizzle.team/) for type-safe and modern database interactions.
- **Drag & Drop**: [Dnd Kit](https://dndkit.com/) for interactive drag-and-drop capabilities.
- **Google APIs**:  
  - YouTube Data API v3 for video details and search.  
  - OAuth2 for authentication and access token management.
