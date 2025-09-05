"use client";

import React, { useState } from "react";

// Logo remains the same
const logoBase64 = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBmaWxsPSIjMDA1N0I3IiBkPSJNODkuNyw1Ni44bC04LjEtNC43Yy0wLjUtMS42LTEuMi0zLjItMi00LjdsNC43LTguMWMxLjEtMS45LDAuNC00LjQtMS41LTUuNUw3MC4yLDI2Yy0xLjktMS4xLTQuNC0wLjQtNS41LDEuNWwtNC43LDguMSBjLTEuNi0wLjgtMy4yLTEuNS00LjctMmwtNC43LTguMWMtMS4xLTEuOS0zLjUtMi42LTUuNS0xLjVMMzIuNiwzMS44Yy0xLjksMS4xLTIuNiwzLjUtMS41LDUuNWw0LjcsOC4xYy0wLjgsMS42LTEuNSwzLjItMiw0LjdsNC43LTguMWMxLjEtMS45LDAuNC00LjQtMS41LTUuNUw3MC4yLDI2Yy0xLjktMS4xLTQuNC0wLjQtNS41LDEuNWwtNC43LDguMSBjLTEuNi0wLjgtMy4yLTEuNS00LjctMmwtNC43LTguMWMtMS4xLTEuOS0zLjUtMi42LTUuNS0xLjVMMzIuNiwzMS44Yy0xLjksMS4xLTIuNiwzLjUtMS41LDUuNWw0LjcsOC4xYy0wLjgsMS42LTEuNSwzLjItMiw0LjdsNC43LTguMWMxLjEtMS45LDAuNC00LjQtMS41LTUuNUw3MC4yLDI2Yy0xLjktMS4xLTQuNC0wLjQtNS41LDEuNWwtNC43LDguMSBjLTEuNi0wLjgtMy4yLTEuNS00LjctMmwtNC43LTguMWMtMS4xLTEuOS0zLjUtMi42LTUuNS0xLjVMMzIuNiwzMS44Yy0xLjksMS4xLTIuNiwzLjUtMS41LDUuNWw0LjcsOC4xYy0wLjgsMS42LTEuNSwzLjItMiw0LjdsLThLjEtNC43Yy0xLjksMS4xLTIuNiwzLjUtMS41LDUuNWw3LjUsMTIuOWMxLjEsMS45LDMuNSwyLjYsNS41LDEuNWw4LjEtNC43YzAuNSwxLjYsMS4yLDMuMiwyLDQuN2wtNC43LDguMSBjLTEuMSwxLjktMC40LDQuNCwxLjUsNS41bDEyLjksNy41YzEuOSwxLjEsNC40LDAuNCw1LjUtMS41bDQuNy04LjFjMS42LDAuOCwzLjIsMS41LDQuNywybDQuNyw4LjFjMS4xLDEuOSwzLjUsMi42LDUuNSwxLjUgbDEyLjktNy41YzEuOS0xLjEsMi42LTMuNSwxLjUtNS41bC00LjctOC4xYzAuOC0xLjYsMS41LTMuMiwyLTQuN2w4LjEtNC43YzEuOS0xLjEsMi42LTMuNSwxLjUtNS41TDg5LjcsNTYuOHogTTUwLDY3LjYgYy05LjcsMC0xNy42LTcuOS0xNy42LTE3LjZzNy45LTE3LjYsMTcuNi0xNy42czE3LjYsNy45LDE3LjYsMTcuNlM1OS43LDY3LjYsNTAsNjcuNnoiLz48L3N2Zz4=";

// Color palette
const COLORS = {
  primary: "#0057B7",
  secondary: "#4A90E2",
  text_dark: "#212529",
  text_light: "#6C757D",
  background_light: "#F8F9FA",
  border: "#DEE2E6",
  white: "#FFFFFF",
  danger: "#dc3545",
  success: "#28a745"
};

// Helper functions
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve();
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (err) => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
};

const convertSvgToPng = (svgDataUri, width, height) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 2; // for better resolution
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        const pngDataUri = canvas.toDataURL('image/png');
        resolve(pngDataUri);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error('Failed to load SVG image'));
    img.src = svgDataUri;
  });
};

export default function DynamicAutomotiveInvoice() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Company info state
  const [companyInfo, setCompanyInfo] = useState({
    name: "INDIA AUTOMOTIVES",
    address: "OPPOSITE POLICE STATION, BEHIND SHIV MANION",
    city: "SANGANER, JAIPUR, RAJASTHAN",
    pin: "302022",
    contact: "8239999724",
    gst: "08AAIF16732P1ZQ",
  });

  // Client info state
  const [clientInfo, setClientInfo] = useState({
    name: "AUTO POINT",
    address: "PLOT NO.9, BADI KA BAS SHYAM",
    address2: "NAGAR, TONK ROAD",
    city: "JAIPUR",
    pin: "302022",
    state: "RAJASTHAN",
    pan: "HIXPK8589Q"
  });

  // Invoice details state
  const [invoiceDetails, setInvoiceDetails] = useState({
    number: "INV-" + Date.now().toString().slice(-6),
    date: new Date().toISOString().slice(0, 10), // For date input format
    placeOfSupply: "RAJASTHAN",
  });

  // Products state
  const [products, setProducts] = useState([
    { id: 1, partNumber: "PART001", description: "Sample Product", hsn: "85122010", qty: 1, rate: 1000, cgst: 9, sgst: 9 }
  ]);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    partNumber: "",
    description: "",
    hsn: "",
    qty: 1,
    rate: 0,
    cgst: 9,
    sgst: 9
  });

  // Calculation functions
  const formatCurrency = (n) => "₹ " + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const calculateTaxable = (qty, rate) => qty * rate;

  const calculateProductTotals = () => {
    let subtotal = 0;
    let totalCGST = 0;
    let totalSGST = 0;

    products.forEach(product => {
      const taxable = calculateTaxable(product.qty, product.rate);
      subtotal += taxable;
      totalCGST += (taxable * product.cgst) / 100;
      totalSGST += (taxable * product.sgst) / 100;
    });

    const totalTax = totalCGST + totalSGST;
    const grandTotal = subtotal + totalTax;
    const roundedTotal = Math.round(grandTotal);
    const roundOff = roundedTotal - grandTotal;

    return {
      subtotal,
      totalCGST,
      totalSGST,
      totalTax,
      grandTotal,
      roundedTotal,
      roundOff
    };
  };

  const numberToWords = (num) => {
    const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
    const tens = ["","", "Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
    const two = (n) => n < 20 ? ones[n] : tens[Math.floor(n/10)] + (n%10 ? " " + ones[n%10] : "");
    const group = (n, label) => n ? two(n) + " " + label + " " : "";
    let n = Math.floor(Number(num));
    if (n === 0) return "Zero";
    let res = "";
    res += group(Math.floor(n / 10000000), "Crore");
    res += group(Math.floor((n / 100000) % 100), "Lakh");
    res += group(Math.floor((n / 1000) % 100), "Thousand");
    res += group(Math.floor((n / 100) % 10), "Hundred");
    if (n > 100 && n % 100) res += "and ";
    res += two(n % 100);
    return res.trim();
  };

  const amountInWords = (amount) => {
    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    let words = `Rupees ${numberToWords(rupees)}`;
    if (paise > 0) words += ` and ${numberToWords(paise)} Paise`;
    words += " Only";
    return words;
  };

  // CRUD operations
  const addProduct = () => {
    if (!newProduct.partNumber || !newProduct.description || newProduct.rate <= 0) {
      setErrorMessage("Please fill all product fields with valid values");
      return;
    }
    
    const product = {
      ...newProduct,
      id: Date.now(),
      qty: parseFloat(newProduct.qty) || 1,
      rate: parseFloat(newProduct.rate) || 0,
      cgst: parseFloat(newProduct.cgst) || 0,
      sgst: parseFloat(newProduct.sgst) || 0
    };
    
    setProducts([...products, product]);
    setNewProduct({
      partNumber: "",
      description: "",
      hsn: "",
      qty: 1,
      rate: 0,
      cgst: 9,
      sgst: 9
    });
    setErrorMessage("");
  };

  const updateProduct = (id, field, value) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: field === 'qty' || field === 'rate' || field === 'cgst' || field === 'sgst' ? parseFloat(value) || 0 : value } : p
    ));
  };

  const deleteProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      setErrorMessage("Invoice must have at least one product");
    }
  };

  // PDF Generation
  const generatePDF = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js");
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 36;
      const totals = calculateProductTotals();

      // Header
      let y = 40;
      if (logoBase64) {
        const svgDataUri = `data:image/svg+xml;base64,${logoBase64}`;
        try {
          const pngDataUri = await convertSvgToPng(svgDataUri, 50, 50);
          doc.addImage(pngDataUri, 'PNG', margin, y, 50, 50);
        } catch (e) {
          console.error("Could not add logo:", e);
        }
      }
      
      doc.setFontSize(18);
      doc.setFont(undefined, "bold");
      doc.setTextColor(COLORS.primary);
      doc.text(companyInfo.name, margin + 60, y + 20);

      doc.setFontSize(9);
      doc.setFont(undefined, "normal");
      doc.setTextColor(COLORS.text_light);
      doc.text(companyInfo.address, margin + 60, y + 32);
      doc.text(`${companyInfo.city} - ${companyInfo.pin}`, margin + 60, y + 42);

      doc.setFontSize(22);
      doc.setFont(undefined, "bold");
      doc.setTextColor(COLORS.text_dark);
      doc.text("TAX INVOICE", pageWidth - margin, y + 30, { align: "right" });
      y += 70;

      // Customer & Invoice Details
      doc.setDrawColor(COLORS.border);
      doc.setLineWidth(1);
      doc.line(margin, y, pageWidth - margin, y);
      y += 15;

      const col1 = margin;
      const col2 = pageWidth / 2 + 20;

      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.setTextColor(COLORS.text_dark);
      doc.text("Bill To:", col1, y);
      doc.text("Invoice Details:", col2, y);
      y += 15;

      doc.setFont(undefined, "normal");
      doc.setTextColor(COLORS.text_light);
      doc.text(clientInfo.name, col1, y);
      doc.text(`Invoice No: ${invoiceDetails.number}`, col2, y);
      y += 12;
      doc.text(clientInfo.address, col1, y);
        const formattedDate = new Date(invoiceDetails.date).toLocaleDateString('en-IN');
      doc.text(`Date: ${formattedDate}`, col2, y);
      y += 12;
      doc.text(`${clientInfo.address2}, ${clientInfo.city} - ${clientInfo.pin}`, col1, y);
      doc.text(`Place of Supply: ${invoiceDetails.placeOfSupply}`, col2, y);
      y += 12;
      doc.text(`PAN: ${clientInfo.pan}`, col1, y);
      y += 25;

      // Products Table
      const tableBody = products.map((product, index) => [
        index + 1,
        product.partNumber,
        product.description,
        product.hsn,
        product.qty.toFixed(2),
        product.rate.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
        `${product.cgst}%`,
        `${product.sgst}%`,
        calculateTaxable(product.qty, product.rate).toLocaleString("en-IN", { minimumFractionDigits: 2 })
      ]);

      doc.autoTable({
        startY: y,
        head: [["#", "Part No.", "Description", "HSN", "Qty", "Rate", "CGST", "SGST", "Taxable"]],
        body: tableBody,
        theme: "striped",
        styles: { fontSize: 9, cellPadding: 6, lineColor: COLORS.border, lineWidth: 0.5 },
        headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontStyle: "bold", halign: "center" },
        columnStyles: {
          0: { cellWidth: 28, halign: "center" }, 
          1: { cellWidth: 70 }, 
          2: { cellWidth: 'auto' },
          3: { cellWidth: 50, halign: "center" }, 
          4: { cellWidth: 35, halign: "right" },
          5: { cellWidth: 60, halign: "right" }, 
          6: { cellWidth: 38, halign: "center" },
          7: { cellWidth: 38, halign: "center" }, 
          8: { cellWidth: 70, halign: "right" }
        },
        margin: { left: margin, right: margin },
      });
      
      const lastTableY = doc.lastAutoTable.finalY;

      // Totals Summary
      const summaryBody = [
        ["Subtotal", formatCurrency(totals.subtotal)],
        ["Total CGST", formatCurrency(totals.totalCGST)],
        ["Total SGST", formatCurrency(totals.totalSGST)],
        ["Total Tax", formatCurrency(totals.totalTax)],
        ["Round Off", formatCurrency(totals.roundOff)],
        ["Grand Total", formatCurrency(totals.roundedTotal)],
      ];
      
      doc.autoTable({
        startY: lastTableY + 10,
        body: summaryBody,
        theme: 'plain',
        styles: {
          fontSize: 10,
          cellPadding: { top: 6, right: 10, bottom: 6, left: 10 },
        },
        columnStyles: {
          0: { halign: 'left', fontStyle: 'normal', textColor: COLORS.text_light },
          1: { halign: 'right', fontStyle: 'bold', textColor: COLORS.text_dark }
        },
        margin: { left: pageWidth - margin - 250 },
        didParseCell: (data) => {
          if (data.row.index === summaryBody.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fontSize = 12;
            data.cell.styles.fillColor = COLORS.background_light;
          }
        }
      });

      // Amount in Words
      const amountY = lastTableY + 20;
      doc.setFontSize(9);
      doc.setFont(undefined, "bold");
      doc.setTextColor(COLORS.text_dark);
      doc.text("Amount in words:", margin, amountY);
      
      doc.setFont(undefined, "normal");
      doc.setTextColor(COLORS.text_light);
      doc.text(amountInWords(totals.roundedTotal), margin, amountY + 12);

      // Save
      const filename = `Invoice_${invoiceDetails.number}.pdf`;
      doc.save(filename);

    } catch (error) {
      console.error("PDF Generation Error:", error);
      setErrorMessage("Error generating PDF: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totals = calculateProductTotals();

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f0f4f8', padding: '2rem', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", background: "#fff", padding: '2rem', borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
        
        <h1 style={{ color: COLORS.primary, marginBottom: '1rem', borderBottom: `2px solid ${COLORS.border}`, paddingBottom: '0.5rem' }}>
          Dynamic Invoice Generator
        </h1>

        {/* Company Information */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: COLORS.background_light, borderRadius: 8 }}>
          <h3 style={{ color: COLORS.text_dark, marginBottom: '1rem' }}>Company Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <input type="text" placeholder="Company Name" value={companyInfo.name} onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <input type="text" placeholder="Address" value={companyInfo.address} onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <input type="text" placeholder="City" value={companyInfo.city} onChange={(e) => setCompanyInfo({...companyInfo, city: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <input type="text" placeholder="PIN" value={companyInfo.pin} onChange={(e) => setCompanyInfo({...companyInfo, pin: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
          </div>
        </div>

        {/* Client Information */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: COLORS.background_light, borderRadius: 8 }}>
          <h3 style={{ color: COLORS.text_dark, marginBottom: '1rem' }}>Client Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <input type="text" placeholder="Client Name" value={clientInfo.name} onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <input type="text" placeholder="Address Line 1" value={clientInfo.address} onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <input type="text" placeholder="Address Line 2" value={clientInfo.address2} onChange={(e) => setClientInfo({...clientInfo, address2: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <input type="text" placeholder="City" value={clientInfo.city} onChange={(e) => setClientInfo({...clientInfo, city: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
          </div>
        </div>

        {/* Invoice Details */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: COLORS.background_light, borderRadius: 8 }}>
          <h3 style={{ color: COLORS.text_dark, marginBottom: '1rem' }}>Invoice Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <input type="text" placeholder="Invoice Number" value={invoiceDetails.number} onChange={(e) => setInvoiceDetails({...invoiceDetails, number: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <input type="date" value={invoiceDetails.date} onChange={(e) => setInvoiceDetails({...invoiceDetails, date: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <input type="text" placeholder="Place of Supply" value={invoiceDetails.placeOfSupply} onChange={(e) => setInvoiceDetails({...invoiceDetails, placeOfSupply: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
          </div>
        </div>

        {/* Add New Product */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: COLORS.background_light, borderRadius: 8 }}>
          <h3 style={{ color: COLORS.text_dark, marginBottom: '1rem' }}>Add Product</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
            <input type="text" placeholder="Part Number" value={newProduct.partNumber} onChange={(e) => setNewProduct({...newProduct, partNumber: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <input type="text" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <input type="text" placeholder="HSN Code" value={newProduct.hsn} onChange={(e) => setNewProduct({...newProduct, hsn: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <input type="number" placeholder="Quantity" value={newProduct.qty} onChange={(e) => setNewProduct({...newProduct, qty: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <input type="number" placeholder="Rate" value={newProduct.rate} onChange={(e) => setNewProduct({...newProduct, rate: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <input type="number" placeholder="CGST %" value={newProduct.cgst} onChange={(e) => setNewProduct({...newProduct, cgst: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <input type="number" placeholder="SGST %" value={newProduct.sgst} onChange={(e) => setNewProduct({...newProduct, sgst: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }} />
            <button onClick={addProduct} style={{ padding: '8px 16px', backgroundColor: COLORS.success, color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }} > Add Product </button>
          </div>
        </div>

        {/* Products List */}
        <div style={{ marginBottom: '2rem', overflowX: 'auto' }}>
          <h3 style={{ color: COLORS.text_dark, marginBottom: '1rem' }}>Products</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ backgroundColor: COLORS.primary, color: 'white' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: `1px solid ${COLORS.border}` }}>#</th>
                <th style={{ padding: '10px', textAlign: 'left', border: `1px solid ${COLORS.border}` }}>Part No.</th>
                <th style={{ padding: '10px', textAlign: 'left', border: `1px solid ${COLORS.border}` }}>Description</th>
                <th style={{ padding: '10px', textAlign: 'left', border: `1px solid ${COLORS.border}` }}>HSN</th>
                <th style={{ padding: '10px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>Qty</th>
                <th style={{ padding: '10px', textAlign: 'right', border: `1px solid ${COLORS.border}` }}>Rate</th>
                <th style={{ padding: '10px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>CGST%</th>
                <th style={{ padding: '10px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>SGST%</th>
                <th style={{ padding: '10px', textAlign: 'right', border: `1px solid ${COLORS.border}` }}>Taxable</th>
                <th style={{ padding: '10px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : COLORS.background_light }}>
                  <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{index + 1}</td>
                  <td style={{ padding: '0 8px', border: `1px solid ${COLORS.border}` }}><input type="text" value={product.partNumber} onChange={(e) => updateProduct(product.id, 'partNumber', e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', padding: '8px 0' }} /></td>
                  <td style={{ padding: '0 8px', border: `1px solid ${COLORS.border}` }}><input type="text" value={product.description} onChange={(e) => updateProduct(product.id, 'description', e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', padding: '8px 0' }} /></td>
                  <td style={{ padding: '0 8px', border: `1px solid ${COLORS.border}` }}><input type="text" value={product.hsn} onChange={(e) => updateProduct(product.id, 'hsn', e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', padding: '8px 0' }} /></td>
                  <td style={{ padding: '0 8px', border: `1px solid ${COLORS.border}` }}><input type="number" value={product.qty} onChange={(e) => updateProduct(product.id, 'qty', e.target.value)} style={{ width: '100%', textAlign: 'center', border: 'none', background: 'transparent', padding: '8px 0' }} /></td>
                  <td style={{ padding: '0 8px', border: `1px solid ${COLORS.border}` }}><input type="number" value={product.rate} onChange={(e) => updateProduct(product.id, 'rate', e.target.value)} style={{ width: '100%', textAlign: 'right', border: 'none', background: 'transparent', padding: '8px 0' }} /></td>
                  <td style={{ padding: '0 8px', border: `1px solid ${COLORS.border}` }}><input type="number" value={product.cgst} onChange={(e) => updateProduct(product.id, 'cgst', e.target.value)} style={{ width: '100%', textAlign: 'center', border: 'none', background: 'transparent', padding: '8px 0' }} /></td>
                  <td style={{ padding: '0 8px', border: `1px solid ${COLORS.border}` }}><input type="number" value={product.sgst} onChange={(e) => updateProduct(product.id, 'sgst', e.target.value)} style={{ width: '100%', textAlign: 'center', border: 'none', background: 'transparent', padding: '8px 0' }} /></td>
                  <td style={{ padding: '8px', border: `1px solid ${COLORS.border}`, textAlign: 'right' }}>{formatCurrency(calculateTaxable(product.qty, product.rate))}</td>
                  <td style={{ padding: '8px', border: `1px solid ${COLORS.border}`, textAlign: 'center' }}><button onClick={() => deleteProduct(product.id)} style={{ background: COLORS.danger, color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Totals Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '2rem', padding: '1.5rem', backgroundColor: COLORS.background_light, borderRadius: 8 }}>
          <div style={{ maxWidth: '60%' }}>
            <h4 style={{ color: COLORS.text_dark, margin: '0 0 8px 0' }}>Amount in Words:</h4>
            <p style={{ color: COLORS.text_light, fontStyle: 'italic', margin: 0 }}>{amountInWords(totals.roundedTotal)}</p>
          </div>
          <div style={{ width: '35%', minWidth: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: COLORS.text_light }}>Subtotal:</span><span style={{ color: COLORS.text_dark, fontWeight: 'bold' }}>{formatCurrency(totals.subtotal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: COLORS.text_light }}>Total CGST:</span><span style={{ color: COLORS.text_dark, fontWeight: 'bold' }}>{formatCurrency(totals.totalCGST)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span style={{ color: COLORS.text_light }}>Total SGST:</span><span style={{ color: COLORS.text_dark, fontWeight: 'bold' }}>{formatCurrency(totals.totalSGST)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingTop: '12px', borderTop: `1px solid ${COLORS.border}` }}><span style={{ color: COLORS.text_light, fontWeight: 'bold' }}>Total Tax:</span><span style={{ color: COLORS.text_dark, fontWeight: 'bold' }}>{formatCurrency(totals.totalTax)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: COLORS.text_light }}>Round Off:</span><span style={{ color: COLORS.text_dark, fontWeight: 'bold' }}>{formatCurrency(totals.roundOff)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: `2px solid ${COLORS.primary}`, marginTop: '10px' }}><span style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: '1.2rem' }}>Grand Total:</span><span style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: '1.2rem' }}>{formatCurrency(totals.roundedTotal)}</span></div>
          </div>
        </div>

        {/* Action Button and Error Message */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          {errorMessage && (<p style={{ color: COLORS.danger, marginBottom: '1rem', background: '#f8d7da', padding: '10px', borderRadius: '4px' }}>{errorMessage}</p>)}
          <button onClick={generatePDF} disabled={isLoading} style={{ padding: '12px 30px', fontSize: '1rem', backgroundColor: isLoading ? COLORS.text_light : COLORS.primary, color: 'white', border: 'none', borderRadius: 5, cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background-color 0.3s', width: '250px' }} >
            {isLoading ? 'Generating PDF...' : 'Download Invoice PDF'}
          </button>
        </div>

      </div>
    </div>
  );
}