import axios from 'axios';

export const getGenerateTemplate = async (templateName: string, replacements: Record<string, string>) => {
    const templateUrl = `http://${process.env.DB_IP}:${process.env.PORT}/static/${templateName}.html`;
    
    // Fetch template from static web server
    const response = await axios.get(templateUrl);
    let template = response.data;

    // Replace all placeholders with actual values
    Object.entries(replacements).forEach(([key, value]) => {
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return template;
};