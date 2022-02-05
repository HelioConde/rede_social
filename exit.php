
<?php
require_once('verificacao.php');
session_start();
session_unset(); 
session_destroy();
echo '<script> location.href="home.php"; </script>';
exit();
?>