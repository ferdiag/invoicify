// services/invoicePdf.service.ts
import PDFDocument from "pdfkit";
import { db } from "../db/client";
import { invoices, customers, users } from "../db/schema";
import { eq } from "drizzle-orm";

function euro(n: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

export async function buildInvoicePdfStream(id: string): Promise<PDFKit.PDFDocument> {
  const inv = await db.query.invoices.findFirst({ where: eq(invoices.id, id) });
  if (!inv) throw new Error("Invoice not found");

  const [cust] = await db.select().from(customers).where(eq(customers.id, inv.customerId)).limit(1);
  const [usr] = await db.select().from(users).where(eq(users.id, inv.userId)).limit(1);

  const net = inv.products.reduce((s, p) => s + Number(p.quantity) * Number(p.price), 0);
  const gross = +(net * (1 + inv.vat / 100)).toFixed(2);

  const doc = new PDFDocument({ size: "A4", margin: 50 });

  // --- Inhalt sofort synchron schreiben ---
  doc.fontSize(18).text(usr?.email ?? "Invoicify", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#666");
  if (usr?.address) doc.text(usr.address);
  doc.text(`${usr?.zip ?? ""} ${usr?.city ?? ""}`);
  doc.fillColor("#000").moveDown();

  doc.fontSize(12).text("Rechnung an:", { underline: true }).moveDown(0.3);
  doc.fontSize(10).text(cust?.name ?? "");
  if (cust?.contact) doc.text(cust.contact);
  if (cust?.address) doc.text(cust.address);
  doc.text(`${cust?.zip ?? ""} ${cust?.city ?? ""}`).moveDown(1);

  doc.fontSize(14).text(inv.name);
  doc.fontSize(10).text(`Rechnungsdatum: ${inv.invoiceDate}`);
  doc.text(`Fällig bis: ${inv.dueDate}`);
  doc.text(`USt.: ${inv.vat}%`).moveDown(0.8);

  const startX = 50;
  let y = doc.y;
  const col = (x: number) => startX + x;

  doc.fontSize(11).text("Position", col(0), y);
  doc.text("Menge", col(280), y, { width: 60, align: "right" });
  doc.text("Preis", col(350), y, { width: 80, align: "right" });
  doc.text("Summe", col(440), y, { width: 100, align: "right" });
  y += 18;
  doc.moveTo(startX, y).lineTo(545, y).strokeColor("#ccc").stroke();
  y += 6;

  inv.products.forEach((p) => {
    const rowSum = Number(p.quantity) * Number(p.price);
    doc.fontSize(10).fillColor("#000");
    doc.text(p.name, col(0), y, { width: 260 });
    doc.text(String(p.quantity), col(280), y, { width: 60, align: "right" });
    doc.text(euro(Number(p.price)), col(350), y, { width: 80, align: "right" });
    doc.text(euro(rowSum), col(440), y, { width: 100, align: "right" });
    y += 18;
    if (y > 760) {
      doc.addPage();
      y = 50;
    }
  });

  y += 10;
  doc.moveTo(startX, y).lineTo(545, y).strokeColor("#ccc").stroke();
  y += 10;

  doc.fontSize(11);
  doc.text("Netto:", col(350), y, { width: 80, align: "right" });
  doc.text(euro(net), col(440), y, { width: 100, align: "right" });
  y += 16;
  doc.text(`USt. (${inv.vat}%):`, col(350), y, { width: 80, align: "right" });
  doc.text(euro(gross - net), col(440), y, { width: 100, align: "right" });
  y += 16;
  doc.font("Helvetica-Bold");
  doc.text("Brutto:", col(350), y, { width: 80, align: "right" });
  doc.text(euro(gross), col(440), y, { width: 100, align: "right" });
  doc.font("Helvetica").moveDown(2);
  doc.fontSize(9).fillColor("#666").text("Vielen Dank für Ihren Auftrag!");

  // Wichtig: stream beenden, nachdem Inhalt geschrieben ist
  doc.end();

  return doc; // <— den Stream zurückgeben
}
