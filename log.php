<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

$logs = array();


function console_log($val) {
  echo "<script>console.log('".json_encode($val)."');</script>";
}

function browser_log($val) {
  global $logs;
  array_push($logs,"<script type='text/javascript'> console.log('".json_encode($val)."') </script>");
}

function flush_logs() {
  global $logs;
  foreach($logs as $i => $value) {
    echo $value;
  }
  $logs = array();
}

add_action("wp_footer","WP_SURVEYS_wpsurveys\\flush_logs");
add_action("admin_footer","WP_SURVEYS_wpsurveys\\flush_logs");
?>
