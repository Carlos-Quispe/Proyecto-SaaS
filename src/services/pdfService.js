import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

export function generatePdf(title, columns, data, filename = 'reporte.pdf') {
  const doc = new jsPDF();
  const tableData = data.length > 0
    ? data
    : [[{
      content: 'No hay registros para los filtros seleccionados.',
      colSpan: columns.length,
      styles: { halign: 'center', textColor: 100 },
    }]];

  // Title
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text(title, 14, 22);

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 30);

  // Table
  autoTable(doc, {
    startY: 36,
    head: [columns],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241] }, // Indigo
    styles: { fontSize: 9, cellPadding: 3 },
  });

  doc.save(filename);
  return doc;
}
