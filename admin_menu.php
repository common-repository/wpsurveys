<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

function register_admin_menu() {
  $page = "WordPress Surveys : ";
  add_menu_page($page . "Main page","Surveys","edit_others_posts","wps-surveys","WP_SURVEYS_wpsurveys\\survey_main",null,1000);
}

function survey_main() {
  try {
    req_survtemplate("admin.php");
  } catch (Exception $e) {
    browser_log($e);
  }
}

function survey_edit() {
  try {
    req_survtemplate("survey_edit.php");
  } catch (Exception $e) {
    browser_log($e);
  }
}

function survey_stat() {
  try {
    req_survtemplate("survey_stat.php");
  } catch(Exception $e) {
    browser_log($e);
  }
}

function survey_about() {
  echo "<h1> About </h1>";
}

function admin_js_runner() {
  require(survfile("templates/scripts/runner.php"));
}

add_action("admin_menu","WP_SURVEYS_wpsurveys\\register_admin_menu");
add_action("admin_footer","WP_SURVEYS_wpsurveys\\admin_js_runner");
?>
