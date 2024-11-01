<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

?>
<style>

.wps-surveys .option-list-item:only-child .actions #delete {
  display: none;
}

.wps-surveys .option-list-item .wps-list-item .actions * {
  padding-top: 6px;
  padding-left: 0;
}

 .wps-surveys .option-list-item .wps-list-item .order  {
  top: 5px;
}

.wps-surveys .published .option-list-item .actions,
.wps-surveys .finished .option-list-item .actions {
  display: none !important;
}

.questionary .option-list-item input[type='radio'],
.test .option-list-item .change-order-pan {
  display: none;
}

.option-list-item .html-editor-container {
  transition: border 300ms;
}

.test .option-list-item.right-option .html-editor-container {
  border: 1px solid #ADA;
}

.test .option-list-item.wrong-option .html-editor-container {
  border: 1px solid #DAA;
}

</style>
<script type="text/template" id="option-list-item">
  <div class='wps-list-item' option-id='<%= option.get("_id") %>'>
    <div class='order'>
      <span class="oi oi-grid-four-up change-order-pan"></span>
      <input type="radio" name="right-answer-for-<%= question.get('_id') %>">
    </div>
    <div class='item'>
      <textarea html-editor class='form-control'></textarea>
    </div>
    <div class='actions'>
      <span id="delete" class='oi oi-trash'></span>
    </div>
  </div>
</script>
