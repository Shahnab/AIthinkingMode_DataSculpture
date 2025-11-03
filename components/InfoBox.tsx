import React from 'react';

interface InfoBoxProps {
  label: string;
  value: string;
  className?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ label, value, className = '' }) => {
  const isTextRight = className.includes('text-right');
  const labelAlignment = isTextRight ? 'self-end' : 'self-start';

  return (
    <div className={`flex flex-col ${className}`}>
      <div className={`bg-neutral-500 text-white px-3 py-0.5 text-[10px] tracking-widest ${labelAlignment}`}>
        <p>{label}</p>
      </div>
      <div className="border border-white/80 px-4 py-2">
        <p className="text-base font-bold tracking-wider">{value}</p>
      </div>
    </div>
  );
};

export default InfoBox;