import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default async function renderTemplate(
    templateName: string,
    params: Record<string, any>,
): Promise<string> {
    try {
        const templatePath = path.join(
            __dirname,
            'mailer',
            `${templateName}.hbs`,
        );
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        const template = Handlebars.compile(templateContent);
        return template(params);
    } catch (error) {
        console.error(`Error rendering template ${templateName}:`, error);
        throw error;
    }
}
