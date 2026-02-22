import html2pdf from 'html2pdf.js';
import type { Cronica } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const exportMonthlyNewspaper = async (month: number, year: number, cronicas: Cronica[]) => {
  if (cronicas.length === 0) return;

  // Sort cronicas by date ascending for the newspaper
  const sorted = [...cronicas].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const element = document.createElement('div');
  element.className = 'newspaper-layout';

  const monthName = format(new Date(year, month), 'MMMM', { locale: es });

  const style = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500&display=swap');
    
    .newspaper-layout {
      font-family: 'Inter', sans-serif;
      line-height: 1.7;
      background: #fdfaf3;
      color: #121212;
      padding: 40px 60px;
    }
    .newspaper-cover {
      text-align: center;
      border: 4px double #b08d57;
      padding: 40px;
      margin-bottom: 60px;
    }
    .newspaper-masthead {
      font-family: 'Cinzel', serif;
      font-size: 42px;
      font-weight: 700;
      color: #7a1c1c;
      margin-bottom: 10px;
      letter-spacing: 0.1em;
    }
    .newspaper-edition {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      color: #b08d57;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      border-top: 1px solid #b08d57;
      border-bottom: 1px solid #b08d57;
      padding: 8px 0;
      margin-bottom: 20px;
    }
    .newspaper-toc {
      text-align: left;
      margin: 40px 0;
      padding: 20px;
      background: rgba(176, 141, 87, 0.05);
      border-radius: 4px;
    }
    .toc-title {
      font-family: 'Cinzel', serif;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 12px;
      border-bottom: 1px solid #b08d57;
    }
    .toc-item {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .entry-separator {
      page-break-before: always;
      border-top: 1px solid #eee;
      padding-top: 40px;
      margin-top: 40px;
    }
    .entry-header {
      margin-bottom: 30px;
    }
    .entry-title {
      font-family: 'Cinzel', serif;
      font-size: 28px;
      color: #7a1c1c;
      margin-bottom: 6px;
    }
    .entry-subtitle {
     font-family: 'Playfair Display', serif;
     font-style: italic;
     font-size: 16px;
     color: #706555;
    }
    .entry-date {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      color: #b08d57;
      margin-bottom: 20px;
    }
    .entry-content {
      font-size: 12px;
      text-align: justify;
    }
    .entry-content blockquote {
      border-left: 2px solid #b08d57;
      padding-left: 20px;
      margin: 20px 0;
      font-style: italic;
    }
    .entry-content h2 {
      font-family: 'Cinzel', serif;
      font-size: 18px;
      margin-top: 24px;
    }
    .newspaper-footer {
      margin-top: 100px;
      text-align: center;
      font-family: 'Cinzel', serif;
      font-size: 10px;
      color: #b08d57;
    }
    p { margin-bottom: 12px; }
  `;

  let contentHtml = `
    <style>${style}</style>
    <div class="newspaper-cover">
      <div class="newspaper-masthead">LA SAGA</div>
      <div class="newspaper-edition">Edición Mensual • ${monthName} ${year}</div>
      <p style="font-family: 'Playfair Display', serif; font-style: italic; font-size: 14px; margin-top: 20px;">
        Compendio de pensamientos, crónicas y tratados de Ioannes Magnus.
      </p>
      
      <div class="newspaper-toc">
        <div class="toc-title">Índice Histórico</div>
        ${sorted.map((c, i) => `
          <div class="toc-item">
            <span>${i + 1}. ${c.title}</span>
            <span>${format(c.createdAt, 'dd/MM')}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  sorted.forEach((c, i) => {
    contentHtml += `
      <div class="${i === 0 ? '' : 'entry-separator'}">
        <div class="entry-header">
          <div class="entry-date">${format(c.createdAt, "dd 'de' MMMM", { locale: es })}</div>
          <div class="entry-title">${c.title}</div>
          ${c.subtitle ? `<div class="entry-subtitle">${c.subtitle}</div>` : ''}
        </div>
        <div class="entry-content">
          ${c.content}
        </div>
      </div>
    `;
  });

  contentHtml += `
    <div class="newspaper-footer" style="padding: 60px 0;">
      ✦ LA SAGA DE IOANNES MAGNUS ✦<br/>
      IMPERIO INTERIOR
    </div>
  `;

  element.innerHTML = contentHtml;

  const opt = {
    margin: [0.3, 0.3, 0.3, 0.3] as [number, number, number, number],
    filename: `Saga_Periodico_${year}_${month + 1}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 1.5, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
  };

  await html2pdf().set(opt).from(element).save();
};
