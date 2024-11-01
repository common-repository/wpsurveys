<?php

  namespace WP_SURVEYS_wpsurveys;

  if ( ! defined( 'ABSPATH' ) ) {
      exit; // Exit if accessed directly
  }

  enqueue_style("wpsurveys-iconic","/assets/css/vendor/open-iconic.min.css");
  enqueue_style("wpsurveys-bootstrap","/assets/css/vendor/bootstrap.min.css");
  enqueue_script("wpsurveys-bootstrap","/assets/js/vendor/bootstrap.bundle.min.js");
?>
