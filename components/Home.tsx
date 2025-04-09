// pages/index.tsx
'use client'
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';


import Head from 'next/head';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    matchPercentage: number;
    sarcasticFeedback: string[];
  } | null>(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      if (selectedFile.type !== 'application/pdf' && 
          selectedFile.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        alert("Please upload a PDF or DOCX file only.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      if (droppedFile.type !== 'application/pdf' && 
          droppedFile.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        alert("Please upload a PDF or DOCX file only.");
        return;
      }
      setFile(droppedFile);
    }
  };
  
  const handleSubmit = async () => {
    if (!file || !jobDescription.trim()) {
      alert("Please upload a resume and paste a job description.");
      return;
    }
  
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);
  
    setLoading(true);
    setError('');
    setAnalysisResult(null);
  
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }
  
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error: any) {
      console.error("Submission error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  



  function RandomBackground() {
    const [randomStyles, setRandomStyles] = useState(null);
  
    useEffect(() => {
      // Generate random styles after component mounts
      setRandomStyles({
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        width: (Math.random() * 300 + 50) + 'px',
        height: (Math.random() * 300 + 50) + 'px',
        filter: 'blur(70px)',
        opacity: 0.1,
      });
    }, []);
  
    if (!randomStyles) return null; // Render nothing until mounted
  
    return (
      <div
        className="absolute rounded-full bg-gradient-to-r from-purple-600 to-blue-500"
        style={randomStyles}
      />
    );
  }
  


  return (
    
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Head>
        <title>Sarcastic Resume Analyzer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
        {[...Array(15)].map((_, i) => (
      <RandomBackground key={i} />
    ))}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <motion.h1 
          className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-center mb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Sarcastic Resume Analyzer
        </motion.h1>
        
        <motion.p 
          className="text-xl text-center mb-12 text-gray-300"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          We analyze your resume with a touch of sarcasm and brutal honesty
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left panel - Resume upload */}
          <motion.div
            className="rounded-2xl backdrop-blur-lg bg-black bg-opacity-40 border border-gray-800 p-8 relative overflow-hidden"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" }}
          >
            <div 
              className={`h-80 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                dragActive 
                  ? 'border-purple-500 bg-purple-900 bg-opacity-20' 
                  : file 
                    ? 'border-green-500 bg-green-900 bg-opacity-10' 
                    : 'border-gray-700 hover:border-purple-400 hover:bg-gray-900'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
              />
              
              {file ? (
                <div className="text-center px-4">
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                  <p className="text-xl font-semibold text-green-400">Resume Uploaded</p>
                  <p className="text-sm text-gray-300 mt-2">{file.name}</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setFile(null)}
                  >
                    Change File
                  </button>
                </div>
              ) : (
                <div className="text-center px-4">
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center"
                    animate={{ 
                      y: [0, -10, 0],
                      boxShadow: [
                        "0 0 0 rgba(139, 92, 246, 0)",
                        "0 0 20px rgba(139, 92, 246, 0.5)",
                        "0 0 0 rgba(139, 92, 246, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                  <p className="text-xl font-semibold text-purple-300">Upload Your Resume</p>
                  <p className="text-sm text-gray-400 mt-2">Drag & drop your file here or click to browse</p>
                  <p className="text-xs text-gray-500 mt-1">PDF or DOCX, max 5MB</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-purple-800 rounded-lg text-white hover:bg-purple-700 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select File
                  </button>
                </div>
              )}
            </div>

            <div className="absolute bottom-2 right-2">
              <motion.div 
                className="text-xs text-gray-500 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                *Our algorithm judges your file size too
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right panel - Job description */}
          <motion.div
            className="rounded-2xl backdrop-blur-lg bg-black bg-opacity-40 border border-gray-800 p-8 relative"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ boxShadow: "0 0 20px rgba(14, 165, 233, 0.3)" }}
          >
            <label className="block text-lg font-semibold text-cyan-300 mb-2">
              Job Description
            </label>
            <div className="relative">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here... We promise to read between the lines."
                className="h-72 w-full bg-gray-900 bg-opacity-70 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all outline-none resize-none"
              />
              <motion.div 
                className="absolute bottom-3 right-3 text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                {jobDescription.length} characters
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Submit button */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.button
  className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xl relative overflow-hidden disabled:opacity-50"
  whileHover={{ scale: loading ? 1 : 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleSubmit}
  disabled={loading}
>
  <span className="relative z-10">
    {loading ? "Analyzing..." : "Analyze Compatibility"}
  </span>

            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
          </motion.button>
        </motion.div>
        {loading && (
  <motion.div 
    className="mt-8 text-center text-purple-400 font-semibold"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    Analyzing your resume... sharpening sarcasm 🧐
  </motion.div>
)}
{error && (
  <motion.div 
    className="mt-4 text-center text-red-400 font-medium"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    Oops! {error}
  </motion.div>
)}

        {analysisResult && (
  <motion.div
    className="mt-12 max-w-3xl mx-auto bg-gray-900 bg-opacity-70 rounded-xl p-6 border border-purple-700"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <h2 className="text-2xl font-bold text-purple-400 mb-4">
      Analysis Result: {analysisResult.matchPercentage}% Match
    </h2>
    <ul className="list-disc list-inside space-y-2 text-gray-300">
      {analysisResult.sarcasticFeedback.map((line, idx) => (
        <li key={idx}>{line}</li>
      ))}
    </ul>
  </motion.div>
)}

        <motion.div 
          className="mt-8 text-center text-gray-500 text-sm italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Disclaimer: Our AI has been trained on rejection letters and snarky comments.
        </motion.div>
      </div>
    </div>
  );
}

