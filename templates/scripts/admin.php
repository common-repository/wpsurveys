<?php
  namespace WP_SURVEYS_wpsurveys;

  if ( ! defined( 'ABSPATH' ) ) {
      exit; // Exit if accessed directly
  }

  req_survtemplate_script("common.php");
  enqueue_script("wpsurveys-chartjs","/assets/js/vendor/chart.min.js");
  enqueue_script("wpsurveys-request-filter","/assets/js/request-filter.js");
  enqueue_script("wpsurveys-breadcrumbs","/assets/js/admin-breadcrumbs.js",array("backbone","wpsurveys-survey-common"));
  enqueue_script("wpsurveys-survey-model","/assets/js/survey-model.js",array("backbone","wpsurveys-survey-common"));
  enqueue_script("wpsurveys-option-model","/assets/js/option-model.js",array("backbone","wpsurveys-survey-common"));
  enqueue_script("wpsurveys-question-model","/assets/js/question-model.js",array("backbone","wpsurveys-survey-common"));
  enqueue_script("wpsurveys-html-editor","/assets/js/html-editor.js",array("backbone","wpsurveys-richtext-editor"));
  enqueue_script("wpsurveys-option-view-admin","/assets/js/option-view-admin.js",array("wpsurveys-option-model","wpsurveys-html-editor"));
  enqueue_script("wpsurveys-image-ratio-helper","/assets/js/image-ratio-helper.js",array("backbone","wpsurveys-survey-common"));
  enqueue_script("wpsurveys-question-view-user","/assets/js/question-view-user.js",array("wpsurveys-question-model"));
  enqueue_script("wpsurveys-question-view-admin","/assets/js/question-view-admin.js",array("wpsurveys-question-model","wpsurveys-image-ratio-helper","wpsurveys-question-view-user"));
  enqueue_script("wpsurveys-survey-view-admin-stat","/assets/js/survey-view-admin-stat.js",array("wpsurveys-chartjs","wpsurveys-question-model","wpsurveys-request-filter"));
  enqueue_script("wpsurveys-survey-view-admin","/assets/js/survey-view-admin.js",array("wpsurveys-survey-common", "wpsurveys-question-view-admin"));
  enqueue_script("wpsurveys-survey-add","/assets/js/survey-add.js");
  enqueue_script("wpsurveys-launcher","/assets/js/launcher-admin.js",array("wpsurveys-survey-common","wpsurveys-survey-model","wpsurveys-survey-view-admin"));
?>
