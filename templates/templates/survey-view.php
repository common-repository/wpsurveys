<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

$butt_size="120px";
?>
<style>

.survey-view * {
}

.preview-label, .not-published {
  font-size: 80%;
  text-align: center;
}

.survey-buttons {
  text-align: center;
  margin: 5px;
}

.survey-buttons * {
  padding: 3px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.survey-buttons .back, .survey-buttons .forth {
  font-size: 130%;
  cursor: pointer;
  transition: opacity 300ms;
}

.survey-buttons .back.fade, .survey-buttons .forth.fade {
  opacity: 0;
  cursor: default;
}

.survey-view .back, .survey-view .forth {
  vertical-align: center;
}

.survey-view .question_index {
  font-weight: bold;
  font-size: 150%;
}

#survey-results-stat {
  text-align: center;
}

#survey-results-stat span {
  padding: 3px;
  font-size: 150%;
}

#survey-results-stat .right-answers {
  color: green;
}

</style>
<script type="text/template" id="survey-view">
  <div>
    <div id="survey-title">
      <h1><%= survey.get("title") %></h1>
      <div class="not-published">(This is preview. Survey is not published yet)</div>
    </div>
    <div class="survey-buttons">
      <span class="back fade">&larr;</span>
      <span class='success-rate'>&bull;</span>
      <span class="question_counter">
        <span class="question_index">0</span style="font-size: 100%"> / <span class="from_questions">0</span>
      </span>
      <span class="forth fade">&rarr;</span>
    </div>
    <div id="survey-main"></div>
    <div id="survey-results">
      <div id="survey-results-stat">
        <span class="right-answers">0</span><span>&nbsp;/&nbsp;</span><span class="questions-number">0</span>
      </div>
      <div id="survey-results-answers"></div>
    </div>
    <div class="survey-buttons">
      <span class="back fade">&larr;</span>
        <span class='success-rate'>&bull;</span>
      <span class="question_counter">
        <span class="question_index">0</span><span>/</span><span class="from_questions">0</span>
      </span>
      <span class="forth fade">&rarr;</span>
    </div>
    </div>
    <div class="preview-label">(You are logged in as administrator, so your answers are not counted :) )</div>
  </div>
</script>
