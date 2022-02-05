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
    <script src="js/jquery.js"></script>
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
            <a href="perfil.php">
                <div>
                    <?php echo $_SESSION['login_id_nome'];?>  <?php echo $_SESSION['login_id_sobre'];?> <i class="fas fa-user"></i>
                </div>
                </a>
                <a href="index.php">
                <div>
                        <i class="fas fa-home"></i>
                </div>
                </a>
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
        <a href="myphoto.php">
            <div class="perfil-img">
                <img src="<?php echo $_SESSION['login_id_img'];?>">
                <br>
                <?php echo $_SESSION['login_id_nome'];?>
                <?php echo $_SESSION['login_id_sobre'];?>
            </div>
            </a>
            <div class="fundo">
                <a href="messages.php">
                    <ul>
                        <li>Mensagens</li>
                        <li><i class="far fa-envelope"></i></li>
                    </ul>
                </a>
            </div>
            <a href="solicitacao.php">
            <div class="amigos1">
                <ul>
                    <li>Amigos</li>
                    <li> <i class="fas fa-user-friends"></i>
                </ul>
            </div>
            </a>
            <div>
<a href="#" class="status">Estatus<div class="status2"></div></a>
</div>
            <span id="buttonPRF"><i class="fas fa-sort-down"></i></span>
        </div>
        <div class="button2">
        <span id="buttonPRF2"><i class="fas fa-sort-down"></i></span>
        </div>
        </div>
        
        </div>
        
        </div>
        <div id="navCenter">
        <form name="form1" action="save.php" id="mouseout" method="post" enctype="multipart/form-data">
    <div class="comment">
        <textarea name="message" cols="45" rows="2" id="message" onclick="this.value='';" value="Como você esta?" placeholder="Como você esta?"></textarea>
    </div>
    <input name="name" type="hidden" id="name" value="<?php echo $_SESSION['login_id_nome'];?> <?php echo $_SESSION['login_id_sobre'];?>">
    <input name="poster" type="hidden" id="name" value="<?php echo $_SESSION['login_id_conta'];?>">
    <input name="img" type="hidden" id="name" value="<?php echo $_SESSION['login_id_img'];   ?>">
    <div id="nomeImgPoster"></div>
    <label for='selecao-arquivo'>Foto/Vídeo</label>
    <input id='selecao-arquivo' type="file" name="image"> 
    <input class="input_post" type="submit" name="btnlog" value="Compartilha" class="greenButton">
    </form>

       <?php
include("config.php");
$query  = mysql_query("SELECT * FROM postagem WHERE poster ORDER BY id_poster DESC");

while($row = mysql_fetch_assoc($query)){
    $query2 = mysql_query("SELECT * FROM amigoslista WHERE id='".$_SESSION['login_id_conta']."' and status='accepted'");
    while($row2 = mysql_fetch_assoc($query2)){
        if ($row['poster'] == $row2['myfriends']){
        echo '<div class="poster"><hr>';
        echo '<div class="pic1">';
        echo "<img width=50 height=50 alt='Unable to View' src='" . $row["img"] . "'>";
        echo '</div>';
        echo '<div class="postedby">';
        echo "{$row['nome']}:";
        echo "<br></div><b><div class='message'><br>{$row['msg']}</b><br><br><div class='like'></div>";
        
        if ($row['msg_img'] == ""){
    
        } else {
            echo "<img alt='Unable to View' class='posterImg' src='" . $row["msg_img"] . "'>";
        }
        echo "</div>";
        echo "</div>";
        echo '<br>';
        echo '<br>';
        echo '<br>';
    }
    }
    if ($row['poster'] == $_SESSION['login_id_conta']){
        echo '<div class="poster"><hr>';
        echo '<div class="pic1">';
        echo "<img width=50 height=50 alt='Unable to View' src='" . $row["img"] . "'>";
        echo '</div>';
        echo '<div class="postedby">';
        echo "{$row['nome']}:";
        echo "<br></div><b><div class='message'><br>{$row['msg']}</b><br><br><div class='like'></div>";
        
        if ($row['msg_img'] == ""){
    
        } else {
            echo "<img alt='Unable to View' class='posterImg' src='" . $row["msg_img"] . "'>";
        }
        echo "</div>";
        echo "</div>";
        echo '<br>';
        echo '<br>';
        echo '<br>';
    }
}
?>
        </div>
        <div class="msg">
</div>
        <div id="nav-right">
            <span id="buttonAMG"><i class="fas fa-sort-down"></i></span>
            <br>
            <div>Amigos</div>
            <span class="sAmigos"></span>
            </div>
        </div>
        <div class="button3">
        <span id="buttonAMG2"><i class="fas fa-sort-down"></i></span>
        </div>
    </main>
</body>
<script src="js/script.js"></script>
</html>