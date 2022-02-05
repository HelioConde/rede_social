<?php
require_once('verificacao.php');
?>
<?php
 if($_SESSION['login_id_img'] == 'uploadedimage/defoult.jpg'){
    echo '<script> location.href="    uploudPerfil.php"; </script>';
    exit();
 }
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Bem Vindo -
        <?php echo $_SESSION['login_id_nome'];?>
    </title>
    <script src="js/all.js"></script>
    <link rel="stylesheet" href="css/dsiner.css">
</head>
<style>
    body{
    background-image: url("img/bg.jpg");
    background-repeat: no-repeat;
    background-size: 100% 670px;
    }
</style>

<body>
    <div id="nav">
        <nav>
            <div class="left-nav">
                <div>
                    <a href="index.php">
                        <div id="logo">
                            <div><img src="img/logo.png"></div>
                        </div>
                    </a>
                </div>
                <div class="search">
                    <div>
                        <form action="pesquisa.php" method="GET">
                            <button type='submit'><i class="fas fa-search"></i></button>
                            <div>
                                <input type='text' name="query" class="textfield" placeholder='O que você precisa?'>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="right-nav">
                <div>
                    <?php echo $_SESSION['login_id_nome'];?> <?php echo $_SESSION['login_id_sobre'];?>
                </div>
                <div>
                    <a>Perfil</a>
                </div>
                <div>
                    <a href="index.php">
                        <i class="fas fa-home"></i>
                    </a>
                </div>
                <a href="solicitacao.php">
                <div>
                    <i class="fas fa-user-friends"></i>
                    <?php
include("config.php");

$result = mysql_query("SELECT * FROM amigoslista WHERE id='".$_SESSION['login_id_conta'] ."' and status='pending'");

	$numberOfRows = MYSQL_NUMROWS($result);	
    if ($numberOfRows == 0){

    }else {
    echo '<font size="2" color="red"><b>+' . $numberOfRows . '</b></font>'; 
    }
	?>
                </div>
                </a>
   
                <span id="drop">
                    <span class="dropdown">
                        <div class="btn btn-default dropdown-toggle" data-toggle="dropdown"><i class="fas fa-sort-down"></i></div>
                        <ul class="dropdown-menu">
                            <li><a tabindex="-1" href="#">Configurações</a></li>
                            <li><a href="exit.php">Sair</a></li>
                        </ul>
                    </span>
                </span>
            </div>
        </nav>
    </div>
    <main>
        <div id="nav-left">
            <div class="perfil-img">
                <img src="<?php echo $_SESSION['login_id_img'];?>">
                <br>
                <?php echo $_SESSION['login_id_nome'];?>
                <?php echo $_SESSION['login_id_sobre'];?>
            </div>
            <div class="fundo">
                <a href="messages.php">
                    <ul>
                        <li>Mensagens</li>
                        <li><img src="images/messages.png" width="15" height="15" border="0" />
                </a>
                </li>
                </ul>
            </div>
            <a href="solicitacao.php">
            <div class="amigos1">
                <ul>
                    <li>Amigos</li>
                    <li> <img src="images/Untitled-1.png" width="15" height="15" border="0" />
                    </li>
                </ul>
            </div>
                    </a>
            <span id="drop">
            <span class="dropdown">
					<div class="btn btn-default dropdown-toggle" data-toggle="dropdown"><a href="#" class="status">Estatus</a>            <a>
        <?php 
			if ($_SESSION['SESS_Status_ID'] == 0){
				echo 'Online';
			} elseif($_SESSION['SESS_Status_ID'] == 1){
				echo 'Ocupado';
			} elseif($_SESSION['SESS_Status_ID'] == 2){
				echo 'Ausente';
			}
        ?>
        </a></div>
            <ul class="dropdown-menu dropdown2">
                
                <li>
					<form action="online.php" method="POST" >
						<input type="submit" value="Online"/>    
					</form>          
				</li>
				<li>					
					<form action="ocupado.php" method="POST" >
						<input type="submit" value="Ocupado">    
					</form>               
				</li>
				<li>
				<form action="ausente.php" method="POST" >
						<input type="submit" value="Ausente"/>    
					</form>               
				</li>

            </ul>
            <span id="buttonPRF"><i class="fas fa-sort-down"></i></span>
        </div>
        <div class="button2">
        <span id="buttonPRF2"><i class="fas fa-sort-down"></i></span>
        </div>
        </div>
        
        </div>
        
        </div>
        <div id="navCenter">
        <br>
<?php
include("config.php");

$result = mysql_query("SELECT * FROM amigoslista WHERE id='".$_SESSION['login_id_conta'] ."' and status='pending'");
$result2 = mysql_query("SELECT * FROM amigoslista WHERE myfriends='".$_SESSION['login_id_conta'] ."' and status='paring'");
$result3 = mysql_query("SELECT * FROM amigoslista WHERE id='".$_SESSION['login_id_conta'] ."' and status='pending'");
$row3 = mysql_fetch_array($result3);
if ($row3["myfriends"] == 0){
}else {
echo '<hr>';
echo '<div id="addAmigo">Adicionar aos amigos?</div>';
echo '<hr>';
}
while($row = mysql_fetch_array($result))
{
    $id = $row['myfriends'];
    $friend = mysql_query("SELECT * FROM dados_membros WHERE id_conta='$id'");
    while($row2 = mysql_fetch_array($friend))
    {
        
        $row3 = mysql_fetch_array($result2);
  		echo '<div class="addFriend"><ul><li><img src="'.$row2['id_img'].'"><br>';
		echo $row2['id_nome']." ".$row2['id_sobre'];
        echo '<form action="aceitaramigo.php" method="get">';
        echo '<input type="hidden" name="friend1"  id="name" value="'. $row["id_friends"].'"/>';
        echo '<input type="hidden" name="friend2" value="'. $row3["id_friends"] .'">'; 
        echo'<input name="addfriend" type="submit" value="Aceitar" class="greenButton" /><li></ul>';
        echo '</form></div>';
    }
}


mysql_close($con);

?>
    <br>
    <br>
    <hr>
    <div>Amigos</div>
    <hr>
    <br>
	<?php
include("config.php");

$result = mysql_query("SELECT * FROM amigoslista WHERE id='".$_SESSION['login_id_conta'] ."' and status='accepted'");
while($row = mysql_fetch_array($result))
  {
    $idAmigo = $row['myfriends'];
    $result2 = mysql_query("SELECT * FROM dados_membros WHERE id_conta='$idAmigo'");
    $row2 = mysql_fetch_array($result2);
    echo "<div class='amigoslista'>";
    echo "<img alt='Unable to View' src='" . $row2["id_img"] . "'>";
    echo '<a href=remarks.php?id=' . $row["id_friends"] . '>' . $row2['id_nome']." " . $row2['id_sobre'] . '</a></div>';
  }

mysql_close($con);
?>
        </div>
        <div id="nav-right">
            <span id="buttonAMG"><i class="fas fa-sort-down"></i></span>
            <br>
            <div>Amigos</div>
            <div>
                Aqui
                <br>
                fica
                <br>
                amigos
                <br>
                online
                <br>
                como não tenho muitos amigos a lista esta pequena
            </div>
        </div>
        <div class="button3">
        <span id="buttonAMG2"><i class="fas fa-sort-down"></i></span>
        </div>
    </main>

</body>

<script src="js/jquery.js"></script>
<script src="js/script.js"></script>

</html>