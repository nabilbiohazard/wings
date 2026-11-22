<?php
defined('ABSPATH') || exit;

final class Wings_Charm_Layouts {
    const KEY = '_wings_charm_layout';

    public static function get($product) {
        $saved = $product->get_meta(self::KEY, true);
        return is_array($saved) ? self::validate($saved) : false;
    }

    public static function validate($value) {
        if (!is_array($value) || ($value['version'] ?? 0) !== 1 || !isset($value['slots']) || !is_array($value['slots']) || count($value['slots']) < 1 || count($value['slots']) > 30) return false;
        $max = $value['maxCharms'] ?? 0;
        if (!is_int($max) || $max < 1 || $max > count($value['slots'])) return false;
        $image = isset($value['image']) && is_string($value['image']) ? esc_url_raw($value['image'], array('http', 'https')) : '';
        if (!$image || !preg_match('#^https?://#', $image)) return false;
        $slots = array(); $seen = array();
        foreach ($value['slots'] as $slot) {
            if (!is_array($slot)) return false;
            foreach (array('x', 'y') as $axis) {
                if (!isset($slot[$axis]) || !is_numeric($slot[$axis]) || !is_finite((float)$slot[$axis]) || $slot[$axis] < 0 || $slot[$axis] > 600) return false;
            }
            $clean = array('x' => round((float)$slot['x'], 2), 'y' => round((float)$slot['y'], 2));
            if (isset($slot['rotation'])) {
                if (!is_numeric($slot['rotation']) || !is_finite((float)$slot['rotation']) || abs((float)$slot['rotation']) > 360) return false;
                $clean['rotation'] = (float)$slot['rotation'];
            }
            $key = $clean['x'] . ',' . $clean['y'];
            if (isset($seen[$key])) return false;
            $seen[$key] = true; $slots[] = $clean;
        }
        return array('version' => 1, 'image' => $image, 'maxCharms' => $max, 'slots' => $slots);
    }

    public static function box() {
        add_meta_box('wings-charm-layout', 'Wings — Charm placement editor', array(__CLASS__, 'render'), 'product', 'normal', 'high');
    }

    public static function assets() {
        $screen = get_current_screen();
        if (!$screen || $screen->base !== 'post' || $screen->post_type !== 'product') return;
        wp_enqueue_media();
        wp_enqueue_style('wings-layout-editor', plugins_url('assets/charm-layout-editor.css', __FILE__), array(), '1.3.0');
        wp_enqueue_script('wings-layout-editor', plugins_url('assets/charm-layout-editor.js', __FILE__), array('media-editor'), '1.3.0', true);
    }

    public static function render($post) {
        if (!current_user_can('edit_post', $post->ID)) return;
        $product = wc_get_product($post->ID);
        if (!$product) return;
        $layout = self::get($product);
        $image = $layout['image'] ?? wp_get_attachment_image_url($product->get_image_id(), 'full');
        wp_nonce_field('wings_charm_layout', 'wings_layout_nonce');
        echo '<div id="wings-layout-editor" dir="ltr" data-initial="' . esc_attr(wp_json_encode($layout)) . '" data-image="' . esc_url($image ?: '') . '">';
        echo '<p><label><input type="checkbox" id="wings-layout-enabled"' . checked((bool)$layout, true, false) . '> Enable charm placement for this product</label></p>';
        echo '<p>Drag numbered slots onto the links. Arrow keys move a selected slot by 1 unit; Shift + arrow moves it by 10. Customers never see these markers.</p>';
        echo '<div class="wings-layout-toolbar"><button type="button" class="button" data-action="image">Choose product image</button> <button type="button" class="button" data-action="add">Add slot</button> <button type="button" class="button" data-action="undo">Undo</button> <button type="button" class="button" data-action="preview">Choose preview charm</button> <label><input type="checkbox" id="wings-show-preview"> Preview charms</label></div>';
        echo '<div class="wings-layout-workspace"><div class="wings-layout-canvas" tabindex="0" aria-label="Charm placement canvas"><img class="wings-layout-image" alt="Product placement background" draggable="false"><div class="wings-layout-markers"></div></div><div class="wings-layout-panel"><label>Maximum charms <input id="wings-layout-max" type="number" min="1" max="30"></label><p id="wings-layout-count"></p><div id="wings-slot-fields"><strong id="wings-slot-title"></strong><label>X <input data-axis="x" type="number" min="0" max="600" step="1"></label><label>Y <input data-axis="y" type="number" min="0" max="600" step="1"></label><label>Rotation (degrees) <input data-axis="rotation" type="number" min="-360" max="360" step="1" placeholder="Automatic"></label><button type="button" class="button" data-action="remove">Remove selected slot</button></div><div id="wings-slot-list" aria-label="Select a slot"></div></div></div>';
        echo '<p role="status" id="wings-layout-status">Save with the product’s Update / Publish button.</p><input type="hidden" name="wings_charm_layout" id="wings-layout-value"></div>';
    }

    public static function save($product) {
        if (!isset($_POST['wings_layout_nonce']) || !is_string($_POST['wings_layout_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['wings_layout_nonce'])), 'wings_charm_layout') || !current_user_can('edit_post', $product->get_id())) return;
        $raw = isset($_POST['wings_charm_layout']) && is_string($_POST['wings_charm_layout']) ? wp_unslash($_POST['wings_charm_layout']) : '';
        if ($raw === 'null') { $product->delete_meta_data(self::KEY); return; }
        $layout = self::validate(json_decode($raw, true));
        if (!$layout) { WC_Admin_Meta_Boxes::add_error('Charm layout was not saved. Choose an image, add 1–30 distinct slots, and set a valid maximum.'); return; }
        $product->update_meta_data(self::KEY, $layout);
    }

    public static function rest($response, $product, $request) {
        $data = $response->get_data();
        $layout = self::get($product);
        if ($layout) {
            $data['meta_data'] = array_values(array_filter($data['meta_data'] ?? array(), function($row) { $row = is_object($row) ? $row->get_data() : $row; return $row['key'] !== self::KEY; }));
            $data['meta_data'][] = array('id' => 0, 'key' => self::KEY, 'value' => $layout);
            $response->set_data($data);
        }
        return $response;
    }
}
add_action('add_meta_boxes_product', array('Wings_Charm_Layouts', 'box'));
add_action('admin_enqueue_scripts', array('Wings_Charm_Layouts', 'assets'));
add_action('woocommerce_admin_process_product_object', array('Wings_Charm_Layouts', 'save'));
add_filter('woocommerce_rest_prepare_product_object', array('Wings_Charm_Layouts', 'rest'), 10, 3);
