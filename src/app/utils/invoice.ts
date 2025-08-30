/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import AppError from "../errors/AppError";

export interface IInvoiceProduct {
  name: string; // product name (বাংলা)
  quantity: number;
  price: number;
}

export interface IInvoiceData {
  orderId: string;
  orderDate: Date;
  userName: string;
  userEmail: string;
  products: IInvoiceProduct[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
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

      // ========= BANGLA FONT FOR PRODUCT NAMES =========
      const fontPath = path.join(
        __dirname,
        "./../font/NotoSansBengali-Regular.ttf"
      );
      if (fs.existsSync(fontPath)) {
        doc.registerFont("Bangla", fontPath);
      }

      // ========== TITLE ==========
      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .fillColor("#1a73e8")
        .text("Invoice Confirmation", { align: "center" });
      doc.moveDown(2);

      // ========== DETAILS ==========
      doc.font("Helvetica").fontSize(12).fillColor("#000");
      doc.text(`Name: ${invoiceData.userName}`);
      doc.text(`Email: ${invoiceData.userEmail}`);
      doc.text(
        `Order Date: ${new Date(invoiceData.orderDate).toLocaleString()}`
      );
      doc.moveDown(2);

      // ========== TABLE HEADER ==========
      const tableTop = doc.y;
      const colX = [50, 250, 350, 450]; // starting x of each column
      const colWidth = [200, 100, 100, 100]; // approximate width for center align

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
      let currentY = tableTop + 25;
      let calculatedSubtotal = 0;

      invoiceData.products.forEach((item) => {
        const rowSubtotal = item.price * item.quantity;
        calculatedSubtotal += rowSubtotal;

        // Product name in Bangla (left aligned)
        doc.font("Bangla").text(item.name, colX[0], currentY);

        // Quantity center aligned
        const qtyText = `${item.quantity}`;
        const qtyX = colX[1] + colWidth[1] / 2 - doc.widthOfString(qtyText) / 2;
        doc.font("Helvetica").text(qtyText, qtyX, currentY);

        // Price center aligned
        const priceText = `BDT ${item.price.toFixed(2)}`;
        const priceX =
          colX[2] + colWidth[2] / 2 - doc.widthOfString(priceText) / 2;
        doc.text(priceText, priceX, currentY);

        // Subtotal center aligned
        const subtotalText = `BDT ${rowSubtotal.toFixed(2)}`;
        const subtotalX =
          colX[3] + colWidth[3] / 2 - doc.widthOfString(subtotalText) / 2;
        doc.text(subtotalText, subtotalX, currentY);

        currentY += 20;
      });

      doc.moveDown(2);

      // ========== SUMMARY ==========
      const shipping = invoiceData.shippingCost || 0;
      const total = calculatedSubtotal + shipping;

      doc
        .font("Helvetica")
        .fontSize(12)
        .text(`Subtotal: BDT ${calculatedSubtotal.toFixed(2)}`, {
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
        .font("Helvetica")
        .fontSize(11)
        .fillColor("gray")
        .text("Thanks for shopping with us!", { align: "center" });
      doc
        .fontSize(10)
        .text(`© ${new Date().getFullYear()} Mouchak`, { align: "center" });

      doc.end();
    });
  } catch (error: any) {
    console.log(error);
    throw new AppError(401, `Pdf creation error: ${error.message}`);
  }
};
