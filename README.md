# 🤖 AI-Driven Synthetic Chat

A Next.js application that generates synthetic legal chat conversations using AI and provides comprehensive analytics through an interactive dashboard. The app creates realistic interactions between in-house lawyers and legal AI, focusing on privacy law and commercial contracts. ⚖️✨

## ✨ Features

- Create realistic legal chat conversations using Anthropic's Claude API
- View comprehensive analytics and insights from generated chats
- Generate and send detailed HTML reports via email
- Analyze question patterns, legal topics, and conversation statistics
- Support for both privacy law and commercial contracts scenarios

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Material-UI, Recharts, TailwindCSS
- **Backend**: Next.js API routes, Node.js
- **AI Integration**: Anthropic Claude API
- **Data Management**: TanStack Query, Zod validation
- **Styling**: Material-UI with custom theming, TailwindCSS
- **Language**: TypeScript, ESLint, Prettier

## 📋 Prerequisites

- Node.js 20+
- pnpm package manager (v10.11.0)
- Anthropic API key

## 🚀 Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd ai-driven-synthetic-chat
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Environment Setup - Create a `.env.local` file in the root directory:

   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

4. Start the development server

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## 💻 Usage

### 🤖 Generating Synthetic Chats

1. Click "Generate Chats" button in the main dashboard
2. Run the chat generation script directly via command line:
   ```bash
   pnpm generate-chat
   ```

### 📈 Generating Reports

1. Click "Generate Email" in the dashboard to create comprehensive analytics
2. Run the report generation script directly via command line:
   ```bash
   pnpm generate-report
   ```
3. View real-time statistics including:
   - Total conversations and legal questions
   - Time and cost savings metrics
   - Question pattern analysis
   - Legal topic categorization

### 📮 Email Reports

1. Generate an email report from the dashboard
2. Add recipient email addresses
3. Send formatted HTML reports with complete analytics

## 📁 Project Structure

```
src/
├── api/
│   ├── analysis/          # Report generation and data analysis
│   ├── chatGenerator/     # Synthetic chat creation logic
│   └── types/            # TypeScript type definitions
├── components/           # React components
├── data/
│   └── hooks/           # TanStack Query hooks
├── pages/               # Next.js pages directory
│   ├── api/             # API route handlers
│   ├── _app.tsx         # App configuration
│   ├── _document.tsx    # Document structure
│   └── index.tsx        # Home page
├── resources/           # Static resources and example data
└── styles/             # Theme and styling configuration
```

## 🔧 Key Components

### 🤖 Chat Generation

- Manages the entire chat generation pipeline
- Retrieves source data from example URLs
- Creates synthetic conversations using AI prompts
- Processes and validates generated content

### 📊 Analytics & Reporting

- Analyzes chat data and creates comprehensive reports
- Identifies common question patterns and legal topics
- Computes conversation metrics and insights

### 🖥️ Dashboard Features

- Key metrics display (conversations, questions, savings)
- Live preview of generated reports
- Visual representation of question patterns and legal terms
- Recipient management and sending functionality

## 🔌 API Endpoints

### 📡 `/api/generate-chats` (POST)

Generates synthetic chat conversations

- Uses example chat URLs as training data
- Creates both privacy and commercial law scenarios
- Returns generated chat data

### 📋 `/api/generate-report` (POST)

Generates comprehensive analytics report

- Analyzes existing chat data
- Calculates statistics and patterns
- Returns structured report data

## 🛠️ Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production application
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier
- `pnpm format:fix` - Format code with Prettier (write mode)
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm generate-chat` - Generate synthetic chats via CLI
- `pnpm generate-report` - Generate analytics report via CLI

## ⚙️ Configuration

### 🌍 Environment Variables

- `ANTHROPIC_API_KEY` - Required for AI chat generation

### 📦 Package Manager

This project uses pnpm v10.11.0. Ensure you have pnpm installed:

```bash
npm install -g pnpm@10.11.0
```

## ⚖️ Legal Domains Supported

### 🔒 Privacy Law

- GDPR & International Compliance
- AI & Privacy regulations
- Data Breaches & Incident Response
- Employee Monitoring policies
- Data Sharing & Transfers
- Consent & Cookies management

### 📝 Commercial Contracts

- Contract Risk & Liability assessment
- Vendor Relationship Management
- Intellectual Property & Licensing
- Service Performance & SLAs
- Payment & Financial Terms

## 👨‍💻 Development

### 🏆 Code Quality

- ESLint configuration with Prettier integration
- TypeScript strict mode enabled
- Automated formatting on save
- TailwindCSS for utility-first styling

### 🏗️ Architecture

- Modular component structure
- Custom hooks for data management
- Type-safe API communications
- Responsive Material-UI design system with TailwindCSS integration

### 🔧 Key Dependencies

- **@anthropic-ai/sdk** - Claude API integration
- **@tanstack/react-query** - Server state management
- **@mui/material** - UI component library
- **recharts** - Data visualization
- **react-hook-form** - Form management
- **zod** - Schema validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting:
   ```bash
   pnpm typecheck
   pnpm lint
   pnpm format
   ```
5. Submit a pull request

## 🆘 Support

For questions and support, please refer to the project documentation or contact the project owner.
