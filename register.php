<?

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

$key = null;
$regular_part = null;
$admin_part = null;
$handle = null;
$key_file = dirname(__FILE__) . "/.survey";
$cookie = null;

function get_origin() {
  return get_site_url();
}

function calc_sha($value,$salt = "") {
  return hash("sha256",$value . WP_SURVEYS_PLUGIN_KEY . $salt);
}

function admin_hash_key() {
  global $key;
  global $admin_part;
  $salt = random_string();
  return array(calc_sha(floor(time()/1800).$admin_part.$key,$salt),$salt);
}

function regular_hash_key() {
  global $key;
  global $regular_part;
  $salt = random_string();
  $current_user = wp_get_current_user();
  $user_id = $current_user->ID?$current_user->ID:"";
  return array(calc_sha(floor(time()/1800).$regular_part.$key.$user_id,$salt),$salt);
}

function register_key($regKey) {
  $salt = random_string();
  $origin = get_origin();
  $hash = calc_sha($regKey . $origin, $salt);

  $body = array(
    "key" => $regKey,
    "salt" => $salt,
    "origin" => $origin,
    "hash" => $hash
  );

  $args = array(
      'body' => $body,
      'timeout' => '30',
      'redirection' => '5',
      'httpversion' => '1.0',
      'blocking' => true,
      'headers' => array(),
      'cookies' => array()
  );

  $req = wp_remote_post( WP_SURVEYS_SURVEY_ADDR.'/register', $args );
  $res = wp_remote_retrieve_body( $req );

  return $res;
}

if (file_exists($key_file) && filesize($key_file) > 0) {
  $handle = fopen($key_file,"r");
  $key = fread($handle,filesize($key_file));
} else {
  $handle = fopen($key_file,"w");
  $key = "" . time() . random_string();
  register_key($key);
  fwrite($handle,$key);
}
fclose($handle);

$keylen = strlen($key);
$regular_part = substr($key,0,floor($keylen/2));
$admin_part = substr($key,floor($keylen/2),$keylen);

add_action( 'wp_ajax_survey_register', 'WP_SURVEYS_wpsurveys\\ajax_register_callback' );
function ajax_register_callback() {
  global $key;
  $res = register_key($key);
	echo '{ "status": "'.$res.'"}';
	wp_die();
}

function get_user_id() {
  return $user_id->ID?$user_id->ID:"";
}

function set_cookie() {
  global $cookie;
  $cookie = ($_COOKIE['wpsurveys-session'])?$_COOKIE['wpsurveys-session']:random_string(8);
  setcookie('wpsurveys-session',$cookie,time()+WP_SURVEYS_SESSION_LIFETIME,"/");
}

function reset_cookie() {
  global $cookie;
  $cookie = random_string(8);
  setcookie('wpsurveys-session',$cookie,time()+WP_SURVEYS_SESSION_LIFETIME,"/");
}

function get_cookie() {
  global $cookie;
  return $cookie;
}

add_action("wp_login","WP_SURVEYS_wpsurveys\\reset_cookie");
add_action("wp_logout","WP_SURVEYS_wpsurveys\\reset_cookie");
add_action("init","WP_SURVEYS_wpsurveys\\set_cookie");
