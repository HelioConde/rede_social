<?php
	require_once('verificacao.php');
?>
<?php

$errmsg_arr = array();
	
	//Validation error flag
	$errflag = false;
include("config.php");
$firstname=$_GET['firstname'];
$lastname=$_GET['lastname'];
$address=$_GET['address'];
$contct_no=$_GET['contactno'];
$website=$_GET['url'];
$gender=$_GET['gender'];
$myfriends=$_GET['member_id'];
$id=$_GET['my_id'];
$my_img=$_GET['my_img'];
$byfist=$_SESSION['login_id_nome'];
$bylast=$_SESSION['login_id_sobre'];
$addby2=$firstname." ".$lastname;
$addby=$_SESSION['login_id_nome']." ".$_SESSION['login_id_sobre'];
$status=$_GET['status'];
$status2=$_GET['status2'];
$propic=$_GET['propic'];
$friend_id=$_GET['friend'];
if($firstname == $_SESSION['login_id_nome']) {
		$errmsg_arr[] = ' You cannot add your self, ipaliwat anay sa nso ang record mo hehehehe';
		$errflag = true;
	}
	if($errflag) {
		$_SESSION['ERRMSG_ARR'] = $errmsg_arr;
		session_write_close();
		header("location: pesquisa.php");
		exit();
	}
if($firstname != '') {
		$qry = "SELECT * FROM amigoslista WHERE id_friends='$friend_id'";
		$result = mysql_query($qry);
		if($result) {
			if(mysql_num_rows($result) > 0) {
				$errmsg_arr[] = 'the friends you are trying to add is already in your friends list';
				$errflag = true;
			}
			@mysql_free_result($result);
		}
		else {
			die("Query failed");
		}
	}
	
	//If there are input validations, redirect back to the registration form
	if($errflag) {
		$_SESSION['ERRMSG_ARR'] = $errmsg_arr;
		session_write_close();
		echo '<script> location.href="friends.php"; </script>';
		exit();
	}

	$sql="INSERT INTO amigoslista (id, myfriends, status) VALUES ('$id','$myfriends','$status2')";
	$sql2="INSERT INTO amigoslista (id, myfriends, status) VALUES ('$myfriends','$id','$status')";
if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }
  if (!mysql_query($sql2,$con))
  {
  die('Error: ' . mysql_error());
  }
echo '<script> location.href="pesquisa.php"; </script>';
exit();

mysql_close($con)
?> 