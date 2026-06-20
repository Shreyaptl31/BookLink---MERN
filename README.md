# BookLink

BookLink is a personal bookmark management application that allows users to securely save and organize their favorite links. Users can create accounts, manage private and public bookmarks, and share public bookmarks through a unique profile handle.

## Features

* User authentication with email and password using Supabase Auth.
* Create, update, and delete bookmarks.
* Public and private bookmark visibility.
* Secure user-specific data access with Supabase Row Level Security (RLS).
* Unique public profile handles for sharing bookmarks.
* Public profile pages displaying only public bookmarks.
* Protected dashboard accessible only to authenticated users.

## Tech Stack

### Frontend

* React
* TypeScript
* Vite

### Backend

* Node.js
* Express
* TypeScript

### Database & Authentication

* Supabase

### Email Service

* Resend

## Project Structure

```text
booklink/
├── web/          # React frontend
├── api/          # Express backend
```

## Key Features

### Authentication

Users can sign up and log in with email and password. New users receive a welcome or confirmation email.

### Bookmark Management

Authenticated users can:

* Add bookmarks
* Edit bookmarks
* Delete bookmarks

Each bookmark contains:

* Title
* URL
* Public/Private visibility

### Privacy and Security

Users can only access their own bookmarks. APIs are protected with JWT authentication and database-level security policies using Supabase RLS.

### Public Profiles

Users can claim a unique handle. Anyone can visit:

```text
/<handle>
```

to view that user's public bookmarks.

## Future Improvements

With more time, I would add:

* Bookmark categories and tags
* Search and filtering
* Responsive UI improvements
* Analytics for public profiles