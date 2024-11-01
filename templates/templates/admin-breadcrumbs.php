<?php 

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

?>
<style>
.wps-surveys .admin-breadcrumbs .oi {
  position: relative;
  top: -1px;
  font-size: 50%;
}

.wps-surveys .admin-breadcrumbs a {
  outline: none;
  box-shadow: none;
}

.wps-surveys .admin-breadcrumbs .active, .wps-surveys .admin-breadcrumbs .active * {
  color: black;
  cursor: default;
}

.wps-surveys .admin-breadcrumbs .saved {
  opacity: 0;
  font-size: 75%;
  color: darkgreen;
  transition: opacity 1000ms;
}

.wps-surveys .admin-breadcrumbs .saved.flash {
  transition: none;
  opacity: 1;
}


</style>
<script type="text/template" id="admin-breadcrumbs">
  <div class='wps-heading'>
    <h4>
      <a id='list' class='active' href='javascript:void(0)'>Surveys</a>
      <span id='survey' style='display: none'>
        <span class="oi oi-caret-right"></span>
        <a class="val" href='javascript:void(0)'></a>
      </span>
      <span id='survey-subpage' style='display: none'>
        <span class="oi oi-caret-right"></span>
        <a class="val" href='javascript:void(0)'></a>
      </span>
      &nbsp;
      <span class='saved'>saved</span>
    </h4>
    <a href="javascript:void(0)" class="wps-button wps-add-survey">Add new</a>
  </div>
</script>
