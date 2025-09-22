// services/invoicePdf.service.ts
import PDFDocument from "pdfkit";
import { db } from "../db/client";
import { invoices, customers, users, invoiceItems } from "../db/schema";
import { eq } from "drizzle-orm";

function euro(n: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
}

function r2(n: number) {
  return Math.round(n * 100) / 100;
}

export async function buildInvoicePdfStream(id: string): Promise<PDFKit.PDFDocument> {
  const inv = await db.query.invoices.findFirst({ where: eq(invoices.id, id) });
  if (!inv) throw new Error("Invoice not found");

  const [cust] = await db.select().from(customers).where(eq(customers.id, inv.customerId)).limit(1);
  const [usr] = await db.select().from(users).where(eq(users.id, inv.userId)).limit(1);
  const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, inv.id));

  const net = r2(items.reduce((s, p) => s + Number(p.quantity) * Number(p.unitPrice), 0));
  const vatAmt = r2(net * (Number(inv.vat) / 100));
  const gross = r2(net + vatAmt);

  const doc = new PDFDocument({ size: "A4", margin: 50 });

  const heading = usr?.company && usr.company.trim() ? usr.company : (usr?.email ?? "Invoicify");
  const startX = 50;
  const tableX = startX;
  const colNameW = 260;
  const colQtyW = 70;
  const colPriceW = 90;
  const colSumW = 110;
  const colGap1 = 0;
  const colGap2 = 20;
  const colGap3 = 20;

  function tableHeader(y: number) {
    doc.fontSize(10).fillColor("#111").text("Position", tableX, y, { width: colNameW });
    doc.text("Menge", tableX + colNameW + colGap1, y, { width: colQtyW, align: "right" });
    doc.text("Preis", tableX + colNameW + colGap1 + colQtyW + colGap2, y, {
      width: colPriceW,
      align: "right",
    });
    doc.text("Summe", tableX + colNameW + colGap1 + colQtyW + colGap2 + colPriceW + colGap3, y, {
      width: colSumW,
      align: "right",
    });
    const y2 = y + 16;
    doc.moveTo(tableX, y2).lineTo(545, y2).strokeColor("#e5e7eb").stroke();
    return y2 + 8;
  }

  function newPageWithHeader() {
    doc.addPage();
    return tableHeader(140);
  }

  doc.font("Helvetica-Bold").fontSize(20).fillColor("#111").text(heading, { align: "left" });
  doc.moveDown(0.5);
  doc.font("Helvetica").fontSize(10).fillColor("#6b7280");
  if (usr?.address) doc.text(usr.address);
  doc.text(`${usr?.zip ?? ""} ${usr?.city ?? ""}`.trim());
  doc.moveDown(1);

  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111").text("Rechnung", { continued: false });
  doc.moveDown(0.4);
  doc.font("Helvetica").fontSize(10).fillColor("#111");
  doc.text(`Rechnungsname: ${inv.name}`);
  doc.text(`Rechnungsnummer: ${inv.invoiceNumber}`);
  doc.text(`Rechnungsdatum: ${inv.invoiceDate}`);
  doc.text(`Fällig bis: ${inv.dueDate}`);
  doc.text(`USt.: ${inv.vat}%`);
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").fontSize(11).text("Rechnung an:");
  doc.font("Helvetica").fontSize(10).fillColor("#111");
  doc.text(cust?.name ?? "");
  if (cust?.contact) doc.text(cust.contact);
  if (cust?.address) doc.text(cust.address);
  doc.text(`${cust?.zip ?? ""} ${cust?.city ?? ""}`.trim());
  doc.moveDown(1);

  let y = tableHeader(doc.y);

  items.forEach((p, i) => {
    const rowSum = r2(Number(p.quantity) * Number(p.unitPrice));
    doc.fontSize(10).fillColor("#111");
    doc.text(p.name, tableX, y, { width: colNameW });
    doc.text(String(p.quantity), tableX + colNameW + colGap1, y, {
      width: colQtyW,
      align: "right",
    });
    doc.text(euro(Number(p.unitPrice)), tableX + colNameW + colGap1 + colQtyW + colGap2, y, {
      width: colPriceW,
      align: "right",
    });
    doc.text(
      euro(rowSum),
      tableX + colNameW + colGap1 + colQtyW + colGap2 + colPriceW + colGap3,
      y,
      {
        width: colSumW,
        align: "right",
      }
    );
    y += 18;
    if (y > 760 && i < items.length - 1) y = newPageWithHeader();
  });

  if (y < 680) y = 680;

  doc.moveTo(tableX, y).lineTo(545, y).strokeColor("#e5e7eb").stroke();
  y += 10;

  const boxX = tableX + colNameW + colQtyW + colPriceW + colGap2 + colGap3 - 20;
  const boxW = 200;
  const boxY = y;
  const lineH = 18;

  doc.fontSize(11).fillColor("#111");
  doc.text("Netto:", boxX, y, { width: 80, align: "right" });
  doc.text(euro(net), boxX + 90, y, { width: 90, align: "right" });
  y += lineH;
  doc.text(`USt. (${inv.vat}%):`, boxX, y, { width: 80, align: "right" });
  doc.text(euro(vatAmt), boxX + 90, y, { width: 90, align: "right" });
  y += lineH;
  doc.font("Helvetica-Bold");
  doc.text("Brutto:", boxX, y, { width: 80, align: "right" });
  doc.text(euro(gross), boxX + 90, y, { width: 90, align: "right" });
  doc.font("Helvetica");

  doc
    .rect(boxX - 10, boxY - 8, boxW, lineH * 3 + 10)
    .strokeColor("#e5e7eb")
    .lineWidth(0.5)
    .stroke();

  doc.moveDown(2);
  doc.fontSize(9).fillColor("#6b7280").text("Vielen Dank für Ihren Auftrag!");

  doc.end();
  return doc;
}
