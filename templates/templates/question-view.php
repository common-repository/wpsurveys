<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}


$rate_bar_padding = '3px';
?>
<style>

.question-view img {
  width: 100%;
}

.question-view-results {
  padding-top: 2em;
}

.question-view .options li {
  list-style: none;
}

.question-view .options {
  text-decoration: none !important;
  color: black;
}

.question-view-results .option,
.question-view .options .option {
  position: relative;
  padding: .25em .5em;
  margin: <?php echo $rate_bar_padding; ?>;
}

.question-view .options .option {
  cursor: pointer;
}

.question-view .options .option .rate {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  visibility: hidden;
}

.question-view.answered .options .option .rate {
  visibility: visible;
}

.question-view.answered .options .option.my-answer .rate .bar {
  background-color: rgba(0,100,255,.3);
}

.test .question-view-results .option.right,
.test .question-view .options .option.right .rate .bar {
  background-color: rgba(100,255,100,.2);
}

.test .question-view-results .option.wrong,
.test .question-view .options .option.wrong .rate .bar {
  background-color: rgba(255,100,100,.2);
}

.test .question-view .options .option .rate .bar {
  width: 100% !important;
  background-color: transparent;
}

.question-view .options .option .rate .bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background-color: rgba(0,100,255,.1);
  transition: width 500ms, background-color 500ms;
}

.question-view .options .option .rate .stat {
  position: absolute;
  right: 0; top: 0; bottom: 0;
  padding: 5px 7px;
}

.test .question-view .options .option .rate .stat {
  display: none;
}

.question-view:not(.answered) .options .option:hover {
    background: rgba(0,0,0,.7);
    color: white;
    /* transition: background-color 250ms; */
}

.question-view.answered .options .option {
  cursor: inherit;
}

.question-view-results .option-border,
.question-view .options .option-border {
  position: relative;
  border-bottom: 1px solid #bbb;
  margin: 5px 0;
  left: 16%;
  width: 66%;
}

.question-view-results .option-border:last-child,
.question-view .options .option-border:last-child {
  display: none;
}

.question-view .summary {
  padding: 10px 3px;
  font-size: 80%;
  float: right;
}

.question-view #image-container {
  margin: 25px;
}

.question-view #image {
  position: relative;
  transform: translateX(-50%);
  left: 50%;
  overflow: hidden;
}

.question-view-results .answer-comment-container,
.question-view .answer-comment-container {
  padding: 2em 2em 0 2em;
  text-align: center;
  display: none;
}

</style>
<script type="text/template" id="question-view">
  <div>
    <div id='image-container' style="position: relative; overflow: hidden;">
      <div id="image">
        <img src='<%= question.get("image") %>' >
      </div>
    </div>
    <h4><%= question.get("text") %></h4>
    <div class="options">
      <% _.each(options, function(opt) { %>
        <div class="option" _id="<%= opt._id %>">
            <div class="rate">
              <div class="bar"></div>
              <div class="stat">0%</div>
            </div>
            <div style="position: relative"><span style='font-size: 100%'>&bull;&nbsp;</span><div style='display: inline-block'><%= opt.text %></div></div>
        </div>
        <div class="option-border"></div>
      <% }); %>
    </div>
    <div class='answer-comment-container'><p class="answer-comment"></p></div>
    <div class='summary'>[<span class='val'><%= question.get("summary") %></span>]</div>
    <div class="clear" ></div>
  </div>
</script>

<script type="text/template" id="question-view-results">
  <div>
    <h4><%= question.get("text") %></h4>
    <div class="options">
        <div class="option right"></div>
        <div class="option-border"></div>
        <div class="option wrong"></div>
    </div>
    <div class='answer-comment-container'><p class="answer-comment"></p></div>
    <div class="clear" ></div>
  </div>
</script>
