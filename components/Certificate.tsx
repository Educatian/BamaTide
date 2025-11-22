import React from 'react';
import { Download, Share2, ArrowLeft } from 'lucide-react';

interface CertificateProps {
  studentName: string;
  courseName: string;
  instructorName: string;
  instructorTitle?: string;
  onBack: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ 
  studentName, 
  courseName, 
  instructorName,
  instructorTitle = "Program Director",
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center space-x-2 text-gray-600 hover:text-ua-crimson transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white w-full max-w-4xl aspect-[1.414/1] shadow-2xl relative p-12 border-8 border-double border-ua-crimson text-center flex flex-col items-center justify-between bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        
        {/* Header */}
        <div className="space-y-4 w-full">
            <div className="flex justify-center mb-8">
                 {/* UA Crest Placeholder */}
                 <div className="w-24 h-24 border-4 border-ua-crimson rounded-full flex items-center justify-center text-ua-crimson font-serif text-4xl font-bold bg-white shadow-sm">
                    UA
                 </div>
            </div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 uppercase tracking-widest">University of Alabama</h1>
            <h2 className="text-xl text-gray-600 font-light tracking-wide uppercase">College of Continuing Studies</h2>
        </div>

        {/* Content */}
        <div className="space-y-6 my-8">
            <p className="text-lg text-gray-500 italic">This is to certify that</p>
            <h3 className="text-5xl font-serif text-ua-crimson border-b-2 border-gray-200 pb-4 inline-block px-12 font-semibold">
                {studentName}
            </h3>
            <p className="text-lg text-gray-500 italic mt-4">has successfully completed the microcredential requirements for</p>
            <h4 className="text-3xl font-bold text-gray-800">{courseName}</h4>
            <p className="text-md text-gray-500 mt-2">with distinction in Educational Game Design mechanics and theory.</p>
        </div>

        {/* Footer / Signatures */}
        <div className="w-full flex justify-between items-end px-12 mt-12">
            <div className="text-center space-y-2">
                <div className="w-48 h-px bg-gray-800"></div>
                <p className="font-serif text-gray-600 font-bold">{instructorName}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{instructorTitle}</p>
            </div>
            
            {/* Seal */}
            <div className="w-24 h-24 rounded-full bg-ua-crimson/10 border border-ua-crimson flex items-center justify-center">
                 <span className="text-ua-crimson text-xs font-bold uppercase text-center">Official<br/>Seal</span>
            </div>

             <div className="text-center space-y-2">
                <div className="w-48 h-px bg-gray-800"></div>
                <p className="font-serif text-gray-600">Date Issued</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{new Date().toLocaleDateString()}</p>
            </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex space-x-4">
        <button className="flex items-center space-x-2 bg-ua-crimson text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors shadow-lg">
            <Download size={20} />
            <span>Download PDF</span>
        </button>
        <button className="flex items-center space-x-2 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm">
            <Share2 size={20} />
            <span>Share on LinkedIn</span>
        </button>
      </div>
    </div>
  );
};