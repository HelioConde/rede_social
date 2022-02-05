<?php
$admin_password = "1234"; // senha da área de administração (/admin)
$mysql_hostname = "localhost"; // servidor MySQL
$mysql_user = "root"; // usuário MySQL
$mysql_password = "1234"; // senha MySQL
$mysql_database = "redeJoven"; // banco de dados MySQL
$prefix = ""; // prefixo das tabelas (desnecessário)


$bd = mysql_connect($mysql_hostname, $mysql_user, $mysql_password) or die("Could not connect database");
mysql_select_db($mysql_database, $bd) or die("Could not select database");

$con = mysql_connect($mysql_hostname, $mysql_user, $mysql_password) or die("Could not connect database");
mysql_select_db($mysql_database, $con) or die("Could not select database");

$conn = mysql_connect($mysql_hostname, $mysql_user, $mysql_password) or die("Could not connect database");
mysql_select_db($mysql_database, $conn) or die("Could not select database");

$link = mysql_connect($mysql_hostname, $mysql_user, $mysql_password) or die("Could not connect database");
mysql_select_db($mysql_database, $link) or die("Could not select database");

$db = mysql_select_db($mysql_database) or die("Could not select database");

?>