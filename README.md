# Performance Management System

A modern web application for managing employee performance, goals, and reviews.

## Features

- User authentication with Supabase
- Role-based access control (Admin, Manager, Employee)
- Goal setting and tracking
- Performance reviews
- Feedback system
- Reports and analytics

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase
- React Icons

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/performance-management.git
cd performance-management
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
performance-management/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                 # Utility functions and configurations
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── package.json           # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
