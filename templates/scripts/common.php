<?php
  namespace WP_SURVEYS_wpsurveys;

  if ( ! defined( 'ABSPATH' ) ) {
      exit; // Exit if accessed directly
  }

  wp_enqueue_script("jquery");
  wp_enqueue_script("backbone");
  enqueue_script("wpsurveys-js-sha256","/assets/js/lib/sha256.min.js");
  enqueue_script("wpsurveys-richtext-editor","/assets/js/vendor/jquery.richtext.min.js",array("jquery"));
  enqueue_script("wpsurveys-survey-common","/assets/js/wps-common.js",array("wpsurveys-js-sha256"));
?>
