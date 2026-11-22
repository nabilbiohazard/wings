# Visual charm placement editor — Wings Commerce 1.3.1

Install `wings-commerce-1.3.1.zip` using WordPress → Plugins → Add New → Upload Plugin. Replace the installed Wings Commerce version when prompted. This keeps existing settings and products.

Go to Products → edit a bracelet or necklace → **Wings — Charm placement editor**.

1. Enable charm placement for the product. Add the slots you want customers to use.
2. Choose a product image from the WordPress media library if needed. The editor and customer builder use this same image. Changing the image requires reviewing the slots.
3. Add slots and drag their numbered markers onto the chain links. Select a marker or its number in the sidebar to edit its X/Y coordinates. Arrow keys nudge by 1 unit; Shift + arrow nudges by 10. Coordinates use a 600×600 square, with images contained inside it.
4. Leave Rotation blank for automatic outward rotation, or enter an angle. Choose a preview charm from the media library to inspect its placement; preview selection is temporary and never changes the actual charm catalogue.
5. Set Maximum charms (no more than the number of slots). Each slot accepts one charm.
6. Click the product's **Update / Publish** button. Reopen or refresh the customer builder to load the saved layout.

Unchecking custom fixed slots restores the standard placement behavior, including the built-in BC-2 default. Undo reverses up to 50 editor changes before saving. Removing a slot renumbers subsequent slots.

Markers, editing scripts, and editing controls appear only in WordPress product administration. Saved coordinates are delivered to the storefront through the authenticated WooCommerce product API. The plugin checks editing permissions and a nonce before saving, validates the image/coordinates/count, and checks slot occupancy and maximum charms again when preparing an order.

Old saved customer designs whose coordinates no longer match the current product layout must be adjusted in the builder before ordering.

The ZIP is built locally, not installed on the connected WordPress server automatically. PHP syntax is parsed locally; a live WordPress save/refresh should be checked after installing the update.
