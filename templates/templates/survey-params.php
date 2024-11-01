<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

?>
<style>
  .wps-surveys .survey-params {
    position: relative;
  }

  .wps-surveys .survey-params.waiting > div:first-child {
    opacity: .3;
  }

  .wps-surveys .wps-editor-block {
    background: white;
    padding: 1em;
    margin-bottom: 1em;
  }

  .wps-surveys #block_survey_view > div {
    padding: 5px;
  }

  .wps-surveys #survey-editor-bar {
    float: left;
    width: 33.3%;
    padding-left: 1em;
    box-sizing: border-box;
  }

  .wps-surveys .wps-form-block {
    margin-bottom: 1em;
  }

  .wps-surveys #wp_id.wrong {
    background-color: rgba(255,0,0,.3);
    border-color: darkred;
    outline-color: rgba(255,0,0,.3);
  }

  .wps-surveys #survey-editor-main {
    float: left;
    width: 66.6%;
    min-height: 1px;
  }

  .wps-surveys #survey-editor-main #title {
    width: 100%;
  }

  .wps-surveys #survey-last-edit {
    transition: color 300ms;
  }

  .wps-surveys #survey-last-edit.just-saved {
    transition: color 0ms;
    color: white;
  }



  .wps-surveys .readonly input:not([type='radio']),
  .wps-surveys .readonly textarea,
  .wps-surveys .readonly button {
    background-color: white !important;
    outline: none !important;
    border-color: transparent !important;
    box-shadow: none !important;
  }

  .wps-surveys .readonly input[type='radio']:not([checked]) {
    display: none;
  }

  .wps-surveys .survey-params.public  #this-is-public,
  .wps-surveys .survey-params.demo  #this-is-demo {
    display: block !important;
  }

  .wps-surveys .survey-params #this-is-public,
  .wps-surveys .survey-params.demo #this-is-public,
  .wps-surveys .survey-params #this-is-demo,
  .wps-surveys .survey-params.draft #stat,
  .wps-surveys .survey-params.draft #finish,
  .wps-surveys .survey-params.draft #restart,
  .wps-surveys .survey-params.published #preview,
  .wps-surveys .survey-params.published #publish,
  .wps-surveys .survey-params.published #restart,
  .wps-surveys .survey-params:not(.published) #set-public,
  .wps-surveys .survey-params.finished #preview,
  .wps-surveys .survey-params.finished #publish,
  .wps-surveys .survey-params.finished #finish,
  .wps-surveys .survey-params.public #publish,
  .wps-surveys .survey-params.public #finish,
  .wps-surveys .survey-params.public #delete,
  .wps-surveys .survey-params.public #set-public {
    display: none !important;
  }

  .wps-surveys .readonly .wps-button {
    display: none;
    margin-right: 7px;
  }

  .wps-surveys .readonly .survey-status .wps-button {
    display: inline-block;
  }

  .wps-surveys .survey-params .wps-button-copy {
    top: 0 !important;
  }

  .wps-surveys #survey-title-container {
    background-color: white;
    border: 1px solid #ddd;
  }

  .wps-surveys #survey-title-container .html-editor {
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .wps-surveys .type input[type='radio'] {
    position: relative;
    top: -1px;
  }

  .wps-surveys .readonly.test #questionary-block,
  .wps-surveys .readonly.questionary #test-block {
    display: none;
  }

  .wrong .survey-status #status-actions.wps-button-block {
    opacity: .5;
  }

  .wrong #wp_id + .wps-button-copy {
    display: none !important;
  }
</style>
<script type="text/template" id="survey-params">
  <div>
    <div id="survey-editor-main">
      <div id='survey-title-container' class='input-group input-group-lg' style='margin-bottom: 1em;'>
        <textarea html-editor id="title">
          <%= survey.get('title') %>
        </textarea>
      </div>
      <div id="survey-question-view" class="wps-editor-block"></div>
    </div>
    <div id="survey-editor-bar">
      <div class="wps-editor-block survey-status">
        <div class="wps-form-block">
          <div id='status-actions' class='wps-button-block'>
            <a class='float-left wps-button' id="stat">Statistics</a>
            <a class='wps-button wps-button-primary' id="publish">Publish</a>
            <a class='wps-button wps-button-primary' id="finish">Finish</a>
            <a class='wps-button wps-button-primary' id="restart">Restart</a>
          </div>
          <div class='clear'></div>
        </div>
        <div class="wps-form-block">
          <div class="survey-element-id">
            <input id="wp_id" placeholder="survey-id">
            <div class='wps-button-copy' style="top: -1px !important; right: 5px;" description='Copy survey Id to clipboard and paste this string into the Post editor to add this survey to any post'>copy</div>
          </div>
        </div>
        <div class="wps-form-block">
          <div id='this-is-demo'>
            <strong>This is the DEMO survey</strong>&nbsp;
            <div style='display: inline-block;' class='wps-button-info' description="This survey is publicly available demo survey. It can't be finished, edited or deleted. This survey can be found in the Demo tab by any other user.">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
              </svg>
            </div>
          </div>
          <!-- <div  id='this-is-public'>
            <strong>This is the public survey</strong>&nbsp;
            <div style='display: inline-block;' class='wps-button-info' description="This survey is publicly available for all plugin users and can be published on other web sites. It can't be finished, edited or deleted. This survey can be found in the community tab by other users.">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
              </svg>
            </div>
          </div> -->
          <div>
            <strong>Status:&nbsp;</strong>
            <span id='survey-status'>-</span>
          </div>
          <div>
            <strong>Created:&nbsp;</strong>
            <span id='survey-created'>-</span>
          </div>
          <div>
            <strong>Last edit:&nbsp;</strong>
            <span id='survey-last-edit'>-</span>
          </div>
        </div>
        <div class="wps-form-block type">
          <div id='questionary-block'>
            <input id='questionary' type='radio' value='Questionary' name="post-type" >
            <label for='questionary'>Questionary</label>
          </div>
          <div id='test-block'>
            <input id='test' type='radio' value='Test' name="post-type" >
            <label for='test'>Test</label>
          </div>

        </div>
        <div class='wps-button-block'>
          <a class='wps-button wps-button-danger' id="delete">Delete</a>&nbsp;
          <!-- <a class='wps-button' id="set-public">Set public</a> -->
        </div>
        <div class='clear'></div>
      </div>
      <div class='wps-editor-block' id='question-list'>
        <div class="wps-form-block">
          <div class='wps-heading'>
            <h5>Questions</h5>
            <a class='wps-button' href='javascript:void(0)'>Add question</a>
            <div style="clear: both; display: block"></div>
          </div>
          <ul></ul>
        </div>
      </div>
    </div>
    <div class="clear"></div>
  </div>
  <!-- <div class='load-glass'>Saving in progress</div> -->
</script>
