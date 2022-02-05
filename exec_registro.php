<?php
	session_start();
	require_once('config.php');
	$errmsg_arr = array();
	$errflag = false;
include("config.php");
	if(!$db) {
		die("Unable to select database");
	}
	function clean($str) {
		if(get_magic_quotes_gpc()) {
			$str = stripslashes($str);
		}
		return mysql_real_escape_string($str);
	}
	$fname = clean($_POST['fname']);
	$lname = clean($_POST['lname']);
	$password = clean($_POST['password2']);
	$cpassword = clean($_POST['cpassword']);
	$cidade = clean($_POST['cidade']);
	$estado = clean($_POST['estado']);
	$pais = clean($_POST['pais']);
	$cnumber = clean($_POST['cnumber']);
	$email = clean($_POST['email']);
	$gender = clean($_POST['gender']);
	$propic = clean($_POST['propic']);
	$bday=$_POST['dataN'];

	if($gender == '') {
		$errmsg_arr[] = 'gender field is  missing';
		$errflag = true;
	}
	if($email == '') {
		$errmsg_arr[] = 'email field is  missing';
		$errflag = true;
	}
	if($fname == '') {
		$errmsg_arr[] = 'First name missing';
		$errflag = true;
	}
	if($lname == '') {
		$errmsg_arr[] = 'Last name missing';
		$errflag = true;
	}
	if($password == '') {
		$errmsg_arr[] = 'Password missing';
		$errflag = true;
	}
	if($cpassword == '') {
		$errmsg_arr[] = 'Confirm password missing';
		$errflag = true;
	}
	if( strcmp($password, $cpassword) != 0 ) {
		$errmsg_arr[] = 'Passwords do not match';
		$errflag = true;
	}
	
	//Check for duplicate login ID
	if($login != '') {
		$qry = "SELECT * FROM dados_membros WHERE id_email='$email'";
		$result = mysql_query($qry);
			if(mysql_num_rows($result) > 0) {
				$errmsg_arr[] = 'E-mail already in use';
				$errflag = true;
			}
			@mysql_free_result($result);
		
		
	}
	
	//If there are input validations, redirect back to the registration form
	if($errflag) {
		$_SESSION['ERRMSG_ARR'] = $errmsg_arr;
		session_write_close();
		header("location: index.php");
		exit();
	}

	//Create INSERT query
	$qry = "INSERT INTO dados_membros(`id_nome`, `id_sobre`, `id_email`, `id_senha`, `id_nascimento`, `id_cidade`, `id_estado`, `id_pais`, `id_sexo`, `id_estatus`, `id_img`) VALUES('$fname','$lname','$email','$password','$bday','$cidade','$estado','$pais','$gender','0','$propic')";
	$result = mysql_query($qry) or die(mysql_error());
	
	//Check whether the query was successful or not
	if($result) {
	$errmsg_arr[] = 'Success You can now log-in to bookface';
		$errflag = true;
		if($errflag) {
		$_SESSION['ERRMSG_ARR'] = $errmsg_arr;
		session_write_close();
		header("location: index.php");
		exit();
	}
		
		session_regenerate_id();
			$member = mysql_fetch_assoc($result);
			$_SESSION['login_id_conta'] = $member['id_conta'];
			$_SESSION['login_id_nome'] = $member['id_nome'];
			$_SESSION['login_id_sobre'] = $member['id_sobre'];
			$_SESSION['login_id_img'] = $member['id_img'];
			$_SESSION['login_id_sexo'] = $member['id_sexo'];
			$_SESSION['login_id_cep'] = $member['id_cep'];
			$_SESSION['login_id_estatus']= $member['id_estatus'];
			session_write_close();
		header("location: index.php");
		exit();
	}else {
		die("Query failed");
	}
?>