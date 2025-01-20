import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const SkillMatcher = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [candidateScores, setCandidateScores] = useState([]);
  const [topCandidates, setTopCandidates] = useState([]);
  const [error, setError] = useState('');

  const availableSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'React',
    'Node.js', 'SQL', 'MongoDB', 'AWS', 'Docker',
    'TypeScript', 'HTML', 'CSS', 'Git', 'Machine Learning',
    'Data Analysis', 'Power BI', 'Excel', 'Data Visualization',
    'Flask', 'Tableau', 'R', 'Problem Solving', 'Leadership',
    'Communication', 'Teamwork'
  ];

  const handleSkillChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedSkills(selected);
  };

  const calculateMatchScore = (candidateSkills) => {
    const normalizedCandidateSkills = candidateSkills.map(skill => skill.toLowerCase().trim());
    const normalizedSelectedSkills = selectedSkills.map(skill => skill.toLowerCase().trim());
  
    if (normalizedSelectedSkills.length === 0) {
      return { score: 0, matchingSkills: [] }; 
    }
  
    const matchingSkills = normalizedSelectedSkills.filter(skill =>
      normalizedCandidateSkills.includes(skill)
    );
  
    return {
      score: (matchingSkills.length / normalizedSelectedSkills.length) * 100,
      matchingSkills
    };
  };
  

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      setError('Please upload only .xlsx files');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const scores = data.map(candidate => {
        const skills = candidate.Skills ? candidate.Skills.split(',').map(skill => skill.trim()) : [];
        const { score, matchingSkills } = calculateMatchScore(skills);

        return {
          name: candidate.Name,
          email: candidate.Email,
          phone: candidate['Phone Number'],
          skills: skills,
          matchingSkills,
          score: score.toFixed(1)
        };
      });

      scores.sort((a, b) => b.score - a.score);

      setCandidateScores(scores);
      setTopCandidates(scores.slice(0, 2));
      setError('');

      exportToExcel(scores);
    } catch (err) {
      setError('Error processing file. Please ensure it follows the template format.');
      console.error(err);
    }
  };

  const exportToExcel = (scores) => {
    const processedData = scores.map(candidate => ({
      Name: candidate.name,
      Email: candidate.email,
      'Phone Number': candidate.phone,
      'Extracted Skills': candidate.skills.join(', '),
      'Matching Skills': candidate.matchingSkills.join(', '),
      'Match Score (%)': candidate.score
    }));

    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Processed Scores');

    XLSX.writeFile(workbook, 'Processed_Resume_Scores.xlsx');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Resume Skill Matcher</h1>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Required Skills (hold Ctrl/Cmd to select multiple)
        </label>
        <select
          multiple
          className="w-full p-2 border rounded-lg h-48"
          onChange={handleSkillChange}
          value={selectedSkills}
        >
          {availableSkills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Upload Resume Database (XLSX)
        </label>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {topCandidates.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Top 2 Candidates</h2>
          <div className="space-y-4">
            {topCandidates.map((candidate, index) => (
              <div key={index} className="p-4 bg-green-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-gray-800">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.email}</p>
                    <p className="text-sm text-gray-600">{candidate.phone}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {candidate.score}%
                    </div>
                    <div className="text-sm text-gray-600">Match Score</div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Skills:</span> {candidate.skills.join(', ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Matching Skills:</span> {candidate.matchingSkills.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {candidateScores.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">All Candidate Scores</h2>
          <div className="space-y-4">
            {candidateScores.map((candidate, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-gray-800">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.email}</p>
                    <p className="text-sm text-gray-600">{candidate.phone}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {candidate.score}%
                    </div>
                    <div className="text-sm text-gray-600">Match Score</div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Skills:</span> {candidate.skills.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillMatcher;
