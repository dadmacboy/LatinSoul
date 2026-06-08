# Latin Soul Ordering App - Version 8

This version does NOT require an assets folder.

Upload every file directly to the GitHub repository root:
- index.html
- styles.css
- app.js
- google-apps-script.js
- latin-soul-menu.jpg
- appetizer-platter.jpg
- ceviche-drink.jpg
- lomo-saltado.jpg
- empanadas.jpg
- menu-texture.jpg

This avoids GitHub web upload flattening the assets folder.


## Version 9 call button

This build adds:
- Order Received confirmation message
- Reminder that changes/cancellations are only available while status is NEW
- Call Restaurant button/message on confirmation and order lookup

To activate direct calling, open `app.js` and update:

const RESTAURANT_PHONE_DISPLAY = "098-XXX-XXXX";
const RESTAURANT_PHONE_DIAL = "+8198XXXXXXX";

If RESTAURANT_PHONE_DIAL is blank, the app will show the phone label but will not create a dial button.
