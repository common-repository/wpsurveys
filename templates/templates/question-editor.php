<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

?>
<style>
.question-editor {
  padding: 1em;
}

.question-editor textarea {
  width: 100%;
}

.question-editor #image {
  width: 100%;
}

.image-block {
  padding-top: 10px;
}

.image-block > div:not(:last-child) {
  width: 48%;
  margin: 1%;
  float: left;
}

.image-block #image-container-block {
  background: black;
}

.image-block #image-container {
  display: inline-block;
  position: relative;
  text-align: center;
  transform: translateX(-50%);
  left: 50%;
}

.image-block #image-el {
  max-width: 100%;
  max-height: 350px;
}

#invalid-image-message {
  padding: 10px;
  color: darkred;
}

.form-group > div {
  position: relative;
  margin-bottom: 3px;
}

.form-group > div > .label {
  position: absolute;
  top: 7px;
  left: 10px;
}

#ratio-form > div > input {
  padding-left: 27px;
}

#height-form > div > input {
  padding-left: 35px;
}

.published #freeze-ratio-container,
.finished #freeze-ratio-container {
  display: none;
}

#tab-selector .nav-link.active {
  font-weight: bold;
  color: black;
}

.survey-params.questionary .answers-title,
.survey-params.test .options-title {
  display: none;
}

.survey-params .test-only {
  display: none;
}

.test.survey-params .test-only {
  display: block;
}

</style>
<script type="text/template" id="question-editor">
  <div id="tab-selector">
    <ul class="nav">
      <li class="nav-item" for="question-editor"><a class="nav-link active" href='javascript:void(0);'>Edit</a></li>
      <li class="nav-item" for="question-preview"><a class="nav-link" href='javascript:void(0);'>Preview</a></li>
    </ul>
  </div>
  <div>
    <div class="survey-editor-tab" id="question-editor">
      <div class="wps-form-block survey-element-id">
        <input id="wp_id" placeholder="question-id" value="<%= question.get('wp_id') %>">
      </div>
      <div class="wps-form-block">
        <div class='wps-heading'>
          <h5>Question text</h5>
        </div>
        <div>
          <textarea html-editor class='form-control' id="text">&nbsp;</textarea>
        </div>
      </div>
      <hr>
      <div id="option-list" class="wps-form-block">
        <div class='wps-heading'>
          <h5 class='options-title'>Options</h5>
          <h5 class='answers-title'>Answers</h5>
          <a id="add-option" class='wps-button' href='javascript:void(0)'>Add option</a>
        </div>
        <div class="wps-form-block">
          <ul></ul>
        </div>
      </div>
      <hr>
      <div class="wps-form-block test-only">
        <div class='wps-heading'>
          <h5>Comments</h5>
        </div>
        <div class='wps-heading'>
          <h6>For right answer</h6>
        </div>
        <div>
          <textarea html-editor class='form-control' id="comment-for-right">&nbsp;</textarea>
        </div>
        <div class='wps-heading' style="margin-top: 10px;">
          <h6>For wrong answer</h6>
        </div>
        <div>
          <textarea html-editor class='form-control' id="comment-for-wrong">&nbsp;</textarea>
        </div>
        <hr>
      </div>
      <div class="wps-form-block">
        <div class='wps-heading'>
          <h5>Question image</h5>
          <a href='javascript:void(0)' class='wps-button' id="choose-from-library">Open library</a>
        </div>
        <div>
          <input class='form-control' id="image" placeholder="Insert image URL here or select pic from media library" value="<%= question.get('image') %>">
        </div>
        <div class="image-block">
          <div id='image-container-block'>
            <div id='image-container'>
              <img id="image-el" >
            </div>
          </div>
          <div class='image-params'>
            <div id='height-form' class='form-group'>
              <label>Height</label>
              <div>
                <span class="label" for="x">px:</span>
                <input id="height" class='form-control' value="300">
              </div>
            </div>
            <div id='ratio-form' class='form-group'>
              <label>Ratio</label>
              <div>
                <span class="label" for="x">x:</span>
                <input id="ratio-x" class='ratio-val form-control' value="3">
              </div>
              <div>
                <span class="label" for="y">y:</span>
                <input id="ratio-y" class='ratio-val form-control' value="4">
              </div>
            </div>
            <div id="freeze-ratio-container" class='form-group'>
              <div class="checkbox">
                <label><input type="checkbox" checked="checked" id="ratio-freeze" >&nbsp;Fix ratio</label>
              </div>
            </div>
          </div>
          <div class="clear" ></div>
        </div>
      </div>
      <div id="invalid-image-message">
        <p>Invalid image URL</p>
      </div>
      </div>
    <div class="survey-editor-tab" id="question-preview" style='display: none;'></div>
  </div>
</script>
