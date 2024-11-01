<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

?>
<style>

.html-editor-container {
  position: relative;
  border: 1px solid #eee;
}

.html-editor-container .richText .richText-initial {
  background: white;
  color: black;
}

.html-editor-container [html-editor] {
  opacity: 0;
  height: 0; width: 0; padding: 0; margin: 0; border: 0;
}

.html-editor-container.focus [html-editor] {
  opacity: 1;
}

.html-editor-container .html-editor:hover {
  background: rgba(200,225,255,.25);
  cursor: text;
}

.html-editor .html-editor-input {
  padding: .5em;
}

.richText * {
  z-index: 100000000;
}

</style>
<script type="text/template" id="html-editor">
  <div class='html-editor-input'></div>
</script>
