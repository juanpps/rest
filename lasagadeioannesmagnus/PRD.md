# PDR TÉCNICO DETALLADO — La Saga de Ioannes Magnus

**Proyecto:** La Saga de Ioannes Magnus — app privada de crónicas personales

## 1. Resumen ejecutivo
"La Saga de Ioannes Magnus" es una aplicación privada para crear, organizar y exportar crónicas personales con multimedia. Todo en local, offline-first.

## 2. Objetivos
- Crónicas con texto enriquecido, imágenes y audio.
- Búsqueda rápida full-text.
- Exportación a PDF (editorial) y PNG (quote).
- Privacidad total (local storage).

## 3. Alcance (MVP)
- Editor WYSIWYG (TipTap).
- Audio recording/upload.
- Export PDF/PNG/JSON.
- Full-text search (FlexSearch).
- Year archive view.
- PIN Lock.

## 4. Requerimientos Técnicos
- **Frontend:** React + Vite.
- **Storage:** IndexedDB (Dexie.js).
- **Search:** FlexSearch.
- **Exports:** html2pdf, html-to-image.
- **Auth:** PIN/Biometry mockup.

## 5. Modelos de Datos
### Crónica
```json
{
  "id": "uuid-v4",
  "title": "string",
  "subtitle": "string",
  "content": "HTML string",
  "coverImage": "dataURL/blob",
  "audioFile": "blob",
  "tags": ["string"],
  "createdAt": "ISOString",
  "updatedAt": "ISOString",
  "status": "draft|published|private"
}
```
