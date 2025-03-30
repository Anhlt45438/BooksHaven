import fs from 'fs';
import path from 'path';

export const getEmailTemplate = (templateName: string, replacements: Record<string, string>) => {
  const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.html`);
  let template = fs.readFileSync(templatePath, 'utf8');
  
  // Replace all placeholders with actual values
  Object.entries(replacements).forEach(([key, value]) => {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  return template;
};