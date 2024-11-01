<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

?>
<style>
.wps-surveys .question-list-item {
  cursor: pointer;
}

.wps-surveys .question-list-item:hover {
  background: #eee;
}

.wps-surveys .question-list-item.selected {
  background: #0083aa;
  color: white;
}

.wps-surveys .question-list-item .item {
  overflow-x: hidden;
}

.wps-surveys .question-list-item:only-child .actions #delete {
  display: none;
}

.wps-surveys .question-list-item .wps-list-item .actions {
  top: 0px;
}

.wps-surveys .published .question-list-item .actions,
.wps-surveys .finished .question-list-item .actions {
  display: none !important;
}

</style>
<script type="text/template" id="question-list-item">
  <div class='wps-list-item'>
    <div class='order'>
      <span class="oi oi-grid-four-up change-order-pan"></span>
    </div>
    <div class='item' style='padding: 5px'>
      <span><%= question.get("wp_id") %></span>
    </div>
    <div class='actions'>
      <span id="delete" class='oi oi-trash'></span>
    </div>
  </div>
</script>
