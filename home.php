<?php
@session_start();
	if(!isset($_SESSION['login_id_conta'])) {
	} else {
		echo '<script> location.href="index.php"; </script>';
		exit();
    }
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Rede Jovem
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
    <div id="top"></div>
    <main>
        <div id="nav-center">
            <div class="label1">
                <form action="id_login.php" method="post">
                    <div class="emailtext">
                        <input name="login" type="text" id="login" placeholder="E-mail">
                    </div>
                    <br>
                    <div class="passwordtext">
                        <input name="password" type="password" placeholder="Senha">
                    </div>
                    <br>
                    <input type="submit" class="greenButton" value="Entrar" />
                </form>
            </div>
        </div>
    </main>
    <div id="bemvindo">
    Bem Vindo a Rede Jovem
    <br>
    <a href="cadastro.php"><button>Cadastra-se</button></a>
    <br>
    <br>
    </div>
    <footer>
    Copyright &copy; 2019 Jovens Brasil - Todos os direitos reservados
    </footer>
</body>
<script src="js/jquery.js"></script>
<script src="js/script.js"></script>

</html>