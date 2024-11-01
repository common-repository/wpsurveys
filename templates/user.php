<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

wp_enqueue_media();
req_survtemplate_style("common.php");
req_survtemplate_script("user.php");
?>
