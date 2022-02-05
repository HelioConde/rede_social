<?php
	require_once('auth.php');
?>
	<link href="css/add.css" rel="stylesheet">
<?php
include("config.php");

$result = mysql_query("SELECT * FROM friendlist WHERE firstname='".$_SESSION['SESS_FIRST_NAME'] ."' and status='pending' ORDER BY firstname ASC");

while($row = mysql_fetch_array($result))
  {
  		echo '<div class="addFriend"><ul><li><img src="'.$row['locationIMG'].'"><br>';
		echo $row['addby'];
		echo '<br><a href=acceptrequest.php?id=' . $row["friends_id"] . '>' . "<button>Aceitar</button>" .  '</a>';
		echo '<a href=deleterequest.php?id=' . $row["friends_id"] . '>' . "<button>Deletar</button>" .  '</a></ul></li></div>';
  }

mysql_close($con);

?>
