<?php
/**
 * Plugin Name: Wings Commerce
 * Description: Private Next.js bridge for Melipayamak OTP, WooCommerce customer accounts and orders without online payment.
 * Version: 1.2.5
 * Requires PHP: 7.4
 * Requires Plugins: woocommerce
 */
defined('ABSPATH') || exit;
require_once __DIR__ . '/designs.php';

final class Wings_Commerce {
    const VERSION = '1.2.5';
    private static $uid = 0;
    private static $session_key = '';
    private static function setting($name) {
        return defined($name) ? constant($name) : get_option(strtolower($name), '');
    }
    public static function admin_menu() {
        add_submenu_page('woocommerce', 'اتصال وینگز', 'اتصال وینگز', 'manage_options', 'wings-commerce', array(__CLASS__, 'admin_page'));
    }
    public static function admin_page() {
        if (!current_user_can('manage_options')) return;
        $fields = array('WINGS_BRIDGE_SECRET' => 'کلید اتصال سایت (حداقل ۳۲ کاراکتر)',
            'WINGS_MELIPAYAMAK_OTP_KEY' => 'کلید اختصاصی OTP کنسول ملی‌پیامک (انتهای آدرس API)',
            'WINGS_MELIPAYAMAK_USERNAME' => 'نام کاربری ملی‌پیامک', 'WINGS_MELIPAYAMAK_PASSWORD' => 'رمز وب‌سرویس / کلید API ملی‌پیامک',
            'WINGS_MELIPAYAMAK_BODY_ID' => 'شناسه الگوی تأییدشده (bodyId)', 'WINGS_STOREFRONT_URL' => 'آدرس سایت وینگز برای نمایش تصویر طرح');
        $notice = '';
        if (isset($_POST['wings_save'])) {
            check_admin_referer('wings_settings');
            if (!defined('WINGS_SMS_PROVIDER')) {
                $provider = isset($_POST['WINGS_SMS_PROVIDER']) ? wp_unslash($_POST['WINGS_SMS_PROVIDER']) : 'pattern';
                if (is_string($provider) && in_array($provider, array('pattern', 'console'), true)) update_option('wings_sms_provider', $provider, false);
            }
            foreach ($fields as $name => $label) {
                if (defined($name)) continue;
                $raw = isset($_POST[$name]) && is_string($_POST[$name]) ? trim(wp_unslash($_POST[$name])) : '';
                if ($raw === '') continue; // Blank fields preserve saved credentials.
                if ($name === 'WINGS_BRIDGE_SECRET' && (strlen($raw) < 32 || strlen($raw) > 256)) { $notice = 'کلید اتصال باید بین ۳۲ تا ۲۵۶ کاراکتر باشد.'; break; }
                if ($name === 'WINGS_MELIPAYAMAK_BODY_ID' && !preg_match('/^[1-9]\d*$/', $raw)) { $notice = 'شناسه الگو باید یک عدد مثبت باشد.'; break; }
                if ($name === 'WINGS_MELIPAYAMAK_OTP_KEY' && !preg_match('/^[a-fA-F0-9]{32}$/', $raw)) { $notice = 'کلید OTP باید همان رشته ۳۲ کاراکتری انتهای آدرس کنسول باشد.'; break; }
                update_option(strtolower($name), $raw, false);
            }
            if (!$notice) $notice = 'تنظیمات ذخیره شد.';
        }
        if (isset($_POST['wings_design_save'])) {
            check_admin_referer('wings_design_settings');
            $mapping = array();
            foreach (Wings_Designs::catalogue() as $charm) {
                $value = $_POST['charm_products'][$charm['id']] ?? '';
                if (is_string($value)) $mapping[$charm['id']] = sanitize_text_field(wp_unslash($value));
            }
            update_option('wings_charm_products', $mapping, false); $notice = 'اتصال چارم‌ها ذخیره شد.';
        }
        echo '<div class="wrap" dir="rtl"><h1>اتصال وینگز به ووکامرس</h1>';
        if ($notice) echo '<div class="notice notice-info"><p>' . esc_html($notice) . '</p></div>';
        echo '<p>سفارش‌ها بدون پرداخت آنلاین و با وضعیت «در انتظار بررسی» ثبت می‌شوند. موجودی، تخفیف و روش ارسال از ووکامرس دریافت می‌شوند.</p>';
        echo '<p>آدرس API برای تنظیم سایت: <code dir="ltr">' . esc_html(rest_url('wings/v1')) . '</code></p>';
        echo '<form method="post">'; wp_nonce_field('wings_settings'); echo '<table class="form-table">';
        echo '<tr><th>روش ارسال پیامک</th><td>';
        if (defined('WINGS_SMS_PROVIDER')) echo '<p>در wp-config.php تنظیم شده است: ' . esc_html((string) self::setting('WINGS_SMS_PROVIDER')) . '</p>';
        else {
            echo '<select name="WINGS_SMS_PROVIDER">';
            foreach (array('pattern' => 'الگوی وب‌سرویس قدیمی', 'console' => 'OTP کنسول ملی‌پیامک') as $value => $label) {
                echo '<option value="' . esc_attr($value) . '"' . selected(self::setting('WINGS_SMS_PROVIDER') ?: 'pattern', $value, false) . '>' . esc_html($label) . '</option>';
            }
            echo '</select>';
        }
        echo '</td></tr>';
        foreach ($fields as $name => $label) {
            $configured = (string) self::setting($name) !== '';
            echo '<tr><th><label for="' . esc_attr($name) . '">' . esc_html($label) . '</label></th><td>';
            if (defined($name)) echo '<p>در wp-config.php تنظیم شده است.</p>';
            else {
                $type = in_array($name, array('WINGS_BRIDGE_SECRET', 'WINGS_MELIPAYAMAK_PASSWORD', 'WINGS_MELIPAYAMAK_OTP_KEY'), true) ? 'password' : 'text';
                echo '<input id="' . esc_attr($name) . '" name="' . esc_attr($name) . '" type="' . $type . '" value="" dir="ltr" class="regular-text" autocomplete="off">';
                echo '<p class="description">' . ($configured ? 'مقدار ذخیره شده است. برای حفظ آن، این فیلد را خالی بگذارید.' : 'هنوز تنظیم نشده است.') . '</p>';
            }
            echo '</td></tr>';
        }
        echo '</table>'; submit_button('ذخیره تنظیمات', 'primary', 'wings_save'); echo '</form>';
        echo '<p>در روش OTP کنسول فقط کلید اختصاصی OTP لازم است؛ نام کاربری، رمز و bodyId استفاده نمی‌شوند. در روش قدیمی، الگوی ملی‌پیامک باید دقیقاً یک متغیر برای کد ورود داشته باشد. افزونه جداگانه‌ای برای پیامک لازم نیست.</p>';
        echo '<h2>اتصال طرح‌های قدیمی به محصولات ووکامرس</h2><p>چارم‌های جدید مستقیماً از دستهٔ چارم و زیر‌دسته‌های آن خوانده می‌شوند و اتصال دستی لازم ندارند. این بخش فقط برای طرح‌های قدیمی با چارم‌های ثابت است.</p><form method="post">';
        wp_nonce_field('wings_design_settings'); $mapping = get_option('wings_charm_products', array());
        echo '<table class="form-table">';
        foreach (Wings_Designs::catalogue() as $charm) echo '<tr><th>' . esc_html($charm['name'] . ' (' . $charm['id'] . ')') . '</th><td><input dir="ltr" name="charm_products[' . esc_attr($charm['id']) . ']" value="' . esc_attr($mapping[$charm['id']] ?? '') . '" class="regular-text" placeholder="Product ID / SKU"></td></tr>';
        echo '</table>'; submit_button('ذخیره اتصال چارم‌ها', 'primary', 'wings_design_save'); echo '</form></div>';

    }
    public static function table() { global $wpdb; return $wpdb->prefix . 'wings_tokens'; }
    public static function install() {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $table = self::table();
        $collate = $wpdb->get_charset_collate();
        dbDelta("CREATE TABLE $table (
            token_key varchar(64) NOT NULL,
            payload longtext NOT NULL,
            hits int unsigned NOT NULL DEFAULT 0,
            expires bigint unsigned NOT NULL,
            PRIMARY KEY  (token_key),
            KEY expires (expires)
        ) $collate;");
        if (!wp_next_scheduled('wings_cleanup')) wp_schedule_event(time(), 'hourly', 'wings_cleanup');
        update_option('wings_schema', self::VERSION, false);
    }
    public static function cleanup() {
        global $wpdb;
        $wpdb->query($wpdb->prepare('DELETE FROM ' . self::table() . ' WHERE expires < %d', time()));
    }
    private static function error($message, $status = 400) {
        throw new RuntimeException($message, $status);
    }
    private static function key($value) { return hash('sha256', $value); }
    private static function put($key, $payload, $ttl, $exclusive = false) {
        global $wpdb;
        $row = array('token_key' => $key, 'payload' => wp_json_encode($payload), 'hits' => 0, 'expires' => time() + $ttl);
        $result = $exclusive ? $wpdb->insert(self::table(), $row) : $wpdb->replace(self::table(), $row);
        if ($result === false && !$exclusive) self::error('ذخیره اطلاعات فروشگاه انجام نشد.', 503);
        return $result !== false;
    }
    private static function get($key) {
        global $wpdb;
        $row = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . self::table() . ' WHERE token_key = %s AND expires > %d', $key, time()), ARRAY_A);
        return $row ? array('data' => json_decode($row['payload'], true), 'hits' => (int) $row['hits']) : null;
    }
    private static function remove($key) { global $wpdb; return $wpdb->delete(self::table(), array('token_key' => $key)); }
    private static function lock($name, $callback) {
        global $wpdb;
        $key = self::key('lock:' . $name);
        $wpdb->query($wpdb->prepare('DELETE FROM ' . self::table() . ' WHERE token_key = %s AND expires <= %d', $key, time()));
        if (!self::put($key, array(), 300, true)) self::error('درخواست دیگری در حال انجام است؛ چند لحظه بعد تلاش کنید.', 409);
        try { return $callback(); } finally { self::remove($key); }
    }
    private static function limit($name, $max, $period) {
        global $wpdb;
        $key = self::key('rate:' . $name . ':' . floor(time() / $period));
        $table = self::table();
        $ok = $wpdb->query($wpdb->prepare("INSERT INTO $table (token_key, payload, hits, expires) VALUES (%s, '{}', 1, %d) ON DUPLICATE KEY UPDATE hits = hits + 1", $key, time() + $period * 2));
        if ($ok === false) self::error('سرویس ورود موقتاً در دسترس نیست.', 503);
        $hits = (int) $wpdb->get_var($wpdb->prepare("SELECT hits FROM $table WHERE token_key = %s", $key));
        if ($hits > $max) self::error('تعداد درخواست‌ها زیاد است؛ کمی بعد تلاش کنید.', 429);
    }
    public static function permission($request) {
        self::$uid = 0; self::$session_key = '';
        $secret = (string) self::setting('WINGS_BRIDGE_SECRET');
        if (strlen($secret) < 32 || !hash_equals($secret, (string) $request->get_header('X-Wings-Key'))) {
            return new WP_Error('wings_forbidden', 'دسترسی غیرمجاز است.', array('status' => 403));
        }
        if (!is_ssl() && wp_get_environment_type() !== 'local') {
            return new WP_Error('wings_https', 'اتصال HTTPS لازم است.', array('status' => 503));
        }
        if (!class_exists('WooCommerce')) return new WP_Error('wings_woo', 'ووکامرس فعال نیست.', array('status' => 503));
        if (get_option('wings_schema') !== self::VERSION) self::install();
        $path = $request->get_route();
        if (preg_match('#/auth/(request|verify)$#', $path) || preg_match('#/products/\d+/variations$#', $path) || preg_match('#/designs/(prepare|catalogue)$#', $path) || substr($path, -10) === '/locations') return true;
        $token = (string) $request->get_header('X-Wings-Session');
        if (!preg_match('/^[a-f0-9]{64}$/', $token)) return new WP_Error('wings_auth', 'برای ادامه وارد حساب خود شوید.', array('status' => 401));
        self::$session_key = self::key('session:' . $token);
        $session = self::get(self::$session_key);
        $user = $session ? get_userdata((int) $session['data']['uid']) : false;
        // SMS login never grants access to staff or privileged WordPress accounts.
        if (!$user || !in_array('customer', $user->roles, true) || user_can($user, 'edit_posts') || user_can($user, 'manage_woocommerce')) {
            return new WP_Error('wings_expired', 'نشست شما منقضی شده است؛ دوباره وارد شوید.', array('status' => 401));
        }
        self::$uid = $user->ID;
        wp_set_current_user(self::$uid);
        return true;
    }
    public static function routes() {
        $routes = array(
            '/auth/request' => 'POST', '/auth/verify' => 'POST', '/auth/logout' => 'POST',
            '/me' => 'GET,PATCH', '/addresses' => 'GET,POST', '/addresses/(?P<id>[a-f0-9-]{36})' => 'PATCH,DELETE',
            '/cart' => 'GET,PUT', '/orders' => 'GET', '/orders/(?P<id>\d+)' => 'GET',
            '/orders/(?P<id>\d+)/cancel' => 'POST', '/checkout/quote' => 'POST', '/checkout/order' => 'POST',
            '/locations' => 'GET', '/products/(?P<id>\d+)/variations' => 'GET',
            '/checkout/requests/(?P<request_id>[a-f0-9-]{36})' => 'GET',
            '/designs/prepare' => 'POST', '/designs/catalogue' => 'GET',
        );
        foreach ($routes as $route => $methods) register_rest_route('wings/v1', $route, array(
            'methods' => $methods, 'permission_callback' => array(__CLASS__, 'permission'), 'callback' => array(__CLASS__, 'dispatch'),
        ));
    }
    public static function dispatch($request) {
        try {
            $path = preg_replace('#^/wings/v1/#', '', $request->get_route());
            $body = $request->get_json_params();
            $body = is_array($body) ? $body : array();
            switch ($path) {
                case 'auth/request': $result = self::request_otp($body, $request); break;
                case 'auth/verify': $result = self::verify_otp($body, $request); break;
                case 'auth/logout': self::remove(self::$session_key); $result = array('success' => true); break;
                case 'me': $result = self::profile($body, $request->get_method()); break;
                case 'addresses': $result = self::addresses($body, $request->get_method()); break;
                case 'cart': $result = self::cart_data($body, $request->get_method()); break;
                case 'orders': $result = self::orders($request); break;
                case 'locations': $result = array('states' => WC()->countries->get_states('IR')); break;
                case 'designs/catalogue': $result = Wings_Designs::prices(); break;
                case 'designs/prepare':
                    self::limit('design-prepare:' . self::client($request), 60, 60);
                    $lines = self::clean_items(array($body));
                    if (empty($lines[0]['design'])) self::error('طرح شخصی برای خرید ارسال نشده است.');
                    $result = array('item' => Wings_Designs::cart_item($lines[0])); break;
                case 'checkout/quote': $result = self::lock('customer:' . self::$uid, function() use ($body) { return self::quote($body); }); break;
                case 'checkout/order': $result = self::lock('customer:' . self::$uid, function() use ($body) { return self::place_order($body); }); break;
                default:
                    if (preg_match('#^addresses/([a-f0-9-]{36})$#', $path, $match)) $result = self::addresses($body, $request->get_method(), $match[1]);
                    elseif (preg_match('#^checkout/requests/([a-f0-9-]{36})$#', $path, $match)) {
                        $record = self::get(self::key('order:' . self::$uid . ':' . $match[1]));
                        $order = $record && !empty($record['data']['order_id']) ? self::owned_order($record['data']['order_id']) : null;
                        $ready = $order && (!$order->has_status('pending') || ($record['data']['phase'] ?? '') === 'complete');
                        $result = array('pending' => (bool) $record, 'order' => $ready ? self::order_data($order) : null);
                    }
                    elseif (preg_match('#^products/(\d+)/variations$#', $path, $match)) $result = self::variations((int) $match[1]);
                    elseif (preg_match('#^orders/(\d+)(/cancel)?$#', $path, $match)) $result = self::single_order((int) $match[1], !empty($match[2]));
                    else self::error('مسیر پیدا نشد.', 404);
            }
            $response = new WP_REST_Response($result);
            $response->header('Cache-Control', 'private, no-store, max-age=0');
            return $response;
        } catch (Throwable $error) {
            $status = $error instanceof RuntimeException ? (int) $error->getCode() : 500;
            if ($status < 400 || $status > 599) $status = 500;
            return new WP_Error('wings_request', $status === 500 ? 'درخواست فروشگاه انجام نشد؛ دوباره تلاش کنید.' : $error->getMessage(), array('status' => $status));
        }
    }
    private static function text($value, $length = 200) {
        if (!is_string($value)) return '';
        return function_exists('mb_substr') ? mb_substr(sanitize_text_field($value), 0, $length) : substr(sanitize_text_field($value), 0, $length);
    }
    private static function phone($value) {
        $phone = strtr((string) $value, array('۰'=>'0','۱'=>'1','۲'=>'2','۳'=>'3','۴'=>'4','۵'=>'5','۶'=>'6','۷'=>'7','۸'=>'8','۹'=>'9','٠'=>'0','١'=>'1','٢'=>'2','٣'=>'3','٤'=>'4','٥'=>'5','٦'=>'6','٧'=>'7','٨'=>'8','٩'=>'9'));
        $phone = preg_replace('/[\s()\-]/', '', $phone);
        $phone = preg_replace('/^(?:\+98|0098|98)(?=9)/', '0', $phone);
        if (!preg_match('/^09\d{9}$/', $phone)) self::error('شماره موبایل معتبر وارد کنید.');
        return $phone;
    }
    private static function client($request) {
        $value = (string) $request->get_header('X-Wings-Client');
        return preg_match('/^[a-f0-9]{64}$/', $value) ? $value : 'unknown';
    }
    private static function request_otp($body, $request) {
        $phone = self::phone($body['phone'] ?? '');
        self::limit('sms-client:' . self::client($request), 20, HOUR_IN_SECONDS);
        self::limit('sms-phone:' . $phone, 5, HOUR_IN_SECONDS);
        self::limit('sms-site', defined('WINGS_SMS_HOURLY_LIMIT') ? max(1, (int) WINGS_SMS_HOURLY_LIMIT) : 100, HOUR_IN_SECONDS);
        return self::lock('sms:' . $phone, function() use ($phone) {
            $cooldown = self::key('cooldown:' . $phone);
            if (self::get($cooldown)) self::error('برای دریافت کد جدید، یک دقیقه صبر کنید.', 429);
            $challenge = bin2hex(random_bytes(32));
            $provider = (string) (self::setting('WINGS_SMS_PROVIDER') ?: 'pattern');
            if ($provider === 'console') $code = self::send_console_otp($phone);
            elseif ($provider === 'pattern') {
                $code = (string) random_int(1000, 9999);
                self::send_sms($phone, $code);
            } else self::error('روش ارسال پیامک معتبر نیست.', 503);
            self::put(self::key('otp:' . $challenge), array('phone' => $phone, 'hash' => wp_hash($challenge . ':' . $code), 'code_length' => strlen($code)), 300);
            self::put($cooldown, array(), 60);
            return array('challenge' => $challenge, 'retry_after' => 60, 'code_length' => strlen($code));
        });
    }
    private static function send_console_otp($phone) {
        $key = (string) self::setting('WINGS_MELIPAYAMAK_OTP_KEY');
        if (!preg_match('/^[a-fA-F0-9]{32}$/', $key)) self::error('کلید OTP کنسول ملی‌پیامک هنوز تنظیم نشده است.', 503);
        // Fixed provider host; never accept an arbitrary URL or disable TLS verification.
        $response = wp_remote_post('https://console.melipayamak.com/api/send/otp/' . $key, array(
            'timeout' => 20, 'redirection' => 0, 'sslverify' => true,
            'headers' => array('Content-Type' => 'application/json', 'Accept' => 'application/json'),
            'body' => wp_json_encode(array('to' => $phone)),
        ));
        if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) self::error('ارسال پیامک انجام نشد؛ کمی بعد دوباره تلاش کنید.', 502);
        $data = json_decode(wp_remote_retrieve_body($response), true);
        // Accept the observed successful Console status, while rejecting error descriptions.
        if (!is_array($data) || !array_key_exists('code', $data) ||
            (!is_string($data['code']) && !is_int($data['code'])) ||
            !preg_match('/^[0-9]{4,10}$/D', (string) $data['code']) ||
            (isset($data['status']) && $data['status'] !== '' && $data['status'] !== false &&
                (!is_string($data['status']) || trim($data['status']) !== 'عملیات موفق'))) {
            self::error('ارسال پیامک انجام نشد؛ تنظیمات OTP کنسول باید بررسی شود.', 502);
        }
        return (string) $data['code'];
    }
    private static function send_sms($phone, $code) {
        $username = (string) self::setting('WINGS_MELIPAYAMAK_USERNAME');
        $password = (string) self::setting('WINGS_MELIPAYAMAK_PASSWORD');
        $body_id = (int) self::setting('WINGS_MELIPAYAMAK_BODY_ID');
        if (!$username || !$password || $body_id < 1) {
            self::error('سرویس پیامک فروشگاه هنوز تنظیم نشده است.', 503);
        }
        // Official provider REST pattern endpoint. TLS verification remains enabled.
        $response = wp_remote_post('https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber', array(
            'timeout' => 20, 'redirection' => 0,
            'body' => array('username' => $username, 'password' => $password,
                'text' => $code, 'to' => $phone, 'bodyId' => $body_id),
        ));
        if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) self::error('ارسال پیامک انجام نشد؛ کمی بعد دوباره تلاش کنید.', 502);
        $data = json_decode(wp_remote_retrieve_body($response), true);
        // Success must include a real receipt ID, not a positive provider error code.
        if (!is_array($data) || (int) ($data['RetStatus'] ?? 0) !== 1 || !isset($data['Value']) || !ctype_digit((string) $data['Value']) || (float) $data['Value'] < 1000) {
            self::error('ارسال پیامک انجام نشد؛ تنظیمات پیامک فروشگاه باید بررسی شود.', 502);
        }
    }
    private static function verify_otp($body, $request) {
        global $wpdb;
        self::limit('verify-client:' . self::client($request), 60, HOUR_IN_SECONDS);
        $challenge = $body['challenge'] ?? '';
        $code = $body['code'] ?? '';
        if (!is_string($challenge) || !preg_match('/^[a-f0-9]{64}$/', $challenge) || !is_string($code) || !preg_match('/^[0-9]{4,10}$/D', $code)) self::error('کد ورود معتبر نیست.');
        $key = self::key('otp:' . $challenge);
        return self::lock('otp:' . $key, function() use ($key, $challenge, $code, $wpdb) {
            $row = self::get($key);
            if (!$row || $row['hits'] >= 5) self::error('کد منقضی شده است؛ کد جدید بگیرید.', 401);
            if (isset($row['data']['code_length']) && strlen($code) !== $row['data']['code_length']) self::error('تعداد ارقام کد ورود معتبر نیست.', 400);
            $wpdb->query($wpdb->prepare('UPDATE ' . self::table() . ' SET hits = hits + 1 WHERE token_key = %s', $key));
            if (!hash_equals($row['data']['hash'], wp_hash($challenge . ':' . $code))) self::error('کد ورود اشتباه است.', 401);
            $phone = $row['data']['phone'];
            $uid = self::lock('phone:' . $phone, function() use ($phone) { return self::customer_for_phone($phone); });
            self::remove($key);
            $token = bin2hex(random_bytes(32));
            self::put(self::key('session:' . $token), array('uid' => $uid), 7 * DAY_IN_SECONDS);
            self::$uid = $uid;
            return array('token' => $token, 'customer' => self::customer());
        });
    }
    private static function customer_for_phone($phone) {
        // A verified binding is authoritative. Legacy billing phones are deliberately not trusted:
        // an editable shipping/billing recipient number must never become an account login credential.
        $users = get_users(array('meta_key' => '_wings_verified_phone', 'meta_value' => $phone, 'number' => 2));
        if (count($users) > 1) self::error('اتصال حساب نیاز به بررسی پشتیبانی دارد.', 409);
        $user = $users ? $users[0] : false;
        if (!$user) {
            $login = 'wings_' . $phone;
            if (username_exists($login)) self::error('اتصال حساب نیاز به بررسی پشتیبانی دارد.', 409);
            $uid = wp_insert_user(array('user_login' => $login, 'user_pass' => wp_generate_password(48, true, true), 'role' => 'customer', 'display_name' => 'کاربر وینگز'));
            if (is_wp_error($uid)) self::error('ساخت حساب انجام نشد؛ با پشتیبانی تماس بگیرید.', 409);
            update_user_meta($uid, '_wings_verified_phone', $phone);
            update_user_meta($uid, 'billing_phone', $phone);
            do_action('woocommerce_created_customer', $uid, array('role' => 'customer'), true);
            $user = get_userdata($uid);
        }
        if (!$user || !in_array('customer', $user->roles, true) || user_can($user, 'edit_posts') || user_can($user, 'manage_woocommerce')) self::error('این حساب برای ورود پیامکی مشتریان قابل استفاده نیست.', 403);
        return $user->ID;
    }
    private static function customer() {
        $customer = new WC_Customer(self::$uid);
        return array('id' => self::$uid, 'phone' => (string) get_user_meta(self::$uid, '_wings_verified_phone', true),
            'first_name' => $customer->get_first_name(), 'last_name' => $customer->get_last_name(), 'email' => $customer->get_email());
    }
    private static function profile($body, $method) {
        if ($method === 'PATCH') {
            $customer = new WC_Customer(self::$uid);
            $first = self::text($body['first_name'] ?? '', 80); $last = self::text($body['last_name'] ?? '', 80);
            if (!$first || !$last) self::error('نام و نام خانوادگی را وارد کنید.');
            // Never link an existing WordPress account by an unverified contact email.
            $email = sanitize_email($body['email'] ?? '');
            if (!$email || !is_email($email)) self::error('ایمیل معتبر وارد کنید.');
            $owner = email_exists($email);
            if ($owner && (int) $owner !== self::$uid) self::error('این ایمیل متعلق به حساب دیگری است.', 409);
            $customer->set_first_name($first); $customer->set_last_name($last); $customer->set_email($email);
            $customer->set_billing_email($email); $customer->set_display_name($first . ' ' . $last); $customer->save();
        }
        return array('customer' => self::customer());
    }
    private static function address_list() {
        $list = get_user_meta(self::$uid, '_wings_addresses', true);
        return is_array($list) ? array_values($list) : array();
    }
    private static function clean_address($body) {
        $result = array();
        foreach (array('label','first_name','last_name','state','city','address_1','address_2','postcode') as $field) $result[$field] = self::text($body[$field] ?? '', $field === 'address_1' ? 400 : 100);
        $result['phone'] = self::phone($body['phone'] ?? ''); $result['country'] = 'IR';
        foreach (array('label','first_name','last_name','state','city','address_1') as $field) if (!$result[$field]) self::error('همه فیلدهای ضروری آدرس را تکمیل کنید.');
        $states = WC()->countries->get_states('IR');
        if (!isset($states[$result['state']])) self::error('استان انتخاب‌شده معتبر نیست.');
        if (!preg_match('/^\d{10}$/', $result['postcode'])) self::error('کد پستی باید ده رقم باشد.');
        return $result;
    }
    private static function addresses($body, $method, $id = '') {
        if ($method === 'GET') return array('addresses' => self::address_list());
        return self::lock('customer:' . self::$uid, function() use ($body, $method, $id) {
            $list = self::address_list();
            if ($method === 'POST') {
                if (count($list) >= 10) self::error('حداکثر ده آدرس می‌توانید ذخیره کنید.');
                $address = self::clean_address($body); $address['id'] = wp_generate_uuid4(); $list[] = $address;
            } else {
                $found = false;
                foreach ($list as $index => $item) if ($item['id'] === $id) {
                    $found = true;
                    if ($method === 'DELETE') unset($list[$index]);
                    else { $address = self::clean_address($body); $address['id'] = $id; $list[$index] = $address; }
                    break;
                }
                if (!$found) self::error('آدرس پیدا نشد.', 404);
            }
            update_user_meta(self::$uid, '_wings_addresses', array_values($list));
            return array('addresses' => array_values($list));
        });
    }
    private static function clean_items($items) {
        if (!is_array($items) || count($items) > 50) self::error('سبد خرید معتبر نیست.');
        $result = array();
        foreach ($items as $item) {
            if (!is_array($item) || !isset($item['id'], $item['quantity']) || !is_int($item['id']) || !is_int($item['quantity']) ||
                $item['id'] < 1 || $item['quantity'] < 1 || $item['quantity'] > 99 ||
                (isset($item['variation_id']) && (!is_int($item['variation_id']) || $item['variation_id'] < 0))) self::error('تعداد یا محصول سبد خرید معتبر نیست.');
            $vid = $item['variation_id'] ?? 0;
            $parent = wc_get_product($item['id']);
            if (!$parent || $parent->get_status() !== 'publish' || !$parent->is_type(array('simple', 'variable'))) self::error('یکی از محصولات دیگر قابل سفارش نیست.', 409);
            $product = $vid ? wc_get_product($vid) : $parent;
            if (!$product || ($vid && (!$product->is_type('variation') || $product->get_parent_id() !== $parent->get_id() || $product->get_status() !== 'publish')) ||
                (!$vid && $parent->is_type('variable'))) self::error('مدل محصول را انتخاب کنید.');
            if (!$product->is_purchasable() || !$product->is_in_stock() || !$product->has_enough_stock($item['quantity'])) self::error('موجودی یکی از محصولات برای این تعداد کافی نیست.', 409);
            if ($product->is_sold_individually() && $item['quantity'] > 1) self::error('این محصول فقط به تعداد یک عدد قابل سفارش است.');
            $attributes = array();
            if ($vid) {
                $posted = $item['attributes'] ?? array();
                if (!is_array($posted) || count($posted) > 10) self::error('مشخصات انتخاب‌شده معتبر نیست.');
                $fixed = $product->get_variation_attributes();
                foreach ($parent->get_variation_attributes() as $name => $options) {
                    $attribute = wc_variation_attribute_name($name);
                    $chosen = $posted[$attribute] ?? ($fixed[$attribute] ?? '');
                    if (!is_string($chosen) || $chosen === '' || strlen($chosen) > 150) self::error('همه مشخصات مدل را انتخاب کنید.');
                    $canonical = null;
                    foreach ($options as $option) if (sanitize_title($option) === sanitize_title($chosen)) { $canonical = $option; break; }
                    if ($canonical === null || (!empty($fixed[$attribute]) && sanitize_title($fixed[$attribute]) !== sanitize_title($canonical))) self::error('مشخصات با مدل محصول مطابقت ندارد.');
                    $attributes[$attribute] = $canonical;
                }
                foreach ($posted as $attribute => $value) if (!isset($attributes[$attribute])) self::error('مشخصات اضافی محصول معتبر نیست.');
                ksort($attributes);
            }
            $key = $item['id'] . ':' . $vid . ':' . wp_json_encode($attributes);
            $design = null;
            if (isset($item['design'])) {
                $clean = Wings_Designs::clean($item['design'], $parent, $item['quantity']);
                $design = $clean['snapshot']; $design['variation_id'] = $vid; $design['attributes'] = $attributes;
                $design['id'] = Wings_Designs::identity($design); $key .= ':' . $design['id'];
            }
            if (isset($result[$key])) self::error('محصول تکراری در سبد خرید وجود دارد.');
            $result[$key] = array('id' => $item['id'], 'variation_id' => $vid, 'quantity' => $item['quantity'], 'attributes' => $attributes);
            if ($design) $result[$key]['design'] = $design;
        }
        return array_values($result);
    }
    private static function cart_data($body, $method) {
        if ($method === 'PUT') {
            $items = self::clean_items($body['items'] ?? null);
            self::lock('customer:' . self::$uid, function() use ($items) { update_user_meta(self::$uid, '_wings_cart', $items); });
        } else { $items = get_user_meta(self::$uid, '_wings_cart', true); $items = is_array($items) ? $items : array(); }
        $result = array(); $currency = get_woocommerce_currency();
        foreach ($items as $item) {
            $product = wc_get_product($item['variation_id'] ?: $item['id']);
            $parent = wc_get_product($item['id']);
            if (!$product || !$parent || $parent->get_status() !== 'publish') continue;
            if (!empty($item['design'])) { $result[] = Wings_Designs::cart_item($item); continue; }
            $price = (float) $product->get_price();
            $result[] = array_merge($item, array('name' => $parent->get_name(), 'image' => wp_get_attachment_image_url($product->get_image_id() ?: $parent->get_image_id(), 'woocommerce_thumbnail') ?: '',
                'price' => $currency === 'IRR' ? $price / 10 : $price, 'attributes' => array_map('sanitize_title', $item['attributes'] ?? array()),
                'variation_label' => $product->is_type('variation') ? wp_strip_all_tags(wc_get_formatted_variation($item['attributes'] ?? $product, true, false, true)) : ''));
        }
        return array('items' => $result);
    }
    private static function variations($id) {
        $product = wc_get_product($id);
        if (!$product || $product->get_status() !== 'publish' || !$product->is_type('variable')) self::error('محصول دارای مدل پیدا نشد.', 404);
        $result = array(); $attributes = array();
        foreach ($product->get_variation_attributes() as $name => $options) {
            $values = array();
            foreach ($options as $option) {
                $term = taxonomy_exists($name) ? get_term_by('slug', $option, $name) : false;
                $values[] = array('value' => sanitize_title($option), 'label' => $term ? $term->name : $option);
            }
            $attributes[] = array('key' => wc_variation_attribute_name($name), 'name' => wc_attribute_label($name, $product), 'options' => $values);
        }
        foreach ($product->get_children() as $vid) {
            $variation = wc_get_product($vid);
            if (!$variation || $variation->get_status() !== 'publish') continue;
            $result[] = array('id' => $vid, 'label' => wp_strip_all_tags(wc_get_formatted_variation($variation, true, false, true)),
                'price' => $variation->get_price(), 'currency' => get_woocommerce_currency(), 'in_stock' => $variation->is_in_stock(), 'purchasable' => $variation->is_purchasable(),
                'attributes' => array_map('sanitize_title', $variation->get_variation_attributes()));
        }
        return array('variations' => $result, 'attributes' => $attributes);
    }
    private static function cart_for_checkout($input) {
        $items = self::clean_items($input['items'] ?? null);
        if (!$items) self::error('سبد خرید خالی است.');
        $address = null;
        foreach (self::address_list() as $item) if ($item['id'] === ($input['address_id'] ?? '')) $address = $item;
        if (!$address) self::error('یک آدرس معتبر برای ارسال انتخاب کنید.');
        $address = array_merge($address, self::clean_address($address));
        $profile = self::customer();
        if (!$profile['email'] || !is_email($profile['email'])) self::error('ابتدا ایمیل خود را در بخش اطلاعات حساب تکمیل کنید.');
        wc_maybe_define_constant('WOOCOMMERCE_CHECKOUT', true);
        wc_load_cart();
        if ((string) WC()->session->get_customer_id() !== (string) self::$uid && is_callable(array(WC()->session, 'init_session_cookie'))) WC()->session->init_session_cookie();
        if ((string) WC()->session->get_customer_id() !== (string) self::$uid) self::error('نشست خرید فروشگاه تنظیم نشده است.', 503);
        wc_clear_notices();
        // WooCommerce lazily restores its saved cart on the first get_cart().
        // Finish that restoration before clearing it; otherwise add_to_cart()
        // can restore old items after the clear and include them in this quote.
        WC()->cart->get_cart();
        WC()->cart->empty_cart(false);
        // WC()->cart may already have been initialized before the bridge authenticated the customer.
        WC()->session->set_customer_session_cookie(true);
        WC()->session->set('order_awaiting_payment', null);
        WC()->customer = new WC_Customer(self::$uid, true);
        foreach (array('first_name','last_name','country','state','city','address_1','address_2','postcode') as $field) {
            WC()->customer->{'set_billing_' . $field}($address[$field]);
            WC()->customer->{'set_shipping_' . $field}($address[$field]);
        }
        WC()->customer->set_billing_phone($address['phone']); WC()->customer->set_billing_email($profile['email']);
        if (is_callable(array(WC()->customer, 'set_shipping_phone'))) WC()->customer->set_shipping_phone($address['phone']);
        WC()->customer->set_calculated_shipping(true);
        $selected = $input['shipping_methods'] ?? array();
        if (!is_array($selected) || count($selected) > 10) self::error('روش ارسال معتبر نیست.');
        foreach ($selected as $rate) if (!is_string($rate) || strlen($rate) > 150) self::error('روش ارسال معتبر نیست.');
        WC()->session->set('chosen_shipping_methods', $selected);
        // Adding items and applying coupons trigger totals calculation in WooCommerce.
        // Install the requested shipping selection before those hooks run.
        $coupon = self::text($input['coupon'] ?? '', 100);
        // Build the whole cart before calculating it. WooCommerce normally
        // recalculates after every addition/coupon, which can repeatedly run
        // price and fee extensions on a partially assembled custom design.
        $calculate = array(WC()->cart, 'calculate_totals');
        remove_action('woocommerce_add_to_cart', $calculate, 20);
        remove_action('woocommerce_applied_coupon', $calculate, 20);
        try {
            foreach ($items as $item) Wings_Designs::add_to_cart($item);
            if ($coupon && !WC()->cart->apply_coupon($coupon)) self::error('کد تخفیف معتبر نیست یا برای این سبد قابل استفاده نیست.');
        } finally {
            add_action('woocommerce_add_to_cart', $calculate, 20, 0);
            add_action('woocommerce_applied_coupon', $calculate, 20, 0);
        }
        // Resolve defaults once, then calculate with that explicit selection, as
        // the later order request does. Shipping-dependent fee hooks need this.
        WC()->cart->calculate_shipping();
        WC()->cart->calculate_totals();
        $shipping = array();
        if (WC()->cart->needs_shipping()) {
            foreach (WC()->shipping()->get_packages() as $index => $package) {
                $rates = array();
                foreach ($package['rates'] ?? array() as $rate) $rates[] = array('id' => $rate->get_id(), 'label' => $rate->get_label(), 'cost' => wc_format_decimal($rate->get_cost(), wc_get_price_decimals()));
                if (!$rates) self::error('برای این آدرس روش ارسال فعالی تعریف نشده است؛ با پشتیبانی تماس بگیرید.');
                $chosen = WC()->session->get('chosen_shipping_methods', array());
                if (isset($selected[$index]) && !isset($package['rates'][$selected[$index]])) self::error('روش ارسال تغییر کرده است؛ دوباره محاسبه کنید.', 409);
                $shipping[] = array('package' => $index, 'name' => 'بسته ' . ($index + 1), 'rates' => $rates, 'selected' => $chosen[$index] ?? $rates[0]['id']);
            }
        }
        WC()->cart->check_cart_items();
        if (wc_notice_count('error')) {
            $notices = wc_get_notices('error');
            self::error(wp_strip_all_tags($notices[0]['notice'] ?? 'سبد خرید نیاز به بررسی دارد.'), 409);
        }
        $cart = WC()->cart;
        $totals = array('currency' => get_woocommerce_currency(), 'subtotal' => wc_format_decimal($cart->get_subtotal(), wc_get_price_decimals()),
            'discount' => wc_format_decimal($cart->get_discount_total(), wc_get_price_decimals()), 'shipping_total' => wc_format_decimal($cart->get_shipping_total(), wc_get_price_decimals()),
            'tax' => wc_format_decimal($cart->get_total_tax(), wc_get_price_decimals()), 'total' => $cart->get_total('edit'), 'shipping' => $shipping, 'items' => array());
        foreach ($cart->get_cart() as $line) $totals['items'][] = array('name' => $line['data']->get_name(), 'quantity' => $line['quantity'], 'total' => wc_format_decimal($line['line_total'], wc_get_price_decimals()));
        $input = array('items' => $items, 'address_id' => $address['id'], 'coupon' => $coupon,
            'shipping_methods' => array_column($shipping, 'selected'), 'note' => self::text($input['note'] ?? '', 1000));
        return array('totals' => $totals, 'input' => $input, 'address' => $address, 'email' => $profile['email']);
    }
    private static function checkout_terms($data) {
        // Compare the purchased items and selected delivery terms, rather than
        // presentation fields or the order of other available shipping rates.
        $totals = $data['totals']; $shipping = array();
        foreach ($totals['shipping'] as $package) {
            $cost = null;
            foreach ($package['rates'] as $rate) if ($rate['id'] === $package['selected']) $cost = wc_format_decimal($rate['cost'], wc_get_price_decimals());
            $shipping[] = array('package' => $package['package'], 'selected' => $package['selected'], 'cost' => $cost);
        }
        $amounts = array('currency' => $totals['currency']);
        foreach (array('subtotal','discount','shipping_total','tax','total') as $field) $amounts[$field] = wc_format_decimal($totals[$field], wc_get_price_decimals());
        $value = array('amounts' => $amounts, 'shipping' => $shipping, 'address' => $data['address'], 'email' => $data['email'], 'items' => $data['input']['items']);
        $canonical = function($item) use (&$canonical) {
            if (!is_array($item)) return $item;
            if ($item && array_keys($item) !== range(0, count($item) - 1)) ksort($item);
            foreach ($item as $key => $child) $item[$key] = $canonical($child);
            return $item;
        };
        return $canonical($value);
    }
    private static function checkout_fingerprint($data) {
        return self::key(wp_json_encode(self::checkout_terms($data)));
    }
    private static function quote($body) {
        $data = self::cart_for_checkout($body);
        $id = bin2hex(random_bytes(24));
        self::put(self::key('quote:' . $id), array('uid' => self::$uid, 'input' => $data['input'], 'terms' => self::checkout_terms($data), 'fingerprint' => self::checkout_fingerprint($data)), 600);
        return array_merge($data['totals'], array('id' => $id, 'bridge_version' => self::VERSION));
    }
    private static function place_order($body) {
        $quote_id = $body['quote_id'] ?? '';
        $idempotency = $body['idempotency_key'] ?? '';
        if (!is_string($quote_id) || !preg_match('/^[a-f0-9]{48}$/', $quote_id) || !is_string($idempotency) || !preg_match('/^[a-f0-9-]{36}$/', $idempotency)) self::error('درخواست سفارش معتبر نیست.');
        $idem_key = self::key('order:' . self::$uid . ':' . $idempotency);
        $existing = self::get($idem_key);
        if ($existing) {
            if ($existing['data']['quote'] !== $quote_id) self::error('شناسه درخواست قبلاً استفاده شده است.', 409);
            if (!empty($existing['data']['order_id'])) {
                $order = self::owned_order($existing['data']['order_id']);
                if ($order->has_status('pending') && ($existing['data']['phase'] ?? '') !== 'complete') self::error('ثبت سفارش هنوز تکمیل نشده است؛ سفارش‌ها را بررسی کنید یا با پشتیبانی تماس بگیرید.', 409);
                return array('order' => self::order_data($order));
            }
            self::error('این درخواست قبلاً دریافت شده است؛ سفارش‌ها را بررسی کنید یا با پشتیبانی تماس بگیرید.', 409);
        }
        $quote_key = self::key('quote:' . $quote_id); $quote = self::get($quote_key);
        if (!$quote || (int) $quote['data']['uid'] !== self::$uid) self::error('پیش‌فاکتور منقضی شده است؛ دوباره محاسبه کنید.', 409);
        $data = self::cart_for_checkout($quote['data']['input']);
        if (!hash_equals($quote['data']['fingerprint'], self::checkout_fingerprint($data))) {
            $before = $quote['data']['terms'] ?? null; $after = self::checkout_terms($data); $changed = array();
            if (is_array($before)) {
                $labels = array('amounts' => 'مبلغ سفارش', 'shipping' => 'روش یا هزینه ارسال', 'address' => 'آدرس', 'email' => 'ایمیل حساب', 'items' => 'محصولات یا طرح');
                foreach ($labels as $field => $label) if (wp_json_encode($before[$field] ?? null) !== wp_json_encode($after[$field])) {
                    if ($field === 'amounts') {
                        $amountLabels = array('currency' => 'واحد پول', 'subtotal' => 'جمع محصولات', 'discount' => 'تخفیف', 'shipping_total' => 'هزینه ارسال', 'tax' => 'مالیات', 'total' => 'مبلغ نهایی');
                        foreach ($amountLabels as $amount => $amountLabel) {
                            $old = $before['amounts'][$amount] ?? ''; $new = $after['amounts'][$amount] ?? '';
                            if ((string) $old !== (string) $new) $changed[] = $amountLabel . ': ' . $old . ' ← ' . $new . ' ' . $after['amounts']['currency'];
                        }
                    } else $changed[] = $label;
                }
            }
            self::error($changed ? 'تغییر در ' . implode('، ', $changed) . '؛ دوباره محاسبه کنید. (نسخه ' . self::VERSION . ')' : 'پیش‌فاکتور مربوط به نسخه قبلی است؛ دوباره محاسبه کنید. (نسخه ' . self::VERSION . ')', 409);
        }
        $posted = array('payment_method' => '', 'shipping_method' => $data['input']['shipping_methods'], 'ship_to_different_address' => 1,
            'order_comments' => $data['input']['note'], 'billing_email' => $data['email'], 'billing_phone' => $data['address']['phone'], 'shipping_phone' => $data['address']['phone']);
        foreach (array('first_name','last_name','country','state','city','address_1','address_2','postcode') as $field) {
            $posted['billing_' . $field] = $data['address'][$field]; $posted['shipping_' . $field] = $data['address'][$field];
        }
        // Honor required/validated fields added by WooCommerce extensions; do not silently skip them.
        $errors = new WP_Error();
        foreach (WC()->checkout()->get_checkout_fields() as $fieldset) foreach ($fieldset as $name => $field) {
            if (!empty($field['required']) && empty($posted[$name])) $errors->add('required', 'اطلاعات ضروری سفارش کامل نیست: ' . wp_strip_all_tags($field['label'] ?? $name));
        }
        do_action('woocommerce_after_checkout_validation', $posted, $errors);
        if ($errors->has_errors()) self::error(wp_strip_all_tags($errors->get_error_message()));
        if (!self::put($idem_key, array('quote' => $quote_id, 'order_id' => 0, 'phase' => 'creating'), 30 * DAY_IN_SECONDS, true)) self::error('درخواست سفارش قبلاً دریافت شده است؛ نتیجه آن را بررسی کنید.', 409);
        // Save the order ID as soon as WooCommerce persists it, before notifications or stock hooks.
        $capture = function($order) use ($idem_key, $quote_id) {
            $order->update_meta_data('_wings_request_id', $idem_key); $order->save();
            self::put($idem_key, array('quote' => $quote_id, 'order_id' => $order->get_id(), 'phase' => 'creating'), 30 * DAY_IN_SECONDS);
        };
        add_action('woocommerce_checkout_order_created', $capture, 1);
        try { $order_id = WC()->checkout()->create_order($posted); }
        finally { remove_action('woocommerce_checkout_order_created', $capture, 1); }
        if (is_wp_error($order_id)) {
            $record = self::get($idem_key);
            if ($record && !empty($record['data']['order_id'])) {
                $failed = wc_get_order($record['data']['order_id']);
                if ($failed && $failed->has_status('pending')) $failed->update_status('failed', 'ثبت سفارش تکمیل نشد؛ موجودی یا اطلاعات سفارش باید بررسی شود.');
            }
            // Keep the marker even after a partial failure; blindly retrying could duplicate a persisted order.
            self::error('ثبت سفارش تکمیل نشد؛ نتیجه درخواست و موجودی را بررسی کنید.', 409);
        }
        $order = wc_get_order($order_id);
        if (!$order || (int) $order->get_customer_id() !== self::$uid) self::error('ثبت سفارش نیاز به بررسی پشتیبانی دارد.', 500);
        $order->set_created_via('wings');
        $order->set_payment_method('wings_manual'); $order->set_payment_method_title('ثبت سفارش بدون پرداخت آنلاین');
        $order->save();
        // on-hold triggers WooCommerce's stock reduction and normal order emails; never mark paid.
        $order->update_status('on-hold', 'سفارش از سایت وینگز ثبت شد. پرداخت آنلاین انجام نشده؛ منتظر بررسی فروشگاه است.');
        self::put($idem_key, array('quote' => $quote_id, 'order_id' => $order_id, 'phase' => 'complete'), 30 * DAY_IN_SECONDS);
        do_action('woocommerce_checkout_order_processed', $order_id, $posted, $order);
        // Also update the standard WooCommerce address fields, beyond the multi-address book.
        $customer = new WC_Customer(self::$uid);
        foreach (array('first_name','last_name','country','state','city','address_1','address_2','postcode') as $field) {
            $customer->{'set_billing_' . $field}($data['address'][$field]); $customer->{'set_shipping_' . $field}($data['address'][$field]);
        }
        $customer->set_billing_email($data['email']); $customer->set_billing_phone($data['address']['phone']);
        if (is_callable(array($customer, 'set_shipping_phone'))) $customer->set_shipping_phone($data['address']['phone']);
        $customer->save();
        update_user_meta(self::$uid, '_wings_cart', array());
        WC()->cart->empty_cart();
        self::remove($quote_key);
        return array('order' => self::order_data($order));
    }
    private static function owned_order($id) {
        $order = wc_get_order($id);
        if (!$order || (int) $order->get_customer_id() !== self::$uid || $order->get_type() !== 'shop_order') self::error('سفارش پیدا نشد.', 404);
        return $order;
    }
    private static function order_data($order, $detail = true) {
        $data = array('id' => $order->get_id(), 'number' => $order->get_order_number(), 'status' => $order->get_status(),
            'status_label' => wc_get_order_status_name($order->get_status()), 'created' => $order->get_date_created() ? $order->get_date_created()->date('c') : '',
            'currency' => $order->get_currency(), 'total' => $order->get_total(), 'subtotal' => (string) $order->get_subtotal(),
            'discount' => $order->get_discount_total(), 'shipping_total' => $order->get_shipping_total(), 'tax' => $order->get_total_tax(),
            'payment_title' => $order->get_payment_method_title(), 'customer_note' => $order->get_customer_note(),
            'can_cancel' => self::can_cancel($order), 'shipping' => $order->get_address('shipping'), 'items' => array(), 'notes' => array());
        foreach ($order->get_items() as $item) {
            $product = $item->get_product(); $attributes = array();
            foreach ($item->get_formatted_meta_data('_', true) as $meta) $attributes[] = wp_strip_all_tags($meta->display_key . ': ' . $meta->display_value);
            $data['items'][] = array('id' => $item->get_id(), 'product_id' => $item->get_product_id(), 'variation_id' => $item->get_variation_id(),
                'name' => $item->get_name(), 'quantity' => $item->get_quantity(), 'total' => $item->get_total(),
                'image' => $product ? wp_get_attachment_image_url($product->get_image_id(), 'woocommerce_thumbnail') ?: '' : '', 'attributes' => $attributes,
                'design' => json_decode((string) $item->get_meta('_wings_design', true), true), 'design_component' => (string) $item->get_meta('_wings_design_component', true));
        }
        if ($detail) foreach (wc_get_order_notes(array('order_id' => $order->get_id(), 'type' => 'customer')) as $note) {
            $data['notes'][] = array('id' => $note->id, 'note' => wp_strip_all_tags($note->content), 'created' => $note->date_created->date('c'));
        }
        return $data;
    }
    private static function orders($request) {
        $page = max(1, min(10000, (int) $request->get_param('page')));
        $result = wc_get_orders(array('customer_id' => self::$uid, 'type' => 'shop_order', 'limit' => 10, 'page' => $page, 'paginate' => true, 'orderby' => 'date', 'order' => 'DESC'));
        return array('orders' => array_map(function($order) { return self::order_data($order, false); }, $result->orders), 'pages' => $result->max_num_pages, 'total' => $result->total);
    }
    private static function single_order($id, $cancel) {
        if (!$cancel) return array('order' => self::order_data(self::owned_order($id)));
        return self::lock('order:' . $id, function() use ($id) {
            $order = self::owned_order($id);
            if (!self::can_cancel($order)) self::error('برای لغو این سفارش با پشتیبانی تماس بگیرید.', 409);
            $order->update_status('cancelled', 'لغو توسط مشتری از داشبورد وینگز.');
            return array('order' => self::order_data($order));
        });
    }
    private static function can_cancel($order) {
        return !$order->is_paid() && ($order->has_status(array('pending','failed')) || ($order->has_status('on-hold') && $order->get_payment_method() === 'wings_manual'));
    }
}

register_activation_hook(__FILE__, array('Wings_Commerce', 'install'));
register_deactivation_hook(__FILE__, function() { wp_clear_scheduled_hook('wings_cleanup'); });
add_action('wings_cleanup', array('Wings_Commerce', 'cleanup'));
add_action('rest_api_init', array('Wings_Commerce', 'routes'));
add_action('admin_menu', array('Wings_Commerce', 'admin_menu'));
add_action('woocommerce_checkout_create_order_line_item', array('Wings_Designs', 'order_meta'), 10, 4);
add_action('woocommerce_after_order_itemmeta', array('Wings_Designs', 'admin_preview'), 10, 3);
add_action('before_woocommerce_init', function() {
    if (class_exists('\Automattic\WooCommerce\Utilities\FeaturesUtil')) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
    }
});
