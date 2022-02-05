<?php
require_once('verificacao.php');
?>
<?php
include("config.php");

$result = mysql_query("SELECT * FROM amigoslista WHERE id='".$_SESSION['login_id_conta'] ."'and status='accepted'");
while($row = mysql_fetch_array($result))
{
    $id = $row['myfriends'];
    $friend = mysql_query("SELECT * FROM dados_membros WHERE id_conta='$id' ORDER BY id_estatus ASC");
    while($row2 = mysql_fetch_array($friend))
    {
        if( $row2['id_estatus'] >= date('Y-m-d H:i:s') ){
            echo '<form action="aceitaramigo.php" method="get">';
            echo '<input type="hidden" name="friend1"  id="name" value="'. $row["id_friends"].'"/>';
            echo '<input type="hidden" name="friend2" value="'. $row3["id_friends"] .'">'; 
            echo '<div>';
            echo $row2['id_nome']." ".$row2['id_sobre'];
        echo '<span style="color:green"><i class="fas fa-circle"></i></span>';
        echo '</div></form>';
        }
}
}
mysql_close($con);

?>
            <?php
include("config.php");

$result = mysql_query("SELECT * FROM amigoslista WHERE id='".$_SESSION['login_id_conta'] ."'and status='accepted'");
while($row = mysql_fetch_array($result))
{
    $id = $row['myfriends'];
    $friend = mysql_query("SELECT * FROM dados_membros WHERE id_conta='$id' ORDER BY id_estatus ASC");
    while($row2 = mysql_fetch_array($friend))
    {
        if( $row2['id_estatus'] <= date('Y-m-d H:i:s') ){
            echo '<div class="id_msg">';
            echo '<input type="hidden" name="friend1"  id="name" value="'. $row2["id_conta"].'"/>';
            echo $row2['id_nome']." ".$row2['id_sobre'];
        echo '<span style="color:#666"><i class="fas fa-circle"></i></span>';
        echo '</div></form>';
        }
}
}
mysql_close($con);

?>
<script>
    $(".id_msg").on('click',function(){
        
        $(".msg").append('<div class="msg_id"></div>')
        amigo = $("input", this).attr('value');
        $.ajax({
        method: "post",
        url: "amigosmsg.php",
        data: { 'amigo': amigo },
        success: function (amigos) {
            $(".msg_id").append(amigos);
        }
    });
    })
</script>