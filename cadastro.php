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
<?php
include("config.php");
$qry = mysql_query("SELECT * FROM dados_membros");
echo " - ".mysql_num_rows($qry)." dados_membros.";
?>
    <div id="top"></div>
    <main>
        <div id="nav-center2">
            <div class="label1">
            <form action="exec_registro.php" method="post">
	  	<div class="textleft">Nome:</div>
		<div class="textright"><input name="fname" type="text" class="textfield" id="fname"  size="40">
		
		</div>
		<div class="textleft">Sobrenome:</div>
		<div class="textright"><input name="lname" type="text" class="textfield" id="lname"  size="40">
		
        </div>
        <div class="textleft">E-mail:</div>
		<div class="textright"><input name="email" type="text" class="textfield" id="email" size="40">
		</div>

		<div class="textleft">Senha:</div>
		<div class="textright">
		  <input name="password2" type="password" class="textfield" id="password" size="40" />
		  
		</div>
		<div class="textleft">Confirme a senha:</div>
		<div class="textright"><input name="cpassword" type="password" class="textfield" id="cpassword" size="40" />
		  
		</div>
		<div class="textleft">Cidade:</div>
		<div class="textright"><input name="cidade" type="text" class="textfield" id="cidade" size="40">
		
		</div>
		<div class="textleft">Estado:</div>
		<div class="textright"><input name="estado" type="text" class="textfield" id="estado" size="40">

		</div>
		<div class="textleft">País:</div>
		<div class="textright"><input name="pais" type="text" class="textfield" id="pais" size="40">
		
		<input name="propic" id="dadded" type="hidden" value="uploadedimage/defoult.jpg" /></div>
		<div class="textleft1">Sexo:</div>
		<div class="textright1">
			<div class="input-container">
			  <select name="gender" id="gender" class="textfield1">
                <option >Faminino</option>
                <option >Masculino</option>
              </select><br />
			</div>
		
		</div>
		<div class="textleft1">Aniversário:</div>
		<div class="textright1">
		<input type="date" name="dataN" id="dataN">
		</div>
		  <br /><label>
		  <input type="submit" name="Submit" value="Sign Up" class="greenButton1" />
		  </label>
		</div>
	</form>	
            </div>
        </div>
    </main>
    <footer>
    Copyright &copy; 2019 Jovens Brasil - Todos os direitos reservados
    </footer>
</body>
<script src="js/jquery.js"></script>
<script src="js/script.js"></script>

</html>