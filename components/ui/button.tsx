import React from 'react';
import styles from '../../styles/customButton.module.css'; // Adjust this path to where you placed the CSS

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyle = styles.comicButton; // Use the CSS module class

  return (
    <button className={`${baseStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function Component() {
  return (
    <div className="flex space-x-4">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  );
}
