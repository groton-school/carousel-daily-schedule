<?php

header('Access-Control-Allow-Origin: *');
$ics = file_get_contents($_GET['url']);
$ics = preg_replace("/(SUMMARY:).*(\r?\nCATEGORIES:)([^,]+)/m", "$1$3$2$3", $ics);
echo $ics;
