<?php
@session_start();
	if(!isset($_SESSION['login_id_conta'])) {
		echo '<script> location.href="home.php"; </script>';
		exit();
	} 
?>