<?php
namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

wp_enqueue_media();
req_survtemplate("lib/bootstrap.php");
req_survtemplate_style("admin.php");
req_survtemplate("templates/option-item.php");
req_survtemplate("templates/question-view.php");
req_survtemplate("templates/question-editor.php");
req_survtemplate("templates/image-ratio-helper.php");
req_survtemplate("templates/question-item.php");
req_survtemplate("templates/survey-item.php");
req_survtemplate("templates/survey-params.php");
req_survtemplate("templates/html-editor.php");
req_survtemplate("templates/admin-breadcrumbs.php");
req_survtemplate("templates/survey-stat.php");
req_survtemplate("templates/question-stat.php");
?>
<style>
  .wps-surveys .survey-table-item #title .val {
    cursor: pointer;
  }
  .wps-surveys .survey-table-item .survey-actions * {
    font-size: 95%;
  }

  .wps-surveys .internet-issue {
    position: fixed;
    bottom: 50px;
    left: 50%;
    margin-left: -200px;
    width: 400px;
    text-align: center;
    background: #B44;
    color: white;
    box-shadow: 0 0 1px #600;
    opacity: 0;
    height: 0;
    padding: 0;
    transition: opacity 1000ms, height 0ms linear 1000ms, padding 0ms linear 1000ms;
    overflow: hidden;
  }

  .wps-surveys .internet-issue.flash {
    height: 35px;
    line-height: 25px;
    padding: 5px;
    opacity: 1;
    transition: opacity 100ms;
  }

  .wps-surveys .survey-table-item[status^='draft'] .survey-actions #stat,
  .wps-surveys .survey-table-item[status^='draft'] .survey-actions #finish,
  .wps-surveys .survey-table-item[status^='draft'] .survey-actions #restart,
  .wps-surveys .survey-table-item[status^='finished'] .survey-actions #publish,
  .wps-surveys .survey-table-item[status^='finished'] .survey-actions #finish,
  .wps-surveys .survey-table-item[status^='finished'] .survey-actions #edit,
  .wps-surveys .survey-table-item[status^='published'] .survey-actions #publish,
  .wps-surveys .survey-table-item[status^='published'] .survey-actions #edit,
  .wps-surveys .survey-table-item[status^='published'] .survey-actions #restart,
  .wps-surveys .survey-table-item[status^='demo'] .survey-actions #edit,
  .wps-surveys .survey-table-item[status^='demo'] .survey-actions #finish,
  .wps-surveys .survey-table-item[status^='demo'] .survey-actions #publish,
  .wps-surveys .survey-table-item[status^='demo'] .survey-actions #restart,
  .wps-surveys .survey-table-item[status^='demo'] .survey-actions #delete
  /* .wps-surveys .survey-table-item[status^='public'] .survey-actions #finish,
  .wps-surveys .survey-table-item[status^='public'] .survey-actions #edit,
  .wps-surveys .survey-table-item[status^='public'] .survey-actions #publish,
  .wps-surveys .survey-table-item[status^='public'] .survey-actions #restart,
  .wps-surveys .survey-table-item[status^='public'] .survey-actions #delete,
  .wps-surveys .survey-table-item[status^='public'] .survey-actions #finish */
  {
    display: none;
  }

  .wps-surveys .survey-table-item .survey-actions span[id] span {
    opacity: .5;
  }

  .wps-surveys .survey-table-item .survey-actions span#delete a {
    color: #F04400;
  }

  .wps-surveys .survey-table-item .survey-actions span#delete a:hover {
    color: #B00000;
  }

  .wps-surveys .wps-heading {
    margin-bottom: 5px;
  }
  .wps-surveys .wps-heading * {
    display: inline-block;
    margin-right: 5px;
  }

  .wps-surveys .wps-heading::after {
    clear: both;
  }

  .wps-surveys .wps-body {
    position: relative;
  }

  .wps-surveys a.wps-button, .wps-surveys button.wps-button {
    display: inline-block;
    background: #f7f7f7;
    color: #0073aa;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid #ccc;
    border-radius: 2px;
    text-decoration: none;
    position: relative;
    top: -2px;
    padding: 6px 8px;
    float: right;
    cursor: pointer;
  }

  .wps-surveys .wps-button-block::after {
    clear: both;
  }

  .wps-surveys .wps-button:hover,
  .wps-surveys .wps-button.wps-button-primary {
    color: #fff !important;
    background: #0083c2;
    border-color: #0083c2;
  }

  .wps-surveys .wps-button.wps-button-primary:hover {
    color: #fff;
    background: #005088;
    border-color: #0083c:
  }

  .wps-surveys .wps-button.wps-button-danger {
    color: #F04400;
    border-color: #FDA;
  }

  .wps-surveys .wps-button.wps-button-danger:hover {
    background: #F04400;
    color: white;
  }

  .wps-surveys .wps-list-heading a.selected {
    color: inherit;
  }

  .wps-surveys .wps-filter a {
    font-size: 90%;
    outline: none !important;
    display: inline-block;
  }

  .wps-surveys .wps-filter a span, .wps-surveys .wps-filter a.selected {
    color: #444;
  }

  table td[colspan] * {
    margin: 0;
    padding: 0;
  }

  table tr.only-row {
    background: #23282d !important;
    color: white;
  }

</style>
<div class="wps-surveys waiting">
  <div class="wps-body">
    <div id='notifications-block'></div>
    <div id='navigation'>
    </div>
    <div>
      <div class='wps-page' id='list' style='display: none'>
        <div class='wps-filter'>
          <a class='selected' id='all' href='javascript:void(0)'>All <span>(<span class='val'>0</span>)</span></a> |
          <a id='published' href='javascript:void(0)'>Published <span>(<span class='val'>0</span>)</span></a> |
          <a id='draft' href='javascript:void(0)'>Drafts <span>(<span class='val'>0</span>)</span></a> |
          <a id='finished' href='javascript:void(0)'>Finished <span>(<span class='val'>0</span>)</span></a> |
          <a id='public_and_demo' href='javascript:void(0)'>Demo <span>(<span class='val'>0</span>)</span></a>
        </div>
        <br>
        <div id="private-surveys-list">
          <table class='table table-condensed table-striped'>
            <thead>
              <tr>
                <th width="1%">#</th>
                <th width="40%">Title</th>
                <th width="19%">Id</th>
                <th width="1%">Type</th>
                <th width="1%">Questions</th>
                <th width="1%">Votes</th>
                <th width="20%">Status</th>
              </tr>
            </thead>
            <tbody id="private-list">
              <tr id='empty_list' style='background: transparent;'><td colspan=4>No surveys to show</td></tr>
            </tbody>
          </table>
        </div>
        <div id="public-and-demo-surveys-list">
          <div id="surveys-list-head">
            <table class='table table-condensed table-striped'>
              <thead>
                <tr>
                  <th width="1%">#</th>
                  <th width="40%">Title</th>
                  <th width="19%">Id</th>
                  <th width="1%">Type</th>
                  <th width="1%">Questions</th>
                  <th width="1%">Votes</th>
                  <th width="20%">Status</th>
                </tr>
              </thead>
              <!-- <tbody>
                <tr class='only-row'><td colspan="7"><h5>Demo surveys</h5></td></tr>
              </tbody> -->
              <tbody id="demo-list">
                <tr id='empty_list' style='background: transparent;'><td colspan=4>There are no demo surveys yet</td></tr>
              </tbody>
              <!-- <tbody>
                <tr class='only-row'><td colspan="7"><h5>Community surveys</h5></td></tr>
              </tbody>
              <tbody id="public-list">
                <tr id='empty_list' style='background: transparent;'><td colspan=4>There are no publicly available surveys yet</td></tr>
              </tbody> -->
            </table>
          </div>
          <!-- <div id="demo-surveys-list">

          </div>
          <div id="public-surveys-list">

            </table>
          </div> -->
        </div>
      </div>
      <div class='wps-page' id='edit' style='display: none'>
        <div id='block_survey_view'></div>
      </div>
      <div class='wps-page' id='preview' style='display: none'>
      </div>
      <div class='wps-page' id='stat' style='display: none'>
      </div>
      <div class='wps-page' id='about' style='display: none'>
      </div>
    </div>
  </div>
  <div class='load-glass'>Loading surveys</div>
  <div class='internet-issue'>Can't connect to the Surveys server</div>
</div>
<?php
  req_survtemplate_script("admin.php");
?>
