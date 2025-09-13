import React from 'react';
import './InspirationalQuote.css';

const InspirationalQuote: React.FC = () => {
  return (
    <div className="quote-container">
      <p className="quote-text">
        "We educate our minds so that one day we can render service of worth to somebody else."
      </p>
      <p className="quote-author">— President Russell M. Nelson</p>
    </div>
  );
};

export default InspirationalQuote;