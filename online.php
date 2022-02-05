<?php
require_once('verificacao.php');
?>
<?php
include("config.php");
$conta = $_SESSION['login_id_conta'];
session_start();
$_SESSION['login_id_estatus'] = "0";


mysql_query("UPDATE dados_membros SET id_estatus=DATE_SUB(NOW(), INTERVAL -5 MINUTE) WHERE id_conta='$conta'");
mysql_query("UPDATE dados_membros SET id_last=DATE_SUB(NOW(), INTERVAL 0 MINUTE) WHERE id_conta='$conta'");
    exit();
?>