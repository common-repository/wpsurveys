<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

$rate_bar_padding = '3px';
?>
<style>
.question-stat {
  padding: 15px 0;
}

.question-stat > div > *:not(:last-child) {
  float:left;
}

.question-stat .image-block {
  width: 30%;
  background: black;
  overflow: hidden;
}

.question-stat.no-image .image-block {
  width: 0%;
}

.question-stat .statistics {
  width: 70%;
}

.question-stat:not(.no-image) .statistics > div {
  padding-left: 25px;
}

.question-stat.no-image .statistics {
  width: 100%;
}

.question-stat .options li {
  list-style: none;
}

.question-stat .options {
  text-decoration: none !important;
  color: black;
}

.question-stat .options .option {
  position: relative;
  padding: .25em .5em;
  cursor: pointer;
  margin: <?php echo $rate_bar_padding; ?>;
}

.question-stat .options .option .rate {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  visibility: hidden;
}

.question-stat .options .option .rate {
  visibility: visible;
}

.question-stat .options .option .rate .bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background-color: rgba(0,100,255,.1);
  transition: width 500ms;
}

.question-stat .options .option .rate .stat {
  position: absolute;
  right: 0; top: 0; bottom: 0;
  padding: 4px;
}

.question-stat .options .option {
  cursor: inherit;
}

.question-stat .summary {
  padding: 10px 3px;
}

.question-stat #image {
  position: relative;
  transform: translateX(-50%);
  left: 50%;
  overflow: hidden;
}

.question-stat #image img {
  width: 100%;
}

</style>
<script type="text/template" id="question-stat">
  <div>
    <div class="image-block">
      <div id='image-container' style="position: relative; overflow: hidden;">
        <div id="image">
          <img src='<%= question.get("image") %>' >
        </div>
      </div>
    </div>
    <div class='statistics'>
      <div>
        <h4 id="text"></h4>
        <div class="options">
          <% _.each(options, function(opt) { %>
            <div class="option" _id="<%= opt._id %>">
                <div class="rate">
                  <div class="bar"></div>
                  <div class="stat">0%</div>
                </div>
                <div id="opt-text-<%= opt._id %>"></div>
            </div>
          <% }); %>
        </div>
        <div class='summary'>Total answers:&nbsp;<span class='val'><%= question.get("summary") %></span></div>
      </div>
    </div>
    <div class='clear'></div>
  </div>
</script>
