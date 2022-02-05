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
            <span id="drop">
            <span class="dropdown">
					<div class="btn btn-default dropdown-toggle" data-toggle="dropdown"><a href="#" class="status">Estatus</a>            <a>
        <?php 
			if ($_SESSION['login_id_estatus'] == 0){
				echo 'Online<span style="color:green;font-size:10px;"><i class="fas fa-circle"></i></span>';
			} elseif($_SESSION['login_id_estatus'] == 1){
				echo 'Ocupado <span style="color:red;font-size:10px;"><i class="fas fa-circle"></i></span>';
			} elseif($_SESSION['login_id_estatus'] == 2){
				echo 'Ausente<span style="color:#66666652;font-size:10px;"><i class="fas fa-circle"></i></span>';
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
		<label>Nome:
		<input type="text" name="nome" value="<?php echo $_SESSION['login_id_nome'];?>">
		</label><br>
		<label>Sobrenome:
		<input type="text" name="sobre" value="<?php echo $_SESSION['login_id_sobre'];?>">
		</label><br>
		<label>Sexo:
		<input type="text" name="sobre" value="<?php echo $_SESSION['login_id_sexo'];?>">
		</label><br>
		<label>Aniversário:
		<input type="date" name="data">
		</label><br>
		<form action="editar.php" method="post">
        <label>Cep:
        <input name="cep" type="text" id="cep" value="" size="20" maxlength="8" minlength="7"/></label><br />
        <label>Bairro:
        <input name="bairro" type="text" id="bairro" size="20" /></label><br />
        <label>Cidade:
        <input name="cidade" type="text" id="cidade" size="20" /></label><br />
        <label>Estado:
        <input name="uf" type="text" id="uf" size="20" /></label><br />
		
		<input type="submit" class="greenButton enviar" value="enviar" disabled />
      	</form>
            </div>
        </div>
        <div class="button3">
        <span id="buttonAMG2"><i class="fas fa-sort-down"></i></span>
        </div>
    </main>

</body>

<script src="js/jquery.js"></script>
<script src="js/script.js"></script>
<script src="js/perfil.js"></script>
</html>