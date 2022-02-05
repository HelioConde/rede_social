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

	<?php  
		  if(isset($_GET['query']))
		  {
include("config.php");
    /* tutorial_search is the name of database we've created */  
 
 $query = $_GET['query'];   

$min_length = 3;  
    // you can set minimum length of the query if you want  
 if(strlen($query) >= $min_length){ // if query length is more or equal minimum length then  
 $query = htmlspecialchars($query);   
 
 $query = mysql_real_escape_string($query);  
 
    
   $raw_results = mysql_query("SELECT * FROM dados_membros  
        WHERE (`id_nome` LIKE '%".$query."%') OR (`id_email` LIKE '%".$query."%')") or die(mysql_error());  

        
     if(mysql_num_rows($raw_results) > 0){ // if one or more rows are returned do following  
             
          while($results = mysql_fetch_array($raw_results)){   
			if($_SESSION['login_id_nome']." ".$_SESSION['login_id_sobre'] == $results['id_nome']." ".$results['id_sobre']){
			}else {
				if($_SESSION['login_id_conta'] == $results['id_conta']){

				} else {
				echo '<div class="nomeFriend"><form action="addamigo.php" method="get">';
				echo '<input name="name" type="hidden" id="name" value="'. $_SESSION['login_id_nome'].'"/>';
			   echo'<input type="hidden" name="firstname" value="'. $results['id_nome'] .'">'; 
			   echo'<input type="hidden" name="my_id" value="'. $_SESSION['login_id_conta'] .'">'; 
			   echo'<input type="hidden" name="my_img" value="'. $_SESSION['login_id_img'] .'">'; 
			   echo'<input type="hidden" name="member_id" value="'. $results['id_conta'] .'">'; 
			   echo'<input type="hidden" name="username" value="'. $results['id_email'] .'">';
			   echo'<input type="hidden" name="lastname" value="'. $results['id_sobre'] .'">';
			   echo'<input type="hidden" name="gender" value="'. $results['sexo'] .'"."<br>';
			   echo'<input type="hidden" name="propic" value="'. $results['id_img'] .'"."<br>';
               echo'<input type="hidden" name="status" value="pending"."<br><br>';
               echo'<input type="hidden" name="status2" value="paring"."<br><br>';
				//echo'<input type="submit" name="addfriend" value="addfriend">';
				echo "<ul><li><img width=100 height=100 alt='Unable to View' src='" .$results['id_img'] . "'><br>";
				echo $results['id_nome']." ".$results['id_sobre']."<br>"; 
	   			echo'<input name="addfriend" type="submit" value="Adicionar amigo" class="greenButton" /><li></ul>';
	   			echo '</form></div>';
			}  
        }
    }
}
 }
}
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