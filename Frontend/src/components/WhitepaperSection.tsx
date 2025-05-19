
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface WhitepaperSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const WhitepaperSection: React.FC<WhitepaperSectionProps> = ({ 
  title, 
  description, 
  children, 
  className = ""
}) => {
  return (
    <Card className={`mb-8 border-waste-100 ${className}`}>
      <CardHeader className="bg-waste-50/50 dark:bg-waste-900/20">
        <CardTitle className="text-waste-800 dark:text-waste-200">{title}</CardTitle>
        {description && <CardDescription className="dark:text-waste-300">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-6 text-gray-700 dark:text-gray-300">
        {children}
      </CardContent>
    </Card>
  );
};

export default WhitepaperSection;
