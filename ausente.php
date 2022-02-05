<?php
require_once('verificacao.php');
?>
<?php
include("config.php");
$conta = $_SESSION['login_id_conta'];
session_start();
$_SESSION['login_id_estatus'] = "2";

    mysql_query("UPDATE dados_membros SET id_estatus = '2' WHERE id_conta='$conta'");

    echo '<script> location.href="index.php"; </script>';
    exit();
?>