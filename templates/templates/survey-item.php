<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

?>
<style>
  .survey-table-item.no-title #title .val {
    opacity: .3;
  }
</style>
<script type="text/template" id="public-survey-table-item">
  <td>1</td>
  <td id="title">
    <div>
      <h5 class='val'></h5>
      <div class="survey-actions">
        <span id="stat">
          <a href='javascript:void(0)'>Statistics</a>
          <span>&nbsp;|&nbsp;</span>
        </span>
        <span id="copy">
          <a href='javascript:void(0)'>Copy</a>
        </span>
    </div>
  </td>
  <td id="wp_id" style='position: relative'>
    <div>
      <div class="val"><%= survey.get("wp_id") %></div>
      <div class='wps-button-copy' description='Copy survey Id to clipboard and paste this string into the Post editor to add this survey to any post'>copy</div>
    </div>
  </td>
  <td id="type" title='<%= (survey.get("is_test")?"Test":"Questionary") %>'><%= (survey.get("is_test")?"T":"Q") %></td>
  <td id="questions"></td>
  <td id="votes"></td>
  <td id="status"></td>
</script>
<script type="text/template" id="survey-table-item">
  <td>1</td>
  <td id="title">
    <div>
      <h5 class='val'></h5>
      <div class="survey-actions">
        <span id='edit'>
          <a href='javascript:void(0)'>Edit</a>
          <span>&nbsp;|&nbsp;</span>
        </span>
        <span id="restart">
          <a href='javascript:void(0)'>Restart</a>
          <span>&nbsp;|&nbsp;</span>
        </span>
        <span id="publish">
          <a href='javascript:void(0)'>Publish</a>
          <span>&nbsp;|&nbsp;</span>
        </span>
        <span id="finish">
          <a href='javascript:void(0)'>Finish</a>
          <span>&nbsp;|&nbsp;</span>
        </span>
        <span id="stat">
          <a href='javascript:void(0)'>Statistics</a>
          <span>&nbsp;|&nbsp;</span>
        </span>
        <span id="delete">
          <a href='javascript:void(0)'>Delete</a>
          <span>&nbsp;|&nbsp;</span>
        </span>
        <span id="copy">
          <a href='javascript:void(0)'>Copy</a>
        </span>
    </div>
  </td>
  <td id="wp_id" style='position: relative'>
    <div>
      <div class="val"><%= survey.get("wp_id") %></div>
      <div class='wps-button-copy' description='Copy survey Id to clipboard and paste this string into the Post editor to add this survey to any post'>copy</div>
    </div>
  </td>
  <td id="type" title='<%= (survey.get("is_test")?"Test":"Questionary") %>'><%= (survey.get("is_test")?"T":"Q") %></td>
  <td id="questions"></td>
  <td id="votes"></td>
  <td id="status"></td>
</script>
