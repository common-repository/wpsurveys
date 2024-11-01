<?php

  namespace WP_SURVEYS_wpsurveys;

  if ( ! defined( 'ABSPATH' ) ) {
      exit; // Exit if accessed directly
  }

  req_survtemplate_style("common.php");
  enqueue_style("survey-admin","assets/css/admin.css");
  enqueue_style("richtext-editor","assets/css/vendor/jquery.richtext.min.css");
  enqueue_style("font-awesome","assets/css/fa.all.min.css");
?>
