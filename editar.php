<?php
require_once('verificacao.php');
?>
<?php
include("config.php");

$cep = $_POST['cep'];
$bairro = $_POST['bairro'];
$cidade = $_POST['cidade'];
$uf = $_POST['uf'];

mysql_query("UPDATE dados_membros SET id_cep='$cep', id_bairro='$bairro', id_cidade='$cidade', id_estado='$uf' WHERE id_conta='".$_SESSION['login_id_conta'] ."'");
?>