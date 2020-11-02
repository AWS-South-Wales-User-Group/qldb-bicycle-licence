import React, { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

export default function Code({ code, language }) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);
  return (
    <div className='Code'>
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
