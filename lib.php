<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

function get_file_content($name) {
  $f = fopen($name,"r");
  $d = fread($f,filesize($name));
  fclose($f);
  return $d;
}

function strip_string($str) {
  return preg_replace("/(\s*)([\w\W]*\w+)(\s*)/","$2",$str);
}

function split_string($dlmtr, $str) {
  $parts = explode($dlmtr,$str);
  return explode($dlmtr,join($dlmtr,array_filter($parts)));
}

function req_survtemplate($file) {
  require(survfile("templates/". $file));
}

function req_survtemplate_script($file) {
  require(survfile("templates/scripts/". $file));
}

function req_survtemplate_style($file) {
  require(survfile("templates/styles/". $file));
}

function enqueue_script($name,$file,$deps = array()) {
  wp_enqueue_script($name,plugin_dir_url(__FILE__).$file,$deps);
}

function enqueue_style($name,$file,$deps = array()) {
  wp_enqueue_style($name,plugin_dir_url(__FILE__).$file,$deps);
}

function random_string($len = 32) {
  return bin2hex(random_bytes($len));
}

function js_script($file) {
  $file = get_file_content($file);
  $ret = "(function(){ ";
  $ret .= $file;
  $ret .= "})()";
  return $ret;
}

function cover_js_script($file,$name,$newname) {
  $file = get_file_content($file);
  $ret = "(function(){ ";
  $ret .= "var __cached_variable__ = window.".$name.";\n";
  $ret .= $file;
  $ret .= "\n; window.".$newname." = window.".$name."; window.".$name." = __cached_variable__;";
  $ret .= "})()";
  return $ret;
}

?>
