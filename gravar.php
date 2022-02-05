<?php
require_once('verificacao.php');
?>
<?php
include("config.php");

$id= $_SESSION['login_id_conta'];
$user= $_SESSION['login_id_nome'];


	if (!isset($_FILES['image']['tmp_name'])) {
	echo "";
	}else{
	$file=$_FILES['image']['tmp_name'];
	$image= addslashes(file_get_contents($_FILES['image']['tmp_name']));
	$image_name= addslashes($_FILES['image']['name']);
	$image_size= getimagesize($_FILES['image']['tmp_name']);

	
		if ($image_size==FALSE) {
		
			echo "That's not an image!";
			
		}else{
			
			move_uploaded_file($_FILES["image"]["tmp_name"],"uploadedimage/" .$id. $_FILES["image"]["name"]);
			
			$location="uploadedimage/" .$id. $_FILES["image"]["name"];

            @session_start();
            $_SESSION['login_id_img'] = $location;
			/*mysql_query("UPDATE members SET profImage = '$location' WHERE message_id='$messageid'");

			mysql_close($con);*/
			if(!$update=mysql_query("UPDATE dados_membros SET id_img = '$location' WHERE id_conta='$id'")) {
			
				echo mysql_error();
				
				
			}
			else{
			
			echo '<script> location.href="exec_registro.php"; </script>';
			exit();
			}
			}
	}

?>