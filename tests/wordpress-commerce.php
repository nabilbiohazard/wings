<?php
// Executable contract/security tests for the plugin, with isolated WordPress/WooCommerce doubles.
// No live SMS, customers, orders, or remote store are touched.
define('ABSPATH', __DIR__ . '/');
define('HOUR_IN_SECONDS', 3600); define('DAY_IN_SECONDS', 86400);
define('WINGS_BRIDGE_SECRET', str_repeat('s', 48));
define('WINGS_MELIPAYAMAK_USERNAME', 'test'); define('WINGS_MELIPAYAMAK_PASSWORD', 'test'); define('WINGS_MELIPAYAMAK_BODY_ID', 42);
function register_activation_hook($file, $fn) {} function register_deactivation_hook($file, $fn) {}
function add_action($name, $fn, $priority = 10) { $GLOBALS['hooks'][$name][]=$fn; }
function remove_action($name,$fn,$priority=10) { $GLOBALS['hooks'][$name]=array_filter($GLOBALS['hooks'][$name] ?? array(),function($entry)use($fn){return $entry!==$fn;}); }
function get_option($key,$default=null) { return $key === 'wings_schema' ? '1.2.5' : ($GLOBALS['options'][$key] ?? $default); }
function wp_get_post_terms(){return array();}
function get_terms($args){return array((object)array('term_id'=>100,'name'=>'چارم','slug'=>'charms'), (object)array('term_id'=>102,'name'=>'فلزی','slug'=>'metal'));}
function get_term_children($id,$taxonomy){return $id===100 ? array(102) : array();}
function has_term($terms,$taxonomy,$id){return in_array($id,array(40,41,42,44),true);}
function get_term($id,$taxonomy){return (object)array('term_id'=>$id,'slug'=>$id===100 ? 'charms' : 'metal');}
function wc_get_products($args){return array_filter($GLOBALS['products'],function($p){return in_array($p->get_id(),array(40,41,42,44));});}
function wc_get_product_id_by_sku($sku){return 0;}
function is_ssl() { return true; } function wp_get_environment_type() { return 'production'; }
function wp_json_encode($v) { return json_encode($v, JSON_UNESCAPED_UNICODE); }
function sanitize_text_field($v) { return trim(strip_tags((string) $v)); }
function is_email($v) {return (bool)filter_var($v,FILTER_VALIDATE_EMAIL);}
function sanitize_title($v) { return strtolower(str_replace(' ', '-', $v)); }
function wc_variation_attribute_name($name) { return 'attribute_' . sanitize_title($name); }
function wp_hash($v) { return hash_hmac('sha256', $v, 'test-salt'); }
function wp_strip_all_tags($v) { return strip_tags($v); }
function wp_parse_url($v){return parse_url($v);}
function wp_set_current_user($uid) { $GLOBALS['current_user'] = $uid; }
function wp_generate_password() { return 'random-test-password'; }
function do_action($name,...$args) {foreach($GLOBALS['hooks'][$name] ?? array() as $fn) $fn(...$args);}
function wp_generate_uuid4() { return 'c36b2367-7875-4446-a93a-' . str_pad((string) ++$GLOBALS['uuid_counter'], 12, '0', STR_PAD_LEFT); }
function get_users($query) { return array_values(array_filter($GLOBALS['users'], function($u) use ($query) { return ($GLOBALS['meta'][$u->ID][$query['meta_key']] ?? null) === $query['meta_value']; })); }
function get_userdata($id) { return $GLOBALS['users'][$id] ?? false; }
function user_can($user, $cap) { return in_array('administrator', $user->roles, true) || in_array('shop_manager', $user->roles, true); }
function username_exists($name) { foreach ($GLOBALS['users'] as $user) if ($user->user_login === $name) return $user->ID; return false; }
function wp_insert_user($data) { $id = count($GLOBALS['users']) + 1; $GLOBALS['users'][$id] = (object) array('ID'=>$id, 'user_login'=>$data['user_login'], 'roles'=>array($data['role'])); return $id; }
function get_user_meta($id, $key, $single = true) { return $GLOBALS['meta'][$id][$key] ?? ''; }
function update_user_meta($id, $key, $value) { $GLOBALS['meta'][$id][$key] = $value; }
function is_wp_error($v) { return $v instanceof WP_Error; }
function wp_remote_post($url, $args) {
    if (strpos($url, 'https://console.melipayamak.com/api/send/otp/') === 0) {
        $GLOBALS['console_requests'][]=$args;
        return array('status'=>200,'body'=>json_encode($GLOBALS['console_result']));
    }
    if ($url !== 'https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber') throw new Exception('Unexpected SMS endpoint');
    $GLOBALS['sms'][] = $args['body'];
    return array('status'=>200, 'body'=>json_encode($GLOBALS['sms_result']));
}
function wp_remote_retrieve_response_code($v) { return $v['status']; }
function wp_remote_retrieve_body($v) { return $v['body']; }
class WooCommerce {}
class WP_Error {
    public $message; public $data;
    function __construct($code='', $message='', $data = array()) { $this->message = $message; $this->data = $data; }
    function has_errors(){return !empty($this->message);} function add($code,$message){$this->message=$message;} function get_error_message(){return $this->message;}
}
class WP_REST_Response { public $data; function __construct($v) { $this->data = $v; } function header($key, $v) {} }
class FakeRequest {
    private $path; private $method; private $body; private $headers; private $params;
    function __construct($path, $method='GET', $body=array(), $token='', $key=WINGS_BRIDGE_SECRET, $params=array()) {
        $this->path='/wings/v1/'.$path; $this->method=$method; $this->body=$body; $this->params=$params;
        $this->headers=array('X-Wings-Key'=>$key,'X-Wings-Session'=>$token,'X-Wings-Client'=>str_repeat('a',64));
    }
    function get_route() { return $this->path; } function get_method() { return $this->method; }
    function get_json_params() { return $this->body; } function get_header($name) { return $this->headers[$name] ?? ''; }
    function get_param($key) { return $this->params[$key] ?? null; }
}
class FakeDB {
    public $prefix='wp_'; public $rows=array();
    function prepare($sql, ...$args) { return array($sql,$args); }
    function insert($table,$row) { if(isset($this->rows[$row['token_key']])) return false; $this->rows[$row['token_key']]=$row; return 1; }
    function replace($table,$row) { $this->rows[$row['token_key']]=$row; return 1; }
    function delete($table,$where) { $key=$where['token_key']; if(!isset($this->rows[$key])) return 0; unset($this->rows[$key]); return 1; }
    function get_row($query,$mode) { [$sql,$args]=$query; $row=$this->rows[$args[0]] ?? null; return $row && $row['expires']>$args[1] ? $row : null; }
    function get_var($query) { return $this->rows[$query[1][0]]['hits'] ?? 0; }
    function query($query) {
        [$sql,$args]=$query;
        if(strpos($sql,'INSERT INTO')===0) {
            $key=$args[0];
            if(isset($this->rows[$key])) $this->rows[$key]['hits']++;
            else $this->rows[$key]=array('token_key'=>$key,'payload'=>'{}','hits'=>1,'expires'=>$args[1]);
            return 1;
        }
        if(strpos($sql,'DELETE FROM')===0) { if(isset($this->rows[$args[0]]) && $this->rows[$args[0]]['expires']<=$args[1]) unset($this->rows[$args[0]]); return 1; }
        if(strpos($sql,'UPDATE')===0) { $this->rows[$args[0]]['hits']++; return 1; }
        throw new Exception('Unexpected SQL');
    }
}
define('ARRAY_A','ARRAY_A');
class WC_Customer {
    private $id; function __construct($id) {$this->id=$id;}
    function get_first_name() {return 'نیلوفر';} function get_last_name() {return 'احمدی';} function get_email() {return 'niloofar@example.com';}
    function __call($name,$args){return null;}
}
class FakeCountries { function get_states($country) {return array('THR'=>'تهران','ESF'=>'اصفهان');} }
function WC() {return $GLOBALS['wc'];}
function get_woocommerce_currency() {return 'IRR';}
function wc_get_product($id) {return $GLOBALS['products'][$id] ?? false;}
function wc_get_order($id) {return $GLOBALS['orders'][$id] ?? false;}
class FakeProduct {
    public $id; public $type; public $parent; public $stock;
    function __construct($id,$type='simple',$parent=0,$stock=5) {$this->id=$id;$this->type=$type;$this->parent=$parent;$this->stock=$stock;}
    function get_id(){return $this->id;} function get_status(){return 'publish';} function is_type($type){return in_array($this->type,(array)$type,true);}
    function get_parent_id(){return $this->parent;} function is_purchasable(){return true;} function is_in_stock(){return $this->stock>0;}
    function has_enough_stock($q){return $q <= $this->stock;} function is_sold_individually(){return false;}
    function get_variation_attributes(){return $this->type==='variable' ? array('pa_color'=>array('pink','blue')) : array('attribute_pa_color'=>$this->id===22 ? '' : 'pink');}
    function get_name(){return $this->id===50 ? 'لباس زنانه' : 'گردنبند پروانه';} function get_price(){return $this->id===40 ? 100000 : $GLOBALS['server_price'];} function get_image_id(){return $this->id>=40 && $this->id<50 ? $this->id : 0;}
    function get_children(){return $this->id===44 ? array(43) : array();}
    function get_slug(){return 'product-'.$this->id;}
}
class FakeOrder {
    private $owner; public $values=array(); public $id=0;
    function __construct($uid){$this->owner=$uid;} function get_customer_id(){return $this->owner;} function get_type(){return 'shop_order';}
    function get_id(){return $this->id;} function save(){return $this->id;} function update_meta_data($key,$value){$this->values[$key]=$value;}
    function get_date_created(){return new FakeDate();} function get_items(){return $this->values['items'] ?? array(new FakeItem());}
    function get_address($type){return $this->values['shipping'] ?? array();}
    function has_status($status){return in_array($this->values['status'] ?? 'pending',(array)$status,true);}
    function update_status($status,$note=''){$this->values['status']=$status;}
    function is_paid(){return $this->has_status(array('processing','completed'));}
    function __call($name,$args){
        if(strpos($name,'set_')===0){$this->values[substr($name,4)]=$args[0];return;}
        if($name==='get_order_number')return (string)$this->id;
        if($name==='get_payment_method_title')return $this->values['payment_method_title'] ?? '';
        return $this->values[substr($name,4)] ?? '';
    }
}
class FakeDate {function date($format){return '2026-10-14T12:00:00+03:30';}}
class FakeItem {
    public $meta=array(); public $line=null;
    function get_meta($key,$single=true){return $this->meta[$key] ?? '';}
    function add_meta_data($key,$value,$unique=true){$this->meta[$key]=$value;}
    function get_formatted_meta_data(){return array();} function get_product(){return $GLOBALS['products'][10];}
    function get_id(){return 1;} function get_product_id(){return $this->line['data']->get_id() ?? 10;} function get_variation_id(){return 0;}
    function get_name(){return 'گردنبند پروانه';} function get_quantity(){return 1;} function get_total(){return (string)$GLOBALS['server_price'];}
}
function wp_get_attachment_image_url($id=0){return $id ? 'https://store.example/images/'.$id.'.png' : '';}
function wc_get_order_status_name($status){return $status;}
function wc_get_order_notes(){return array();}
function wc_maybe_define_constant($name,$value){if(!defined($name))define($name,$value);}
function wc_load_cart(){} function wc_clear_notices(){} function wc_notice_count(){return 0;}
function wc_get_price_decimals(){return 0;} function wc_format_decimal($value,$decimals=0){return number_format((float)$value,$decimals,'.','');}
class FakeSession {
    public $data=array();
    function get_customer_id(){return (string)$GLOBALS['current_user'];} function set_customer_session_cookie($set){}
    function get($key,$default=null){return $this->data[$key] ?? $default;} function set($key,$value){$this->data[$key]=$value;}
}
class FakeRate {function get_id(){return 'flat_rate:1';}function get_label(){return 'پست';}function get_cost(){return 50000;}}
class FakeShipping {function get_packages(){return array(array('rates'=>array('flat_rate:1'=>new FakeRate())));}}
class FakeCart {
    public $items=array(); public $coupon=''; public $fee=0; public $restore_pending=false; public $saved_items=array();
    function empty_cart($clear=true){$this->items=array();$this->coupon='';}
    function add_to_cart($id,$quantity,$variation,$attrs,$extra=array()){$this->get_cart();$this->items[]=array_merge(array('data'=>$GLOBALS['products'][$id],'quantity'=>$quantity,'line_total'=>$GLOBALS['products'][$id]->get_price()*$quantity),$extra);return true;}
    function apply_coupon($code){if($code!=='WINGS10')return false;$this->coupon=$code;return true;}
    function calculate_shipping(){if(!WC()->session->get('chosen_shipping_methods'))WC()->session->set('chosen_shipping_methods',array('flat_rate:1'));}
    function calculate_totals(){ $this->fee=!empty($GLOBALS['shipping_fee_hook']) && WC()->session->get('chosen_shipping_methods') ? 10000 : 0; $this->calculate_shipping(); }
    function needs_shipping(){return true;} function check_cart_items(){} function get_cart(){if($this->restore_pending){$this->items=$this->saved_items;$this->restore_pending=false;}return $this->items;}
    function get_subtotal(){return array_sum(array_column($this->items,'line_total'));}
    function get_discount_total(){return $this->coupon ? $this->get_subtotal()/10 : 0;}
    function get_shipping_total(){return 50000;} function get_total_tax(){return 0;}
    function get_total($context){return (string)($this->get_subtotal()-$this->get_discount_total()+50000+$this->fee);}
}
class FakeCheckout {
    function get_checkout_fields(){return array('billing'=>array('billing_first_name'=>array('required'=>true,'label'=>'نام'),'billing_email'=>array('required'=>true,'label'=>'ایمیل')));}
    function create_order($data){
        $order=new FakeOrder($GLOBALS['current_user']);$order->id=++$GLOBALS['order_counter'];
        $order->values=array('total'=>WC()->cart->get_total('edit'),'subtotal'=>(string)WC()->cart->get_subtotal(),'discount_total'=>(string)WC()->cart->get_discount_total(),
            'shipping_total'=>'50000','total_tax'=>'0','currency'=>'IRR','customer_note'=>$data['order_comments'],'shipping'=>array(),'status'=>'pending');
        foreach($data as $key=>$value)if(strpos($key,'shipping_')===0)$order->values['shipping'][substr($key,9)]=$value;
        $GLOBALS['orders'][$order->id]=$order;
        $order->values['items']=array();
        foreach(WC()->cart->items as $line){$item=new FakeItem();$item->line=$line;do_action('woocommerce_checkout_create_order_line_item',$item,'cart-key',$line,$order);$order->values['items'][]=$item;}
        do_action('woocommerce_checkout_order_created',$order);
        return $order->id;
    }
}
class FakeWoo {
    public $countries;public $session;public $cart;public $customer;
    function __construct(){$this->countries=new FakeCountries();$this->session=new FakeSession();$this->cart=new FakeCart();}
    function shipping(){return new FakeShipping();}function checkout(){return new FakeCheckout();}
}
$GLOBALS['wpdb']=new FakeDB(); $GLOBALS['users']=array(); $GLOBALS['meta']=array(); $GLOBALS['uuid_counter']=0;
$GLOBALS['sms']=array(); $GLOBALS['sms_result']=array('RetStatus'=>1,'Value'=>'123456789012');
$GLOBALS['products']=array(10=>new FakeProduct(10),20=>new FakeProduct(20,'variable'),21=>new FakeProduct(21,'variation',20),22=>new FakeProduct(22,'variation',20),31=>new FakeProduct(31,'variation',30),40=>new FakeProduct(40),50=>new FakeProduct(50));
$GLOBALS['products'][41]=new FakeProduct(41,'simple',0,0);
$GLOBALS['products'][42]=new FakeProduct(42);
$GLOBALS['products'][43]=new FakeProduct(43,'variation',44);
$GLOBALS['products'][44]=new FakeProduct(44,'variable');
$GLOBALS['orders']=array();
$GLOBALS['hooks']=array(); $GLOBALS['wc']=new FakeWoo(); $GLOBALS['server_price']=250000; $GLOBALS['order_counter']=1000;
require __DIR__ . '/../wordpress/wings-commerce/wings-commerce.php';

$passed=0;
function check($condition,$message) { if(!$condition) throw new Exception('FAIL: '.$message); $GLOBALS['passed']++; echo 'PASS: '.$message."\n"; }
function call_route($path,$method='GET',$body=array(),$token='',$secret=WINGS_BRIDGE_SECRET) {
    $request=new FakeRequest($path,$method,$body,$token,$secret);
    $allowed=Wings_Commerce::permission($request);
    return is_wp_error($allowed) ? $allowed : Wings_Commerce::dispatch($request);
}
function status($value) {return $value instanceof WP_Error ? $value->data['status'] : 200;}
function private_call($name,...$args) {return (new ReflectionMethod('Wings_Commerce',$name))->invoke(null,...$args);}
function rejected($fn,$code,$label) {try {$fn(); check(false,$label);} catch(RuntimeException $e) {check($e->getCode()===$code,$label);} }

check(status(call_route('auth/request','POST',array('phone'=>'09121234567'),'','wrong'))===403,'Bridge rejects incorrect server secret');
check(status(call_route('me'))===401,'Private routes reject missing customer session');
check(status(call_route('auth/request','POST',array('phone'=>'02112345678')))===400,'Landline numbers cannot request OTP');
check(private_call('phone','+98 912 123 4567')==='09121234567','PHP normalizes international mobile number');
$requested=call_route('auth/request','POST',array('phone'=>'۰۹۱۲۱۲۳۴۵۶۷'));
check(status($requested)===200 && strlen($requested->data['challenge'])===64,'OTP request creates opaque challenge');
check(!isset($requested->data['code']) && count($GLOBALS['sms'])===1,'OTP is sent only through provider, never in API response');
$challenge=$requested->data['challenge']; $code=$GLOBALS['sms'][0]['text'];
check((bool)preg_match('/^[1-9]\d{3}$/',$code),'Generated OTP contains exactly four digits');
check(status(call_route('auth/verify','POST',array('challenge'=>$challenge,'code'=>'123456')))===400,'Six-digit OTP is rejected');
check(status(call_route('auth/request','POST',array('phone'=>'09121234567')))===429,'Phone resend cooldown is enforced');
check(status(call_route('auth/verify','POST',array('challenge'=>$challenge,'code'=>'0000')))===401,'Wrong OTP is rejected');
$verified=call_route('auth/verify','POST',array('challenge'=>$challenge,'code'=>$code));
check(status($verified)===200 && strlen($verified->data['token'])===64,'Correct OTP creates a customer session');
$token=$verified->data['token']; $uid=$verified->data['customer']['id'];
check($GLOBALS['users'][$uid]->roles===array('customer'),'SMS account is restricted to customer role');
check(status(call_route('auth/verify','POST',array('challenge'=>$challenge,'code'=>$code)))===401,'Successful OTP cannot be reused');
check(status(call_route('me','GET',array(),$token))===200,'Opaque customer token authenticates private route');

$address=array('label'=>'منزل','first_name'=>'نیلوفر','last_name'=>'احمدی','phone'=>'09121234567','state'=>'THR','city'=>'تهران','address_1'=>'خیابان بهار','address_2'=>'واحد ۲','postcode'=>'1234567890');
$saved=call_route('addresses','POST',$address,$token);
check(status($saved)===200 && count($saved->data['addresses'])===1,'Address is stored on authenticated WooCommerce customer');
check($GLOBALS['meta'][$uid]['_wings_addresses'][0]['state']==='THR','Address stores real WooCommerce state code');
check(status(call_route('addresses','POST',array_merge($address,array('state'=>'FAKE')),$token))===400,'Unknown province is rejected');
check(status(call_route('addresses/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','DELETE',array(),$token))===404,'Unknown or foreign address is not accessible');

$items=private_call('clean_items',array(array('id'=>10,'quantity'=>2,'price'=>1)));
check(!isset($items[0]['price']),'Client-supplied prices are discarded before checkout');
rejected(function(){private_call('clean_items',array(array('id'=>10,'quantity'=>6)));},409,'Insufficient stock is rejected');
rejected(function(){private_call('clean_items',array(array('id'=>20,'quantity'=>1)));},400,'Variable product requires a selected variation');
rejected(function(){private_call('clean_items',array(array('id'=>20,'variation_id'=>31,'quantity'=>1)));},400,'Variation from another parent product is rejected');
check(private_call('clean_items',array(array('id'=>20,'variation_id'=>21,'quantity'=>1)))[0]['variation_id']===21,'Valid product variation is accepted');
check(private_call('clean_items',array(array('id'=>20,'variation_id'=>22,'quantity'=>1,'attributes'=>array('attribute_pa_color'=>'blue'))))[0]['attributes']['attribute_pa_color']==='blue','Wildcard variation accepts a valid chosen attribute');
rejected(function(){private_call('clean_items',array(array('id'=>20,'variation_id'=>21,'quantity'=>1,'attributes'=>array('attribute_pa_color'=>'blue'))));},400,'Tampered attributes cannot select a cheaper incompatible fixed variation');
rejected(function(){private_call('clean_items',array(array('id'=>20,'variation_id'=>22,'quantity'=>1,'attributes'=>array('attribute_pa_color'=>'fake'))));},400,'Unknown wildcard attribute is rejected');
rejected(function(){private_call('clean_items',array(array('id'=>10,'quantity'=>1),array('id'=>10,'quantity'=>1)));},400,'Duplicate cart lines cannot evade aggregate limits');

$GLOBALS['orders'][100]=new FakeOrder(999);
check(status(call_route('orders/100','GET',array(),$token))===404,'Customer cannot access another customer order');
check(status(call_route('orders/100/cancel','POST',array(),$token))===404,'Customer cannot cancel another customer order');

// The only binding used for authentication is verified_phone, never editable billing_phone.
$legacy=wp_insert_user(array('user_login'=>'legacy','role'=>'customer'));
update_user_meta($legacy,'billing_phone','09129998877');
$new=private_call('customer_for_phone','09129998877');
check($new!==$legacy,'Editable legacy billing phone cannot take over another account');
$GLOBALS['users'][$uid]->roles=array('administrator','customer');
check(status(call_route('me','GET',array(),$token))===401,'Promoted staff account cannot authenticate through SMS customer session');
$GLOBALS['users'][$uid]->roles=array('customer');
check(status(call_route('auth/logout','POST',array(),$token))===200,'Logout succeeds');
check(status(call_route('me','GET',array(),$token))===401,'Logout revokes token on server');

$requested=call_route('auth/request','POST',array('phone'=>'09123334455'));
$challenge=$requested->data['challenge'];
for($attempt=0;$attempt<5;$attempt++) call_route('auth/verify','POST',array('challenge'=>$challenge,'code'=>'0000'));
$last=end($GLOBALS['sms']);
check(status(call_route('auth/verify','POST',array('challenge'=>$challenge,'code'=>$last['text'])))===401,'OTP becomes unusable after five failed attempts');
$GLOBALS['sms_result']=array('RetStatus'=>0,'Value'=>'1');
check(status(call_route('auth/request','POST',array('phone'=>'09125556677')))===502,'Provider error codes are not accepted as delivery receipts');
echo "\n".$passed." WordPress contract/security checks passed.\n";

// Exercise the plugin's complete quote -> create_order -> idempotent replay flow.
$GLOBALS['sms_result']=array('RetStatus'=>1,'Value'=>'123456789012');
$requested=call_route('auth/request','POST',array('phone'=>'09128887766'));$sms=end($GLOBALS['sms']);
$verified=call_route('auth/verify','POST',array('challenge'=>$requested->data['challenge'],'code'=>$sms['text']));
$token=$verified->data['token'];$uid=$verified->data['customer']['id'];
$saved=call_route('addresses','POST',$address,$token);$aid=$saved->data['addresses'][0]['id'];
$input=array('items'=>array(array('id'=>10,'quantity'=>1,'price'=>1)),'address_id'=>$aid,'coupon'=>'','shipping_methods'=>array(),'note'=>'لطفاً بسته‌بندی کنید','total'=>1);
$quote=call_route('checkout/quote','POST',$input,$token);
check(status($quote)===200,'Checkout quote runs for authenticated customer address');
check($quote->data['total']==='300000','Total is calculated from server product price and WooCommerce shipping, ignoring client price/total');
check($quote->data['shipping'][0]['selected']==='flat_rate:1','Quote selects an available WooCommerce shipping rate');
check(status(call_route('checkout/quote','POST',array_merge($input,array('coupon'=>'INVALID')),$token))===400,'Invalid coupon blocks checkout');
check(status(call_route('checkout/quote','POST',array_merge($input,array('address_id'=>'foreign')),$token))===400,'Quote rejects another customer address');
check(status(call_route('checkout/quote','POST',array_merge($input,array('shipping_methods'=>array('fake:999'))),$token))===409,'Client cannot forge a shipping rate');
$discounted=call_route('checkout/quote','POST',array_merge($input,array('coupon'=>'WINGS10')),$token);
check($discounted->data['total']==='275000','Valid coupon discount is calculated server-side');
$GLOBALS['server_price']=260000;
$request=array('quote_id'=>$quote->data['id'],'idempotency_key'=>'f36b2367-7875-4446-a93a-c88f386fe2e5');
check(status(call_route('checkout/order','POST',$request,$token))===409,'Changed product price invalidates an earlier quote');
check($GLOBALS['order_counter']===1000,'Invalidated quote does not create an order');
$GLOBALS['server_price']=250000;
$placed=call_route('checkout/order','POST',$request,$token);
check(status($placed)===200 && $placed->data['order']['status']==='on-hold','Order is registered on-hold without marking it paid');
check($placed->data['order']['payment_title']==='ثبت سفارش بدون پرداخت آنلاین','Order records the explicit unpaid/manual payment mode');
check($placed->data['order']['customer_note']===$input['note'],'Customer note reaches the WooCommerce order');
check($GLOBALS['orders'][1001]->get_customer_id()===$uid,'Order belongs to authenticated customer, not a client-supplied customer ID');
$replayed=call_route('checkout/order','POST',$request,$token);
check(status($replayed)===200 && $replayed->data['order']['id']===1001 && $GLOBALS['order_counter']===1001,'Idempotent retry returns the same order, even after its quote is consumed');
$recovered=call_route('checkout/requests/'.$request['idempotency_key'],'GET',array(),$token);
check($recovered->data['order']['id']===1001,'Lost response can be recovered by customer request ID');
check($GLOBALS['meta'][$uid]['_wings_cart']===array(),'Successful order clears saved customer cart');
$cancelled=call_route('orders/1001/cancel','POST',array(),$token);
check(status($cancelled)===200 && $cancelled->data['order']['status']==='cancelled','Customer may cancel their unpaid manual on-hold order');
echo "\n".$passed." total WordPress checks passed.\n";

$dynamic=call_route('designs/catalogue');
check(status($dynamic)===200 && $dynamic->data['source']==='woocommerce','Designer catalogue is marked as WooCommerce-backed');
$ids=array_column($dynamic->data['charms'],'id');
check(in_array('woo-40',$ids,true) && in_array('woo-42',$ids,true),'WooCommerce charm products including child categories appear in designer catalogue');
check(!in_array('clover',$ids,true) && !in_array('woo-50',$ids,true),'Static sample charms and clothing do not appear in designer catalogue');
$unavailable=array_values(array_filter($dynamic->data['charms'],function($item){return $item['id']==='woo-41';}))[0];
check($unavailable['available']===false,'Out-of-stock charm cannot be selected');
check(in_array('woo-43',$ids,true),'Fixed variation of a charm product is included');
$newDesign=array('version'=>1,'product'=>array('id'=>10,'image'=>'/images/product-placeholder.jpg'),'charms'=>array(array('instanceId'=>'store-charm','charm'=>array('id'=>'woo-40','image'=>'https://store.example/images/40.png'),'x'=>300,'y'=>400,'rotation'=>0)));
$item=call_route('designs/prepare','POST',array('id'=>10,'quantity'=>1,'design'=>$newDesign));
check(status($item)===200 && $item->data['item']['price']===35000.0,'Dynamic charm can be added to a design without a manual SKU mapping');
check($item->data['item']['design']['charms'][0]['charm']['product_id']===40,'Dynamic charm resolves its exact WooCommerce product ID');
$newDesign['charms'][0]['charm']=array('id'=>'woo-50','image'=>'https://store.example/images/50.png');
check(status(call_route('designs/prepare','POST',array('id'=>10,'quantity'=>1,'design'=>$newDesign)))===409,'Clothing cannot be forged as a dynamic charm');

$GLOBALS['options']['wings_sms_provider']='console';
$GLOBALS['options']['wings_melipayamak_otp_key']=str_repeat('a',32);
$GLOBALS['console_result']=array('code'=>'1234567890','status'=>'عملیات موفق');
$console=call_route('auth/request','POST',array('phone'=>'09120001234'));
check(status($console)===200 && $console->data['code_length']===10,'Original Console OTP mode is preserved and advertises actual code length');
check(!isset($console->data['code']),'Console OTP remains server-side and is not returned to browser');
$consoleHttpOptions=end($GLOBALS['console_requests']);
check($consoleHttpOptions['sslverify']===true && json_decode($consoleHttpOptions['body'],true)['to']==='09120001234','Original Console HTTPS request and phone payload are preserved');
$login=call_route('auth/verify','POST',array('challenge'=>$console->data['challenge'],'code'=>'1234567890'));
check(status($login)===200,'Console ten-digit OTP authenticates a customer');
$GLOBALS['console_result']=array('code'=>'1234','status'=>'اعتبار کافی نیست');
check(status(call_route('auth/request','POST',array('phone'=>'09120001235')))===502,'Console error status does not create a usable login challenge');
$GLOBALS['options']['wings_sms_provider']='pattern';

$GLOBALS['options']['wings_charm_products']=array('clover'=>'40');
$design=array('version'=>1,'product'=>array('id'=>10,'image'=>'/images/product-placeholder.jpg'), 'charms'=>array(
    array('instanceId'=>'first-charm','charm'=>array('id'=>'clover','price'=>1),'x'=>300.25,'y'=>500.75,'rotation'=>-27.5),
    array('instanceId'=>'second-charm','charm'=>array('id'=>'clover'),'x'=>95,'y'=>225,'rotation'=>180)));
$line=array('id'=>10,'quantity'=>1,'design'=>$design);
$prepared=call_route('designs/prepare','POST',$line);
check(status($prepared)===200 && $prepared->data['item']['price']===45000.0,'Design uses WooCommerce base plus both charm prices, ignoring client price');
check($prepared->data['item']['design']['charms'][0]['x']===300.25 && $prepared->data['item']['design']['charms'][0]['rotation']===-27.5,'Exact fractional coordinates and rotation survive server canonicalization');
check($prepared->data['item']['design']['charms'][1]['instanceId']==='second-charm','Charm stacking order and repeated instances are retained');
$other=$design;$other['charms'][0]['x']=301.25;
$lines=private_call('clean_items',array($line,array('id'=>10,'quantity'=>1,'design'=>$other),array('id'=>10,'quantity'=>1)));
check(count($lines)===3,'Different designs and the plain base product remain separate cart lines');
check($lines[0]['design']['id']!==$lines[1]['design']['id'],'Moving a charm changes design identity');
rejected(function()use($line){private_call('clean_items',array($line,$line));},400,'Duplicate identical design is rejected at server boundary');
$invalid=$design;$invalid['charms'][0]['x']=601;
check(status(call_route('designs/prepare','POST',array('id'=>10,'quantity'=>1,'design'=>$invalid)))===400,'Out-of-canvas charm position is rejected');
$invalid=$design;$invalid['charms'][0]['charm']['id']='unknown';
check(status(call_route('designs/prepare','POST',array('id'=>10,'quantity'=>1,'design'=>$invalid)))===400,'Unknown charm cannot be ordered');
$invalid=$design;$invalid['charms'][0]['charm']['id']='pink-dress';
check(status(call_route('designs/prepare','POST',array('id'=>10,'quantity'=>1,'design'=>$invalid)))===409,'Unconfigured charm does not resolve an empty SKU or become free');
$invalid=$design;$invalid['product']['id']=50;
check(status(call_route('designs/prepare','POST',array('id'=>50,'quantity'=>1,'design'=>$invalid)))===400,'Clothing cannot be personalized');
check(status(call_route('designs/prepare','POST',array('id'=>10,'quantity'=>3,'design'=>$design)))===409,'Repeated charms and number of finished designs are included in stock check');
$designInput=array_merge($input,array('items'=>array($line)));
$quote=call_route('checkout/quote','POST',$designInput,$token);
check(status($quote)===200 && $quote->data['total']==='500000','WooCommerce quote expands design into base and components with shipping');
check(count(WC()->cart->items)===2 && WC()->cart->items[1]['quantity']===2,'Repeated charms use two units of real WooCommerce product');
check(WC()->cart->items[0]['wings_design']['charms'][0]['y']===500.75,'WooCommerce cart carries exact design snapshot');
$request=array('quote_id'=>$quote->data['id'],'idempotency_key'=>'a36b2367-7875-4446-a93a-c88f386fe2e5');
$placed=call_route('checkout/order','POST',$request,$token);
check(status($placed)===200 && $placed->data['order']['total']==='500000','Custom design registers as actual unpaid WooCommerce order');
check($placed->data['order']['items'][0]['design']['charms'][0]['rotation']===-27.5,'Order detail returns original design and rotation');
check(!empty($placed->data['order']['items'][1]['design_component']),'Charm order lines link to their design');
$stored=json_decode($GLOBALS['orders'][1002]->values['items'][0]->get_meta('_wings_design'),true);
check($stored['charms'][1]['x']===95 && $stored['charms'][1]['rotation']===180,'Order metadata keeps manufacturing coordinates independent of browser saved designs');
echo "\n".$passed." total WordPress checks passed.\n";

// Presentation-only differences must not invalidate an unchanged purchase.
$fingerprintMethod=new ReflectionMethod('Wings_Commerce','checkout_fingerprint');if (PHP_VERSION_ID < 80100) $fingerprintMethod->setAccessible(true);
$terms=array('totals'=>array('currency'=>'IRR','subtotal'=>'250000','discount'=>'0','shipping_total'=>'50000','tax'=>'0','total'=>300000.0,'shipping'=>array(array('package'=>0,'name'=>'???? ?','selected'=>'flat_rate:1','rates'=>array(array('id'=>'flat_rate:1','label'=>'???','cost'=>'50000'),array('id'=>'local_pickup:2','label'=>'????? ?????','cost'=>'0'))))), 'address'=>array('id'=>'address','city'=>'?????'),'email'=>'customer@example.com','input'=>array('items'=>array(array('id'=>10,'quantity'=>1))));
$originalFingerprint=$fingerprintMethod->invoke(null,$terms);
$equivalent=$terms;$equivalent['totals']['total']='300000.00';$equivalent['totals']['shipping'][0]['rates']=array_reverse($equivalent['totals']['shipping'][0]['rates']);$equivalent['address']=array_reverse($equivalent['address'],true);
check($fingerprintMethod->invoke(null,$equivalent)===$originalFingerprint,'Shipping option order, numeric representation and object key order do not invalidate checkout');
$changed=$terms;$changed['totals']['total']='310000';check($fingerprintMethod->invoke(null,$changed)!==$originalFingerprint,'A changed payable total still invalidates checkout');
$changed=$terms;$changed['totals']['shipping'][0]['selected']='local_pickup:2';check($fingerprintMethod->invoke(null,$changed)!==$originalFingerprint,'A changed selected shipping method still invalidates checkout');
$changed=$terms;$changed['address']['city']='different-city';check($fingerprintMethod->invoke(null,$changed)!==$originalFingerprint,'A changed delivery address still invalidates checkout');
$changed=$terms;$changed['input']['items'][0]['quantity']=2;check($fingerprintMethod->invoke(null,$changed)!==$originalFingerprint,'A changed ordered quantity still invalidates checkout');
echo "\n".$passed." total WordPress checks passed.\n";

$GLOBALS['shipping_fee_hook']=true;
$feeQuote=call_route('checkout/quote','POST',$input,$token);
check(status($feeQuote)===200 && $feeQuote->data['total']==='310000','Default shipping is resolved before shipping-dependent fee hooks run');
check($feeQuote->data['bridge_version']==='1.2.5','Quote identifies the installed bridge version');
$feeOrder=call_route('checkout/order','POST',array('quote_id'=>$feeQuote->data['id'],'idempotency_key'=>'b36b2367-7875-4446-a93a-c88f386fe2e5'),$token);
check(status($feeOrder)===200,'Quote with default shipping and shipping-dependent fees remains valid on order recalculation');
$GLOBALS['shipping_fee_hook']=false;
$diagnosticQuote=call_route('checkout/quote','POST',$input,$token);
$GLOBALS['server_price']=260000;
$diagnosticOrder=call_route('checkout/order','POST',array('quote_id'=>$diagnosticQuote->data['id'],'idempotency_key'=>'c36b2367-7875-4446-a93a-c88f386fe2e5'),$token);
check(status($diagnosticOrder)===409 && strpos($diagnosticOrder->message,'1.2.5')!==false,'Changed checkout terms give a versioned diagnostic without creating an order');
$GLOBALS['server_price']=250000;
echo "\n".$passed." total WordPress checks passed.\n";

// A fresh REST request can restore a persistent cart only on first access.
WC()->cart->restore_pending=true;
WC()->cart->saved_items=array(array('data'=>$GLOBALS['products'][10],'quantity'=>10,'line_total'=>2500000));
$restoredQuote=call_route('checkout/quote','POST',$input,$token);
check(status($restoredQuote)===200 && $restoredQuote->data['subtotal']==='250000','Lazy persistent cart restoration cannot add 2500000 rial of stale products to the quote');
WC()->cart->restore_pending=true;
WC()->cart->saved_items=array(array('data'=>$GLOBALS['products'][10],'quantity'=>10,'line_total'=>2500000));
$restoredOrder=call_route('checkout/order','POST',array('quote_id'=>$restoredQuote->data['id'],'idempotency_key'=>'d36b2367-7875-4446-a93a-c88f386fe2e5'),$token);
check(status($restoredOrder)===200,'Fresh order request restores then clears old WooCommerce cart before rebuilding quoted items');
check(count(end($GLOBALS['orders'])->values['items'])===1,'Order contains only requested products, without restored stale cart items');
echo "\n".$passed." total WordPress checks passed.\n";
