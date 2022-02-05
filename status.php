<?php
require_once('verificacao.php');
?>
<script>

</script>
<?php
include("config.php");
$conta = $_SESSION['login_id_conta'];
session_start();
$_SESSION['login_id_estatus'] = "1";

$query  = mysql_query("SELECT * FROM dados_membros WHERE id_conta='$conta'");

   while($row = mysql_fetch_assoc($query)){
    if( $row['id_estatus'] >= date('Y-m-d H:i:s') ){
        echo 'online <span style="color:green"><i class="fas fa-circle"></i></span>';
    } else {
        echo 'offline <span style="color:#666"><i class="fas fa-circle"></i></span>';
    }
   }

    exit();
?>