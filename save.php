
<?php

include("config.php");
 
 function clean($str) {
		$str = @trim($str);
		if(get_magic_quotes_gpc()) {
			$str = stripslashes($str);
		}
		return mysql_real_escape_string($str);
	}
$file=$_FILES['image']['tmp_name'];
$user= $_SESSION['login_id_nome'];
$image= addslashes(file_get_contents($_FILES['image']['tmp_name']));
$image_name= addslashes($_FILES['image']['name']);
$image_size= getimagesize($_FILES['image']['tmp_name']);

$results = mysql_query("SELECT * FROM postagem ORDER BY id_poster DESC");

$results2 = mysql_fetch_array($results);
$alt = $results2['id_poster'];
if ($_FILES["image"]["name"] == ""){

}else {
move_uploaded_file($_FILES["image"]["tmp_name"],"posterimage/" .$alt. $_FILES["image"]["name"]);
			
$location="posterimage/" .$alt. $_FILES["image"]["name"];
}
$messages = clean($_POST['message']);
$user =clean($_POST['name']);
$pic =clean($_POST['img']);
$poster =clean($_POST['poster']);
$sql="INSERT INTO postagem (msg_img,poster, nome, msg, img, data)
VALUES
('$location','$poster','$user','$messages','$pic','".strtotime(date("Y-m-d H:i:s"))."')";

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }
echo "<script> location.href='index.php'; </script>";
exit();

mysql_close($con)

?>
<?php
include("config.php");

$name=$_POST['name'];
$pic=$_SESSION['login_id_img'];



mysql_close($con);
?> 
