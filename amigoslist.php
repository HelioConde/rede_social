<?php
include("config.php");

$resultado = mysql_query("SELECT * FROM amigoslista WHERE status='accepted'");

$data = array();
while($resultado2 = mysql_fetch_assoc($resultado)){
    $data[] = $resultado2;
}

echo json_encode($data);
?>