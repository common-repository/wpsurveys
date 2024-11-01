<?php

namespace PLUGIN_WORKSPACE_NAME;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

$rate_bar_padding = '3px';
?>
<style>
.survey-stat #raw-logs-lines {
  width: 100%;
  height: 100%;
  padding: 15px;
  background: black;
  overflow-y: auto;
}

.survey-stat #raw-logs-lines .survey-stat-log {
  width: 100%;
  padding: 5px;
  color: white;
  font-weight: bold;
  text-overflow: ellipsis;
}

.survey-stat .nav .nav-link {
  outline: none;
  box-shadow: none;
}

.survey-stat .nav .nav-link.active {
  color: black;
}

.stats-block {
  background: white;
  position: relative;
  padding: 15px 20px;
  margin-bottom: 10px;
}

.stats-block-head {
  cursor: pointer;
}

.stats-block .stats-collapse {
  color: black;
  outline: none;
  box-shadow: none;
}

.stats-block .stats-block-head * {
  margin: 0;
  padding: 0;
}

.stats-block .stats-collapse span {
  position: absolute;
  top: 25px;
  right: 35px;
  font-size: 80%;
  transition: transform 500ms;
}

.collapsed .stats-block .stats-collapse span {
  transform: rotate(90deg);
}

.stats-block .stats-block-body {
  transition: max-height 500ms  ease-in;
  max-height: 1000px;
  overflow: hidden;
}

.stats-block-body .popular-answer {
  padding: 3px 10px;
}

.stats-block .timeline-container {
  position: relative;
  height: 300px;
}

.collapsed .stats-block .stats-block-body {
  transition: max-height 500ms  ease-out;
  max-height: 0;
}

</style>

<script type="text/template" id="survey-stat">
  <div id='stats-nav'>
    <ul class="nav">
      <!-- <li class='nav-item'> -->
        <!-- <a class='nav-link active' href="javascript:void(0);" for="survey-vote-stats">Vote stats</a> -->
      <!-- </li> -->
      <!-- <li class='nav-item'> -->
        <!-- <a class='nav-link' href="javascript:void(0);" for="survey-history">Actions history</a> -->
      <!-- </li> -->
    </ul>
  </div>
  <div class='stats-page' id='survey-history' style='display: none'></div>
  <div class='stats-page' id='survey-vote-stats'>
  </div>
</script>

<script type='text/template' id='question-bar'>
  <div class='stats-block'>
    <div class='stats-block-head'>
      <a class='stats-collapse' href='javascript:void(0)'>
        <span class='oi oi-chevron-bottom'></span>
        <h4><%= getText(model.get("text")) %></h4>
      </a>
    </div>
    <div class='stats-block-body'></div>
  </div>
</script>

<script type="text/template" id="summary-survey-stats-bar">
  <div class='stats-block'>
    <div class='stats-block-head'>
      <a class='stats-collapse' href='javascript:void(0)'>
      <span class='oi oi-chevron-bottom'></span>
        <h4>Summary stats of survey</h4>
      </a>
    </div>
    <div class='stats-block-body'>
      <br>
      <h5>Most popular answers</h5>
      <% questions.each(function (q) { %>
        <div class='popular-answer'>
          <% let popular = getPopularAnswersForQuestion(q); %>
          <% if (popular.length === 0) { %>
            <strong><%= getText(q.get("text")) %></strong><span>: No answers yet</span>
          <% } else if (popular.length === 1) { %>
            <strong><%= getText(q.get("text")) %></strong><span>: <%= getText(popular[0].text) %></span>
          <% } %>
        </div>
      <%} ); %>
      <hr>
      <h5>Votes timeline</h5>
      <div class='timeline-container'>
        <canvas id='timeline'></canvas>
      </div>
      <!-- <hr> -->
      <!-- <h4>Survey geography</h4>
      <div id='map'></div> -->
    </div>
    <!-- <div class="options">
        <div class="option right"></div>
        <div class="option-border"></div>
        <div class="option wrong"></div>
    </div>
    <div class='answer-comment-container'><p class="answer-comment"></p></div>
    <div class="clear"></div> -->
  </div>
</script>

<script type="text/template" id="summary-survey-stats">
  <div>
    <h4><%= question.get("text") %></h4>
    <div class="options">
        <div class="option right"></div>
        <div class="option-border"></div>
        <div class="option wrong"></div>
    </div>
    <div class='answer-comment-container'><p class="answer-comment"></p></div>
    <div class="clear"></div>
  </div>
</script>

<!-- <script type="text/template" id="survey-stat-log">
  <div>
    <span data-val='ts'><%= new Date(ts).toLocaleString() %></span>&nbsp;::&nbsp;
    <span data-val='admin' style="display: none">ADMIN&nbsp;::&nbsp;</span>
    <span data-val='ip'><%= ip %></span>&nbsp;::&nbsp;
    <span data-val='status_code'><%= status_code %></span>&nbsp;::&nbsp;
    <span data-val='request'><%= request.split("?")[0] %></span>&nbsp;::&nbsp;
    <span data-val='user_agent'><%= user_agent %></span>
  </div>
</script> -->
