<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

$host = strip_string(get_file_content("/etc/hostname"));
$hosts = strip_string(get_file_content("/etc/hosts"));
$hosts = split_string("\n",$hosts);
$host_ip_line = false;
foreach ($hosts as $k => $v) {
  $pos = strpos($v,$host);
  if ($pos !== false) {
      $host_ip_line = $v;
  };
}
$host_ip = split_string(".",split_string("\t",$host_ip_line)[0]);
// $master_ip = $host_ip[0].".".$host_ip[1].".0.1";
$master_ip = "";
define("WP_SURVEYS_SURVEY_PREFIX","wps-surveys");
define("WP_SURVEYS_PLUGIN_KEY","domain8372621123.mysurveys.space/v82716");
define("WP_SURVEYS_SURVEY_ADDR","https://mysurveys.space");
define("WP_SURVEYS_SESSION_LIFETIME",3600*24*30);
?>
