<?php
  $file_name =  $_FILES['file']['name'];
  $tmp_name = $_FILES['file']['tmp_name'];
  $file_up_name = time().$file_name;
  move_uploaded_file($tmp_name, "/Users/Aaron/Documents/Dudagon/iot-dude-device/UF/php/files/".$file_up_name);
?>