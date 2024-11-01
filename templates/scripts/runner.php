<?php
  namespace WP_SURVEYS_wpsurveys;

  if ( ! defined( 'ABSPATH' ) ) {
      exit; // Exit if accessed directly
  }

  $hash_key = null;
  if (current_user_can('edit_posts')) {
    $hash_key = admin_hash_key();
  } else {
    $hash_key = regular_hash_key();
  }
  $script_id = random_string(16);
  $user_id = wp_get_current_user();
  $salt = random_string();
  $script_query_args = "s_ckey=".hash("sha256",$hash_key[0].$salt);
  $script_query_args .= "&s_csalt=".$salt;
  $script_query_args .= "&s_ssalt=".$hash_key[1];
  $script_query_args .= "&s_user=".get_user_id();
?>
<script tyle='text/javascript'>
  window.SurveyContext = window.SurveyContext || {};
  var ctx = window.SurveyContext;
  ctx.SURVEY_KEY = '<?php echo $hash_key[0]; ?>';
  ctx.SURVEY_SALT = '<?php echo $hash_key[1]; ?>';
  ctx.SURVEY_USER = '<?php echo ($user_id->ID?$user_id->ID:""); ?>';
  ctx.SURVEY_HOST = '<?php echo WP_SURVEYS_SURVEY_ADDR; ?>';
  ctx.SURVEY_SESSION = '<?php echo get_cookie(); ?>';
  ctx.SURVEY_ORIGIN = '<?php echo get_origin(); ?>';
</script>
