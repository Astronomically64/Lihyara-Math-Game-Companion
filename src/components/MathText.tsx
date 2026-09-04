import React from 'react';

interface MathTextProps {
  children: string;
  className?: string;
}

const mathToken = /([A-Za-z0-9.]+)\/([A-Za-z0-9.]+)|\^([A-Za-z0-9]+)/g;

function renderLine(line: string): React.ReactNode[] {
  const content: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = mathToken.exec(line)) !== null) {
    if (match.index > lastIndex) content.push(line.slice(lastIndex, match.index));

    if (match[1] && match[2]) {
      content.push(
        <span key={`${match.index}-fraction`} className="math-fraction" aria-label={`${match[1]} divided by ${match[2]}`}>
          <span>{match[1]}</span>
          <span>{match[2]}</span>
        </span>,
      );
    } else {
      content.push(
        <sup key={`${match.index}-exponent`} className="math-exponent">
          {match[3]}
        </sup>,
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) content.push(line.slice(lastIndex));
  return content;
}

export const MathText: React.FC<MathTextProps> = ({ children, className }) => (
  <span className={className}>
    {children.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {index > 0 && <br />}
        {renderLine(line)}
      </React.Fragment>
    ))}
  </span>
);
