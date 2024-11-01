<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

function post_js_runner() {
  req_survtemplate("templates/survey-view.php");
  req_survtemplate("templates/question-view.php");
  require(survfile("templates/scripts/runner.php"));
}

function parse_post_content($content) {
  $contentLengh = strlen($content);
  $offset = 0;

  $any = false;

  while ($offset < $contentLengh) {
    $offset = strpos($content,"[",$offset);
    if ($offset === false) {
      break;
    }

    $offsetClosingBrace = strpos($content,"]",$offset+1);
    if ($offsetClosingBrace === false) {
      break;
    }

    $survey = substr($content,$offset+1,$offsetClosingBrace-$offset-1);
    $parts = split_string(" ",$survey);
    if (strtolower($parts[0]) === WP_SURVEYS_SURVEY_PREFIX) {
      $any = true;
      $subElement = "<div wps-surveys=\"".$parts[1]."\"></div>";
      $before = substr($content,0,$offset);
      $after = substr($content,$offsetClosingBrace+1,$contentLengh-$offsetClosingBrace-1);
      $content = $before . $subElement . $after;
      $contentLengh = strlen($content);
      $offset = $offset + strlen($subElement);
    } else {
      $offset = $offsetClosingBrace+1;
    }
  }

  if ($any) {
    req_survtemplate("user.php");
  }

  return $content;
}

if (!is_admin()) {
  add_action("wp_footer","WP_SURVEYS_wpsurveys\\post_js_runner");
  add_filter("the_content","WP_SURVEYS_wpsurveys\\parse_post_content");
}

?>
