<?php
defined('ABSPATH') || exit;

final class Wings_Designs {
    private static $charm_terms = null;
    public static function catalogue() {
        return json_decode(file_get_contents(__DIR__ . '/charm-catalogue.json'), true) ?: array();
    }
    public static function eligible($product) {
        if (self::is_store_charm($product)) return false;
        $text = $product->get_name();
        foreach (wp_get_post_terms($product->get_id(), 'product_cat') as $term) $text .= ' ' . $term->name . ' ' . urldecode($term->slug);
        if (preg_match('/لباس|پوشاک|clothing|apparel|\bdress\b|\bshirt\b/iu', $text)) return false;
        return (bool) preg_match('/گردنبند|دستبند|گوشواره|necklace|bracelet|earring/iu', $text);
    }
    private static function fail($message, $status = 400) { throw new RuntimeException($message, $status); }
    public static function rules($product) {
        $terms = wp_get_post_terms($product->get_id(), 'product_cat');
        if (is_wp_error($terms)) self::fail('دریافت دسته‌بندی محصول انجام نشد.', 503);
        $categories = array(); $text = '';
        foreach ($terms as $term) {
            $categories[] = array('id' => (int) $term->term_id, 'name' => $term->name, 'slug' => $term->slug);
            $text .= ' ' . $term->name . ' ' . urldecode($term->slug);
        }
        $text = str_replace(array('ي', 'ك'), array('ی', 'ک'), $text);
        $text = preg_replace('/[\s\x{200C}_-]+/u', ' ', $text);
        if (!preg_match('/گردنبند|دستبند|necklace|bracelet/iu', $text)) $text .= ' ' . $product->get_name();
        $kind = preg_match('/گردنبند|necklace/iu', $text) ? 'necklace' : (preg_match('/دستبند|bracelet/iu', $text) ? 'bracelet' : 'other');
        $single = (bool) preg_match('/تک\s*چارم|single\s*charm|one\s*charm/iu', $text);
        return array('single' => $single, 'categories' => $categories,
            'label' => ($kind === 'necklace' ? 'گردنبند' : ($kind === 'bracelet' ? 'دستبند' : 'محصول')) . ($single ? ' تک‌چارم' : ' چندچارم'),
            'anchor' => $kind === 'necklace' ? array('x' => 300, 'y' => 578, 'rotation' => 0) : ($kind === 'bracelet' && $single ? array('x' => 298, 'y' => 472, 'rotation' => 0) : array('x' => 289, 'y' => 516, 'rotation' => 0)));
    }
    private static function term_ids() {
        if (self::$charm_terms !== null) return self::$charm_terms;
        $terms = get_terms(array('taxonomy' => 'product_cat', 'hide_empty' => false));
        if (is_wp_error($terms)) self::fail('دریافت دسته‌بندی چارم‌ها انجام نشد.', 503);
        $ids = array();
        foreach ($terms as $term) {
            $name = preg_replace('/[\s\x{200C}_-]/u', '', urldecode($term->name));
            $slug = preg_replace('/[\s\x{200C}_-]/u', '', urldecode($term->slug));
            if (!preg_match('/^(?:چارم(?:ها)?|charms?)$/iu', $name) && !preg_match('/^(?:چارم(?:ها)?|charms?)$/iu', $slug)) continue;
            $ids[] = $term->term_id; $children = get_term_children($term->term_id, 'product_cat');
            if (!is_wp_error($children)) $ids = array_merge($ids, $children);
        }
        self::$charm_terms = array_unique(array_map('intval', $ids));
        return self::$charm_terms;
    }
    private static function is_store_charm($product) {
        $id = $product->is_type('variation') ? $product->get_parent_id() : $product->get_id();
        $ids = self::term_ids();
        return $ids && has_term($ids, 'product_cat', $id);
    }
    private static function entry($product) {
        $parent = $product->is_type('variation') ? wc_get_product($product->get_parent_id()) : $product;
        $currency = get_woocommerce_currency(); $price = (float) $product->get_price();
        $image = wp_get_attachment_image_url($product->get_image_id() ?: $parent->get_image_id(), 'full') ?: '';
        return array('id' => 'woo-' . $product->get_id(), 'product_id' => $product->get_id(), 'name' => $product->get_name(), 'image' => $image,
            'price' => $currency === 'IRR' ? $price / 10 : $price, 'category' => 'چارم‌ها', 'attachment' => array('x' => 50, 'y' => 30),
            'available' => (bool) $image && $product->is_in_stock() && $product->is_purchasable() && $product->get_price() !== '' && (!$product->is_type('variation') || !in_array('', $product->get_variation_attributes(), true)));
    }
    private static function linked($id) {
        $dynamic = preg_match('/^woo-([1-9]\d*)$/', $id, $match);
        if ($dynamic) $pid = (int) $match[1];
        else {
            // Legacy mappings remain valid for previously saved designs and orders.
            $map = get_option('wings_charm_products', array());
            $reference = trim((string) ($map[$id] ?? ''));
            if ($reference === '') self::fail('اتصال چارم «' . $id . '» به محصول ووکامرس تنظیم نشده است.', 409);
            $pid = ctype_digit($reference) ? (int) $reference : wc_get_product_id_by_sku($reference);
        }
        $product = $pid ? wc_get_product($pid) : false;
        if (!$product || !$product->is_type(array('simple','variation'))) self::fail('اتصال چارم «' . $id . '» به محصول ووکامرس تنظیم نشده است.', 409);
        if ($dynamic && !self::is_store_charm($product)) self::fail('این محصول در دستهٔ چارم‌های فروشگاه نیست.', 409);
        $parent = $product->is_type('variation') ? wc_get_product($product->get_parent_id()) : $product;
        if (!$parent || $parent->get_status() !== 'publish' || $product->get_status() !== 'publish' || !$product->is_purchasable() || $product->get_price() === '') self::fail('یکی از چارم‌های طرح دیگر قابل سفارش نیست.', 409);
        if ($product->is_type('variation') && in_array('', $product->get_variation_attributes(), true)) self::fail('برای چارم، یک مدل با مشخصات ثابت در تنظیمات انتخاب کنید.', 409);
        return $product;
    }
    public static function prices() {
        $rows = array(); $terms = self::term_ids();
        if (!$terms) return array('charms' => array(), 'source' => 'woocommerce');
        $slugs = array(); foreach ($terms as $id) { $term = get_term($id, 'product_cat'); if ($term && !is_wp_error($term)) $slugs[] = $term->slug; }
        foreach (wc_get_products(array('status' => 'publish', 'limit' => -1, 'category' => $slugs, 'type' => array('simple','variable'))) as $parent) {
            if ($parent->is_type('variable')) {
                foreach ($parent->get_children() as $id) {
                    $product = wc_get_product($id);
                    if ($product && $product->get_status() === 'publish') $rows[] = self::entry($product);
                }
            } else $rows[] = self::entry($parent);
        }
        return array('charms' => $rows, 'source' => 'woocommerce');
    }
    public static function clean($raw, $base, $quantity) {
        if (!is_array($raw) || ($raw['version'] ?? null) !== 1 || !isset($raw['product']) || !is_array($raw['product']) || !self::eligible($base) || (int) ($raw['product']['id'] ?? 0) !== $base->get_id()) self::fail('این محصول قابلیت شخصی‌سازی ندارد.');
        $image = wp_get_attachment_image_url($base->get_image_id(), 'full') ?: '/images/product-placeholder.jpg';
        if (($raw['product']['image'] ?? '') !== $image) self::fail('تصویر محصول پایه تغییر کرده است؛ طرح را باز کنید و دوباره بررسی کنید.', 409);
        $placed = $raw['charms'] ?? null;
        if (!is_array($placed) || count($placed) < 1 || count($placed) > 30) self::fail('طرح باید بین یک تا سی چارم داشته باشد.');
        $rules = self::rules($base);
        if ($rules['single'] && count($placed) !== 1) self::fail('این محصول فقط یک چارم در جایگاه ثابت می‌پذیرد.');
        $known = array_column(self::catalogue(), null, 'id');
        $charms = array(); $components = array(); $instances = array(); $currency = get_woocommerce_currency();
        foreach ($placed as $item) {
            if (!is_array($item) || !isset($item['charm']) || !is_array($item['charm'])) self::fail('جزئیات طرح معتبر نیست.');
            $id = $item['charm']['id'] ?? ''; $instance = $item['instanceId'] ?? '';
            if (!is_string($id) || (!isset($known[$id]) && !preg_match('/^woo-[1-9]\d*$/', $id)) || !is_string($instance) || !preg_match('/^[a-zA-Z0-9-]{1,80}$/', $instance) || isset($instances[$instance])) self::fail('چارم یا شناسه تکراری طرح معتبر نیست.');
            foreach (array('x','y','rotation') as $field) {
                $value = $item[$field] ?? null;
                if ((!is_int($value) && !is_float($value)) || !is_finite((float) $value) || ($field === 'rotation' ? abs($value) > 3600 : $value < 0 || $value > 600)) self::fail('موقعیت چارم‌های طرح معتبر نیست.');
            }
            if ($rules['single']) {
                foreach ($rules['anchor'] as $field => $expected) {
                    if (abs($item[$field] - $expected) > 0.01) self::fail('جای اتصال چارم این محصول ثابت است؛ طرح را دوباره باز کنید.', 409);
                    $item[$field] = $expected;
                }
            }
            $instances[$instance] = true; $product = self::linked($id); $pid = $product->get_id();
            $definition = isset($known[$id]) ? $known[$id] : self::entry($product);
            if (!$definition['image']) self::fail('تصویر این چارم هنوز در فروشگاه ثبت نشده است.', 409);
            if (isset($item['charm']['image']) && $item['charm']['image'] !== $definition['image']) self::fail('تصویر یکی از چارم‌ها تغییر کرده است؛ طرح را باز کنید و دوباره بررسی کنید.', 409);
            if (!isset($components[$pid])) $components[$pid] = array('product' => $product, 'count' => 0, 'names' => array());
            $components[$pid]['count']++; $components[$pid]['names'][$id] = $definition['name'];
            $price = (float) $product->get_price();
            $charm = $definition; $charm['price'] = $currency === 'IRR' ? $price / 10 : $price; $charm['product_id'] = $pid;
            $charms[] = array('instanceId' => $instance, 'charm' => $charm, 'x' => $item['x'], 'y' => $item['y'], 'rotation' => $item['rotation']);
        }
        foreach ($components as $component) {
            $product = $component['product']; $count = $component['count'] * $quantity;
            if (!$product->is_in_stock() || !$product->has_enough_stock($count) || ($product->is_sold_individually() && $count > 1)) self::fail('موجودی چارم‌های این طرح برای تعداد انتخاب‌شده کافی نیست.', 409);
        }
        return array('snapshot' => array('version' => 1, 'id' => '', 'savedAt' => '', 'product' => array('id' => $base->get_id(), 'name' => $base->get_name(), 'image' => $image,
            'slug' => $base->get_slug(), 'category' => $rules['label'], 'categories' => $rules['categories'], 'price' => $currency === 'IRR' ? (float) $base->get_price() / 10 : (float) $base->get_price(), 'hasOptions' => $base->is_type('variable')), 'charms' => $charms), 'components' => $components);
    }
    public static function identity($design) {
        return hash('sha256', wp_json_encode(array($design['product']['id'], $design['variation_id'] ?? 0, $design['attributes'] ?? array(), $design['product']['image'], array_map(function($item) {return array($item['charm']['id'], $item['x'], $item['y'], $item['rotation']);}, $design['charms']))));
    }
    public static function cart_item($line) {
        $base = wc_get_product($line['id']); $product = wc_get_product($line['variation_id'] ?: $line['id']);
        $currency = get_woocommerce_currency(); $price = (float) $product->get_price();
        if (!empty($line['design'])) {
            foreach ($line['design']['charms'] as $charm) {
                try { $price += (float) self::linked($charm['charm']['id'])->get_price(); }
                catch (RuntimeException $error) { $price += (float) ($charm['charm']['price'] ?? 0) * ($currency === 'IRR' ? 10 : 1); }
            }
        }
        return array_merge($line, array('name' => $base->get_name(), 'image' => wp_get_attachment_image_url($base->get_image_id(), 'full') ?: '',
            'price' => $currency === 'IRR' ? $price / 10 : $price, 'attributes' => array_map('sanitize_title', $line['attributes'] ?? array()), 'variation_label' => $product->is_type('variation') ? wp_strip_all_tags(wc_get_formatted_variation($line['attributes'], true, false, true)) : ''));
    }
    public static function add_to_cart($line) {
        $data = array(); $clean = null;
        if (!empty($line['design'])) {
            $clean = self::clean($line['design'], wc_get_product($line['id']), $line['quantity']);
            $snapshot = $clean['snapshot']; $snapshot['id'] = self::identity($snapshot);
            $snapshot['variation_id'] = $line['variation_id']; $snapshot['attributes'] = $line['attributes']; $snapshot['id'] = self::identity($snapshot);
            $data = array('wings_design' => $snapshot);
        }
        if (!WC()->cart->add_to_cart($line['id'], $line['quantity'], $line['variation_id'], $line['attributes'], $data)) self::fail('افزودن محصول پایه طرح انجام نشد.', 409);
        if ($clean) foreach ($clean['components'] as $component) {
            $product = $component['product']; $vid = $product->is_type('variation') ? $product->get_id() : 0;
            $id = $vid ? $product->get_parent_id() : $product->get_id(); $attrs = $vid ? $product->get_variation_attributes() : array();
            if (!WC()->cart->add_to_cart($id, $line['quantity'] * $component['count'], $vid, $attrs, array('wings_design_component' => $snapshot['id'], 'wings_component_names' => implode('، ', $component['names'])))) self::fail('افزودن چارم‌های طرح به سفارش انجام نشد.', 409);
        }
    }
    public static function order_meta($item, $cart_key, $values, $order) {
        if (!empty($values['wings_design'])) {
            $snapshot = $values['wings_design'];
            $origin = defined('WINGS_STOREFRONT_URL') ? WINGS_STOREFRONT_URL : get_option('wings_storefront_url', '');
            if (!$origin && isset($_SERVER['HTTP_X_WINGS_STOREFRONT'])) $origin = $_SERVER['HTTP_X_WINGS_STOREFRONT'];
            $parts = wp_parse_url($origin);
            if (!$parts || !isset($parts['host']) || (!in_array($parts['scheme'] ?? '', array('https'), true) && !in_array($parts['host'], array('localhost','127.0.0.1'), true))) $origin = '';
            $snapshot['asset_origin'] = rtrim($origin, '/');
            $item->add_meta_data('_wings_design', wp_json_encode($snapshot), true);
            $item->add_meta_data('طرح شخصی', $snapshot['id'], true);
            $item->add_meta_data('چارم‌های طرح', implode('، ', array_map(function($charm){return $charm['charm']['name'];}, $snapshot['charms'])), true);
        }
        if (!empty($values['wings_design_component'])) {
            $item->add_meta_data('_wings_design_component', $values['wings_design_component'], true);
            $item->add_meta_data('چارم‌های طرح', $values['wings_component_names'], true);
        }
    }
    public static function admin_preview($item_id, $item, $product) {
        if (!is_admin()) return;
        $design = json_decode((string) $item->get_meta('_wings_design', true), true);
        if (!$design || ($design['version'] ?? null) !== 1) return;
        $origin = $design['asset_origin'] ?? '';
        $url = function($image) use ($origin) {return strpos($image, '/') === 0 ? $origin . $image : $image;};
        $anchors = array('clover'=>array(57,30),'pink-dress'=>array(51,32),'cocktail'=>array(47,33),'ice-cream'=>array(50,33),'travel'=>array(51,30),'tennis'=>array(51,23),'chocolate'=>array(43,41),'gold-dress'=>array(51,32),'shrimp'=>array(49,29),'fashion'=>array(52,30));
        echo '<div style="margin:16px 0"><strong>طرح دقیق مشتری (بوم ۶۰۰ × ۶۰۰)</strong><div style="position:relative;width:300px;max-width:100%;aspect-ratio:1;overflow:hidden;background:white;border:1px solid #eee;border-radius:12px">';
        echo '<img alt="محصول پایه طرح" src="' . esc_url($url($design['product']['image'])) . '" style="position:absolute;width:100%;height:100%;object-fit:contain">';
        foreach ($design['charms'] as $charm) {
            $anchor = isset($charm['charm']['attachment']) ? array($charm['charm']['attachment']['x'], $charm['charm']['attachment']['y']) : ($anchors[$charm['charm']['id']] ?? array(50,30));
            $style = 'position:absolute;width:49%;aspect-ratio:1;left:' . ((float)$charm['x']/6) . '%;top:' . ((float)$charm['y']/6) . '%;transform:translate(-'.$anchor[0].'%, -'.$anchor[1].'%) rotate('.(float)$charm['rotation'].'deg);transform-origin:'.$anchor[0].'% '.$anchor[1].'%;';
            echo '<img alt="' . esc_attr($charm['charm']['name']) . '" src="' . esc_url($url($charm['charm']['image'])) . '" style="' . esc_attr($style) . 'object-fit:contain">';
        }
        echo '</div><details><summary>جزئیات ساخت و چیدمان</summary><pre dir="ltr" style="white-space:pre-wrap">' . esc_html(wp_json_encode($design, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) . '</pre></details></div>';
    }
}
