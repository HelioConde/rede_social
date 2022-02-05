<?php
require_once('verificacao.php');
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Bem Vindo -
        <?php echo $_SESSION['SESS_FIRST_NAME'];?>
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
                        <form action="friends.php" method="GET">
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
                <div>
                    <i class="fas fa-user-friends"></i>
                </div>
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
            <div class="amigos1">
                <ul>
                    <li>Amigos</li>
                    <li> <img src="images/Untitled-1.png" width="15" height="15" border="0" />
                    </li>
                </ul>
            </div>
            <span id="drop">
            <span class="dropdown">
					<div class="btn btn-default dropdown-toggle" data-toggle="dropdown"><a href="#" class="status">Estatus</a>            <a>
        <?php 
			if ($_SESSION['login_id_estatus'] == 0){
				echo 'Online';
			} elseif($_SESSION['login_id_estatus'] == 1){
				echo 'Ocupado';
			} elseif($_SESSION['login_id_estatus'] == 2){
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
        <div class="openIMG">
                <form action="gravar.php" method="post" enctype="multipart/form-data">
                <br>

                <p>
                <br>
                
                <label for='selecao-arquivo'>Adicionar uma foto no perfil</label>
    <input id='selecao-arquivo' type="file" name="image"> 
                </p>
                <p>
                  <input type="submit" class="input_post"value="Enviar foto">
                      </p>
              </form>
              </div>
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
