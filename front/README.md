# Resume Builder & Parser

A full-stack resume parsing and editing application. Users can upload a PDF resume, have it parsed on the backend, and interactively edit and reclassify resume blocks in a modern React UI.

This project is evolving toward a resume-tailoring tool, enabling structured editing and future AI-based optimization for specific job roles.

## Architecture Overview

```
resume-project/
├── front/   # React frontend (UI)
└── back/    # Python FastAPI backend (PDF parsing)
```

## Built With

### Frontend
- **React** - Create React App
- **Material UI (MUI)** - Component library
- **JavaScript** - No TypeScript required

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **pdfplumber** - Reliable PDF text extraction
- **Python 3.12+**

## Current Features

- Upload PDF resumes
- Backend-based PDF parsing (no browser workers)
- Resume content split into structured blocks:
  - Section titles
  - Experience headers
  - Experience bullets
  - Unknown blocks
- Editable resume blocks in the UI
- Manual block type correction via dropdowns
- Clean separation of frontend and backend responsibilities

## Planned Features

- Resume tailoring for specific job descriptions
- AI-assisted block classification
- Resume export (PDF / DOCX)
- Block reordering via drag-and-drop
- Resume versioning

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python 3.12+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd resume-project
```

2. Install frontend dependencies
```bash
cd front
npm install
```

3. Install backend dependencies
```bash
cd ../back
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server
```bash
cd back
uvicorn main:app --reload
```

2. Start the frontend development server
```bash
cd front
npm start
```

The application will be available at `http://localhost:3000`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.