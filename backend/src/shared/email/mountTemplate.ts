import { readFile } from 'fs/promises';
import path from 'path';

type Props = {
  title: string;
  description: string;
  expiration: string;
  ignore: string;
  button: string;
  link: string;
};

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


async function mountTemplate(p: Props) {
  const templatePath = path.join(__dirname, 'template.html');
  const baseHTML = await readFile(templatePath, 'utf8');

  return baseHTML
    .replaceAll('{TITLE}', escapeHtml(p.title))
    .replaceAll('{DESCRIPTION}', escapeHtml(p.description))
    .replaceAll('{EXPIRATION}', escapeHtml(p.expiration))
    .replaceAll('{IGNORE}', escapeHtml(p.ignore))
    .replaceAll('{BUTTON}', escapeHtml(p.button))
    .replaceAll('{LINK}', escapeHtml(p.link));
}

export { mountTemplate };