<?php

  namespace WP_SURVEYS_wpsurveys;

  if ( ! defined( 'ABSPATH' ) ) {
      exit; // Exit if accessed directly
  }

  req_survtemplate_script("common.php");
  enqueue_script("wpsurveys-survey-model","/assets/js/survey-model-user.js",array("backbone","wpsurveys-survey-common"));
  enqueue_script("wpsurveys-option-model","/assets/js/option-model-user.js",array("backbone","wpsurveys-survey-common"));
  enqueue_script("wpsurveys-question-model","/assets/js/question-model-user.js",array("backbone","wpsurveys-survey-common"));
  enqueue_script("wpsurveys-question-view","/assets/js/question-view-user.js",array("backbone","wpsurveys-survey-common"));
  enqueue_script("wpsurveys-survey-view","/assets/js/survey-view-user.js",array("backbone","wpsurveys-survey-common"));
  enqueue_script("wpsurveys-launcher","/assets/js/launcher-user.js",array("wpsurveys-survey-common"));
?>
