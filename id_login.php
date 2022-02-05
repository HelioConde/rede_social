<?php
session_start();
	require_once('config.php');
include("config.php");

	function clean($str) {
		if(get_magic_quotes_gpc()) {
			$str = stripslashes($str);
		}
		return mysql_real_escape_string($str);
	}
	
	$login = $_POST['login'];
	$password = $_POST['password'];

	$qry="SELECT * FROM dados_membros WHERE id_email='$login' AND id_senha='$password'";
	$result=mysql_query($qry);

	if($result) {
		if(mysql_num_rows($result) > 0) {
			//Login Successful
			session_regenerate_id();
			$member = mysql_fetch_assoc($result);
@session_start();
$_SESSION['login_id_conta'] = $member['id_conta'];
$_SESSION['login_id_nome'] = $member['id_nome'];
$_SESSION['login_id_sobre'] = $member['id_sobre'];
$_SESSION['login_id_img'] = $member['id_img'];
$_SESSION['login_id_estatus'] = $member['id_estatus'];

			header("location: index.php");
			exit();
		}else {
            
			header("location: home.php");
			exit();
		}
	}else {
		die("Query failed");
	}
?>