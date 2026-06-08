const SHEET_NAME = "Orders";
const RESTAURANT_EMAIL = "isilva.usalas@gmail.com";

function getOrdersSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "OrderID",
      "CreatedAt",
      "CustomerName",
      "Phone",
      "PreferredContact",
      "ContactInfo",
      "LINE",
      "WhatsApp",
      "PickupTime",
      "Payment",
      "Items",
      "Total",
      "Status",
      "Notes",
      "LastUpdated"
    ]);
  }

  return sheet;
}

function doPost(e) {
  try {
    const sheet = getOrdersSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.orderId,
      new Date(),
      data.customerName,
      data.phone,
      data.contactMethod || "",
      data.contactInfo || "",
      data.line || "",
      data.whatsapp || "",
      data.pickupTime,
      data.payment,
      data.items,
      data.total,
      "New",
      data.notes || "",
      new Date()
    ]);

    sendOrderEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendOrderEmail(data) {
  const subject = "Latin Soul New Order " + data.orderId;

  const body =
`NEW ORDER: ${data.orderId}

CUSTOMER
Name: ${data.customerName}
Phone: ${data.phone}
Preferred Contact: ${data.contactMethod || ""}
Contact Info: ${data.contactInfo || "Not provided"}
LINE: ${data.line || "Not provided"}
WhatsApp: ${data.whatsapp || "Not provided"}

ORDER
Pickup Time: ${data.pickupTime}
Payment: ${data.payment}

Items:
${data.items}

Total: ¥${data.total}

Status: New`;

  MailApp.sendEmail(RESTAURANT_EMAIL, subject, body);
}

function testDoPost() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        orderId: "TEST-001",
        customerName: "David Test",
        phone: "090-0000-0000",
        contactMethod: "WhatsApp",
        contactInfo: "+81 90-0000-0000",
        line: "",
        whatsapp: "+81 90-0000-0000",
        pickupTime: "18:30",
        payment: "Cash at pickup",
        items: "1 x Lomo Saltado; 1 x Inca Kola",
        total: 2950,
        notes: "Preferred Contact: WhatsApp"
      })
    }
  };

  doPost(fakeEvent);
}
