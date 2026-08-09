# Chrome Web Store submission notes

## Permission justifications

### storage
Unwinator uses the storage permission only to save the user's extension settings, including whether Unwinator is enabled and the selected mangling intensity. This allows those preferences to persist between pages and browser sessions. It does not store page content or personal data.

### activeTab
Unwinator uses activeTab so the user can explicitly activate or change Unwinator on the current browser tab from the extension popup. Access is needed to transform the visible text on that tab and to restore the original text when Unwinator is switched off.

### scripting
Unwinator uses the scripting permission to run its text-transformation code in the active webpage. The script modifies visible text in the page DOM to produce Unwinese and spoonerised versions, while excluding form fields, scripts, code and other inappropriate elements.

### Host permission
Unwinator requires host access because its single purpose is to transform visible text on webpages chosen by the user. The extension must be able to access the page DOM in order to find and modify text. It does not collect, transmit, sell or remotely process webpage content.

## Remote code
Select: **No, I am not using remote code.**

All executable JavaScript is included in the extension package. Unwinator does not fetch or execute remote JavaScript or WebAssembly and does not evaluate remotely supplied code.

## Assets
- Store icon: `assets/unwinator-store-icon-128.png` — 128 × 128 PNG, with artwork inside the recommended safe area.
- Screenshot: `assets/unwinator-store-screenshot-1280x800.png` — 1280 × 800 RGB PNG.
