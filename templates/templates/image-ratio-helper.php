<?php

namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

?>

<style>
.image-block #image-container .ratio-helper {
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
}

.image-block #image-container .ratio-helper > div {
  position: absolute;
  opacity: .5;
}

.image-block #image-container .ratio-helper .position-window {
  opacity: .8;
  background: transparent;
  cursor: move;
}

.published .image-block #image-container .ratio-helper .position-window,
.finished .image-block #image-container .ratio-helper .position-window,
.published .image-block #image-container .ratio-helper .handle,
.finished .image-block #image-container .ratio-helper .handle {
  display: none;
}

.image-block #image-container .ratio-helper > div.back {
  background: black;
}

.image-block #image-container .ratio-helper > .handle {
  border: solid 1px black;
  background: white;
  width: 10px; height: 10px;
  cursor: move;
}

.image-block #image-container .ratio-helper > .top {
  left: 0; right: 0; top: 0;
}

.image-block #image-container .ratio-helper > .bottom {
  left: 0; right: 0; bottom: 0;
}

.image-block #image-container .ratio-helper > .left {
  left: 0;
  top: 30%;
  bottom: 30%;
}

.image-block #image-container.ratio {
  cursor: move;
}

.image-block #image-container .ratio-helper > .right {
  right: 0;
  top: 30%;
  bottom: 30%;
}

.image-block #image-container .ratio-helper > .left-top {
  top: 30%; left: 30%;
}

.image-block #image-container .ratio-helper > .left-bottom {
  bottom: 30%; left: 30%;
}

.image-block #image-container .ratio-helper > .right-top {
  top: 30%; right: 30%;
}

.image-block #image-container .ratio-helper > .right-bottom {
  bottom: 30%; right: 30%;
}
</style>
<script  type="text/template" id="ratio-helper">
  <div class="back left"></div><div class="back right"></div><div class="back top"></div><div class="back bottom"></div>
  <div class="position-window" ></div>
  <div class="handle left-top"></div><div class="handle right-top"></div><div class="handle right-bottom"></div><div class="handle left-bottom"></div>
</script>
