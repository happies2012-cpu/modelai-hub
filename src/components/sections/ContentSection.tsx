import { ReactNode } from 'react';

interface ContentSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const ContentSection = ({ title, description, children, className = '' }: ContentSectionProps) => {
  return (
    <section className={`py-20 ${className}`}>
      <div className="container px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
};