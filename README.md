# Resume Skill Matcher

## Description
Resume Skill Matcher is a web application that helps recruiters and hiring managers quickly evaluate candidate resumes based on required skills. The application allows users to select multiple required skills and upload a resume database in Excel format. It then processes each resume, calculates a match score, and displays detailed results for each candidate.

## Tech Stack
- **React**: Frontend framework
- **SheetJS (XLSX)**: Excel file processing
- **Tailwind CSS**: Styling and UI components

## Features
- Multi-select skill requirement input
- Excel (.xlsx) file upload and processing
- Individual candidate match score calculation
- Sorted results display (highest match first)
- Responsive design

## Installation
```bash
# Clone the repository
git clone [your-repo-url]

# Install dependencies
npm install

# Install required packages
npm install xlsx
npm install -D tailwindcss@latest
```

## Usage
1. **Select Required Skills**:
   - Choose multiple skills from the dropdown
   - Use Ctrl/Cmd to select multiple skills

2. **Upload Resume Database**:
   - Prepare Excel file in the required format:
     ```
     | Name | Email | Phone Number | Skills |
     ```
   - Skills should be comma-separated
   - File must be in .xlsx format

3. **View Results**:
   - Each candidate's details will be displayed
   - Results are sorted by match percentage
   - Shows complete profile including contact information and all skills

## Excel Template Format
```
Name            Email                   Phone Number    Skills
John Doe        john.doe@example.com    123-456-7890   Python, Machine Learning, Data Analysis
Jane Smith      jane.smith@example.com  987-654-3210   Power BI, Excel, Data Visualization
```

## Score Calculation
Match score is calculated as:
```
(Number of matching skills / Number of required skills) × 100
```

## Error Handling
- Validates file format (.xlsx only)
- Handles missing or malformed data
- Provides clear error messages

## Documentation Referenced
- [SheetJS React Demo](https://docs.sheetjs.com/docs/demos/frontend/react/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

