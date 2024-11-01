<?php
/**
 * @package WPSurveys
 * @version 0.2.8.3
 */
/*

Plugin Name: WPSurveys
Plugin URI: https://mysurveys.space/
Description: This plugin helps you to run survey on your WordPress site. Surveys are hosted on mysurveys.space. 
Version: 0.2.8.3
Author: WPSurveys
License: GPLv2 or later
Text Domain: wpsurveys
*/

/*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

Copyright 2019 Automattic, Inc.
*/
namespace WP_SURVEYS_wpsurveys;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

function survfile($file) {
  return dirname(__FILE__) ."/". $file;
}

$files = array(
  "log.php",
  "lib.php",
  "constants.php",
  "register.php",
  "admin_menu.php",
  "posts.php"
);

foreach ($files as $i => $file) {
  require(survfile($file));
}
?>
