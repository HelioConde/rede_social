
<?php
	require_once('verificacao.php');
?>
<?php
include("config.php");
$friend1=$_GET['friend1'];
$friend2=$_GET['friend2'];

mysql_query("UPDATE amigoslista SET status = 'accepted' WHERE id_friends='$friend1'");
mysql_query("UPDATE amigoslista SET status = 'accepted' WHERE id_friends='$friend2'");

echo '<script> location.href="solicitacao.php"; </script>';
exit();
?>

