<?php
require_once('verificacao.php');
?>
<?php

include("config.php");

$amigo = $_POST['amigo'];
$result = mysql_query("SELECT * FROM msg WHERE id_my='".$_SESSION['login_id_conta'] ."' AND id_friends='$amigo'");
$friend = mysql_query("SELECT * FROM dados_membros WHERE id_conta='$amigo' ORDER BY id_estatus ASC");
while($row2 = mysql_fetch_array($friend))
{
echo $row2['id_nome'].' '.$row2['id_sobre'];
}
while($row = mysql_fetch_array($result))
{
    echo '<br>';
    echo $row['id_msg'];
    echo '<br>';
    echo '<input type="text">';
}
mysql_close($con);


?>