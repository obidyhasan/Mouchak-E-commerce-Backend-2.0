/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../errors/AppError";

export interface IInvoiceProduct {
  name: string;
  quantity: number;
  price: number; // Price per unit
}

export interface IInvoiceData {
  orderId: string;
  orderDate: Date;
  userName: string;
  userEmail: string;
  products: IInvoiceProduct[];
  subtotal: number; // Sum of (price * quantity)
  shippingCost: number; // Shipping cost
  totalAmount: number; // subtotal + shippingCost
}

export const generatePdf = async (
  invoiceData: IInvoiceData
): Promise<Buffer> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers: Uint8Array[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // ========== TITLE ==========
      doc
        .fontSize(20)
        .fillColor("#1a73e8")
        .text("Invoice Confirmation", { align: "center" });
      doc.moveDown(2);

      // ========== DETAILS ==========
      doc.fontSize(12).fillColor("#000");
      doc.text(`Name: ${invoiceData.userName}`);
      doc.text(`Email: ${invoiceData.userEmail}`);
      doc.text(
        `Order Date: ${new Date(invoiceData.orderDate).toLocaleString()}`
      );
      doc.moveDown(2);

      // ========== TABLE HEADER ==========
      const tableTop = doc.y;
      const colX = [50, 250, 350, 450]; // column positions

      doc.font("Helvetica-Bold").fontSize(12);
      doc.text("Product", colX[0], tableTop);
      doc.text("Qty", colX[1], tableTop);
      doc.text("Price (BDT)", colX[2], tableTop);
      doc.text("Subtotal (BDT)", colX[3], tableTop);

      doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      doc.moveDown(1);

      // ========== TABLE BODY ==========
      doc.font("Helvetica").fontSize(11);
      let currentY = tableTop + 25;
      let calculatedSubtotal = 0;

      invoiceData.products.forEach((item) => {
        const rowSubtotal = item.price * item.quantity;
        calculatedSubtotal += rowSubtotal;

        doc.text(item.name, colX[0], currentY);
        doc.text(`${item.quantity}`, colX[1], currentY);
        doc.text(`BDT ${item.price.toFixed(2)}`, colX[2], currentY);
        doc.text(`BDT ${rowSubtotal.toFixed(2)}`, colX[3], currentY);

        currentY += 20;
      });

      doc.moveDown(2);

      // ========== SUMMARY ==========
      const shipping = invoiceData.shippingCost || 0;
      const total = calculatedSubtotal + shipping;

      doc.fontSize(12).text(`Subtotal: BDT ${calculatedSubtotal.toFixed(2)}`, {
        align: "right",
      });
      doc.text(`Shipping: BDT ${shipping.toFixed(2)}`, { align: "right" });
      doc.moveDown(0.5);
      doc
        .font("Helvetica-Bold")
        .fillColor("#1a73e8")
        .fontSize(14)
        .text(`Total Paid: BDT ${total.toFixed(2)}`, { align: "right" });

      doc.moveDown(4);

      // ========== FOOTER ==========
      doc
        .fontSize(11)
        .fillColor("gray")
        .text("Thanks for shopping with us!", { align: "center" });
      doc
        .fontSize(10)
        .fillColor("gray")
        .text(`© ${new Date().getFullYear()} Mouchack`, { align: "center" });

      doc.end();
    });
  } catch (error: any) {
    console.log(error);
    throw new AppError(401, `Pdf creation error: ${error.message}`);
  }
};
