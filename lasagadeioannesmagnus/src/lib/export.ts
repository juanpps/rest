import html2pdf from 'html2pdf.js';
import type { Cronica } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const exportCronicaToPDF = async (cronica: Cronica) => {
    const element = document.createElement('div');
    element.className = 'editorial-pdf-layout';

    // Premium Parchment Styles
    const style = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500&display=swap');
    
    .editorial-pdf-layout {
      font-family: 'Inter', sans-serif;
      line-height: 1.8;
      background: #fdfaf3; /* Lighter parchment */
      color: #121212;
      padding: 60px 80px;
      min-height: 29.7cm; /* A4 height */
    }
    .pdf-header {
      text-align: center;
      margin-bottom: 60px;
      border-bottom: 1px double #b08d57;
      padding-bottom: 20px;
    }
    .pdf-branding {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      letter-spacing: 0.2em;
      color: #b08d57;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .pdf-title {
      font-family: 'Cinzel', serif;
      font-size: 36px;
      font-weight: 700;
      color: #7a1c1c;
      margin-bottom: 12px;
      line-height: 1.2;
    }
    .pdf-subtitle {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-style: italic;
      color: #706555;
      margin-bottom: 20px;
    }
    .pdf-meta {
      font-family: 'Cinzel', serif;
      font-size: 11px;
      color: #b08d57;
      letter-spacing: 0.05em;
    }
    .pdf-ornament {
      text-align: center;
      color: #b08d57;
      font-size: 24px;
      margin: 40px 0;
    }
    .pdf-content {
      font-size: 13px;
      text-align: justify;
    }
    .pdf-content h2 {
      font-family: 'Cinzel', serif;
      font-size: 20px;
      color: #121212;
      margin-top: 32px;
      border-bottom: 1px solid #eee;
      padding-bottom: 4px;
    }
    .pdf-content blockquote {
      border-left: 3px solid #b08d57;
      padding-left: 24px;
      margin: 24px 0;
      font-family: 'Playfair Display', serif;
      font-style: italic;
      color: #444;
      font-size: 14px;
    }
    .pdf-footer {
      margin-top: 80px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Cinzel', serif;
      font-size: 10px;
      color: #b08d57;
      letter-spacing: 0.1em;
    }
    p { margin-bottom: 16px; }
  `;

    element.innerHTML = `
    <style>${style}</style>
    <div class="pdf-header">
      <div class="pdf-branding">La Saga de Ioannes Magnus</div>
      <div class="pdf-title">${cronica.title}</div>
      ${cronica.subtitle ? `<div class="pdf-subtitle">${cronica.subtitle}</div>` : ''}
      <div class="pdf-meta">
        Escrito datado el ${format(cronica.createdAt, "dd 'de' MMMM 'del año' yyyy", { locale: es })}
      </div>
    </div>
    
    <div class="pdf-ornament">✦ ✦ ✦</div>
    
    <div class="pdf-content">
      ${cronica.content}
    </div>

    <div class="pdf-ornament">✦ ✦ ✦</div>
    
    <div class="pdf-footer">
      <span>TOMO: ${cronica.createdAt.getFullYear()}</span>
      <span>— IOANNES MAGNUS —</span>
      <span>PAG: 01</span>
    </div>
  `;

    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `IoannesMagnus_${format(cronica.createdAt, 'yyyy-MM-dd')}_${cronica.title.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const }
    };

    await html2pdf().set(opt).from(element).save();
};
