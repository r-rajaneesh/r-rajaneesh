import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ResumeViewer: React.FC = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Use clientWidth to account for scrollbars and padding correctly
        setContainerWidth(containerRef.current.clientWidth - 64); // 2rem padding on each side
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="resume-viewer-container glass-card" ref={containerRef}>
      <div className="resume-header">
        <h3>Resume Preview</h3>
        <a href="/resume.pdf" download className="download-btn">
          Download PDF
        </a>
      </div>
      <div className="pdf-container">
        <Document
          file="/resume.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="loading">Loading Resume...</div>}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page 
              key={`page_${index + 1}`} 
              pageNumber={index + 1} 
              scale={1}renderTextLayer={false}
              // renderAnnotationLayer={false}
              width={containerWidth || 300}
            />
          ))}
        </Document>
      </div>
      <style>{`
        .resume-viewer-container {
          padding: 2rem;
          margin-top: 2rem;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .resume-viewer-container {
            padding: 1rem;
          }
          .resume-header h3 {
            font-size: 1.1rem;
          }
          .download-btn {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
          }
        }
        .resume-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .download-btn {
          background-color: var(--accent);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0;
          font-weight: 600;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 2px solid var(--accent);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          cursor: pointer;
        }
        .download-btn:hover {
          background-color: transparent;
          color: var(--accent);
          transform: translate(-4px, -4px);
          box-shadow: 4px 4px 0px var(--accent);
        }
        .pdf-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow-x: hidden;
          overflow-y: auto;
          max-height: 800px;
          border-radius: 0;
          background: #fdfcfb;
          padding: 1rem;
          border: 2px solid var(--border);
        }
        .react-pdf__Document {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .react-pdf__Page {
          margin-bottom: 1rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          max-width: 100%;
        }
        canvas {
          max-width: 100% !important;
          height: auto !important;
        }
        .loading {
          padding: 3rem;
          text-align: center;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default ResumeViewer;
