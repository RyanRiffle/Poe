<?php
    if ($_GET["family"]) {
        $data = file_get_contents ("http://fonts.googleapis.com/css?family=" . $_GET["family"]);
        return data;
    }
?>