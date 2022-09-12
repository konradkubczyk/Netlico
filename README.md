# Netlico

> This project is in an **early stage of development**. Features, design, licensing, terms and other details are subject to change. Our public instance, including user-generated content, can be deleted at any time without further notice.

## Description

Netlico is a web app created with Express.js which offers simple microsite creation features. These microsites are small websites that include mainly plain text content divided into pages. They can be customized with various themes available withing the app and thanks to their lightweight architecture they are highly performant.

## Features

Currently, Netlico's core functionality includes:

 - live preview
 - custom subdomains
 - themes
 - page creation/deletion and reordering
 - multiple sites per account
 - custom site title and SEO description
 - public access toggle
 - custom page paths
 - instant account data deletion

 The project is still developing and new features (including breaking changes) may arrive soon.

## Installation

### Prerequisites

Before you begin installation of the project, please make sure that you have access to the following resources:

 - Git version control system
 - Recent version of Node.js
 - MongoDB database

### Downloading

Open the folder in which you would like to store the application and clone this repository.

```bash
git clone https://gitlab.com/konradkubczyk/netlico.git
```

### Installation

Use npm to install dependencies.

```bash
npm install
```

### Configuration

When in development, supply the required variables using .env file at the root directory of the project. Create a new file according to the scheme below.

```yml
MONGODB_URI='[Your MongoDB connection URI]'
JWT_SECRET='[Random secret used for JSON Web Token signing]'
SESSION_SECRET='[Random secret used for session management]'
COOKIE_SECRET='[Random secret used for cookies]'
```

Replace placeholders, including square brackets, with appropriate data. Remember, the required information are confidential. **Do not share your .env file.**

### Running

Use `npm start` for production environment, `npm dev` for development (with app restarts on file changes) or `npm test` to run the included test suite.