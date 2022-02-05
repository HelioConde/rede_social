
<?php
	require_once('auth.php');
?>

<meta http-equiv="Content-Type" content="" />
<!DOCTYPE html>
<html lang="pt-br">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title><?php echo $_SESSION['SESS_FIRST_NAME'];?></title>
	<link rel="stylesheet" href="css/style.css">
	<link href="css/all.css" rel="stylesheet">
	<script src="js/jquery.js"></script>
</head>

<body>
<nav>
		<div id="nav">
			<a href="index.php"><div id="logo"><img src="img/logo.png"></div></a>
			<div>
			<div class="search">
      			<form action="friends.php" method="GET">
					<input type='text' name="query" class="textfield" placeholder='O que você procura?'>
					<button type='submit'><i class="fas fa-search"></i></button>
      				</form>
    		</div>

			</div>
			<div id="left">
				<div>
					<a><?php echo $_SESSION['SESS_FIRST_NAME'];?></a>
				</div>
				<div>
					<a>Perfil</a>
				</div>
				<div>
					<i class="fas fa-home"></i>
				</div>
				<div>
					<i class="fas fa-user-friends"></i>
				</div>
				<div id="drop">
					
					<div class="dropdown">
					<i class="fas fa-sort-down btn btn-default dropdown-toggle" data-toggle="dropdown"></i>
            <ul class="dropdown-menu">
                <li><a tabindex="-1" href="#">Configurações</a></li>
                <li><a href="home.php">Sair</a></li>

            </ul>
        </div>
				</div>
			</div>
		</div>
	</nav>
	<div id="nav-left">
		<div class="fundo" id="perfil-left">
			<img src="<?php echo $_SESSION['SESS_IMG'];?>" class="perfil-img">
			<div><?php echo $_SESSION['SESS_FIRST_NAME'];?> <?php echo $_SESSION['SESS_LAST_NAME'];?></div>
		</form>
		</div>

		<div class="fundo">
			<a href="messages.php">Mensagens<img src="images/messages.png" width="15" height="15" border="0" /></a>
		<?php
include("config.php");

$result = mysql_query("SELECT * FROM messages WHERE receiver='".$_SESSION['SESS_FIRST_NAME'] ."' and status='pending' ORDER BY receiver ASC");
	
	$numberOfRows = MYSQL_NUMROWS($result);	
	echo '<font size="2" color="red"><b>' . $numberOfRows. '</b></font>';
	?>
		</div>
		<div class="fundo">
		<div class="amigos1">Amigos <img src="images/Untitled-1.png" width="15" height="15" border="0" /><?php
include("config.php");

$result = mysql_query("SELECT * FROM friendlist WHERE firstname='".$_SESSION['SESS_FIRST_NAME'] ."' and status='pending' ORDER BY firstname ASC");
	
	$numberOfRows = MYSQL_NUMROWS($result);	
	
	echo '<font size="2" color="red"><b>' . $numberOfRows . '</b></font>'; 
	?>
	</div>
			</div>
		<div class="fundo">
			<p>Estatus</p>
			<select name="" id="appearance-select">
				<option value="">
					Online<i class="fas fa-circle"></i>
				</option>
			</select>
		</div>
	</div>
	<div id="nav-center" class="text">
	<?php  
		  if(isset($_GET['query']))
		  {
include("config.php");
    /* tutorial_search is the name of database we've created */  
 
 $query = $_GET['query'];   

$min_length = 3;  
    // you can set minimum length of the query if you want  
 if(strlen($query) >= $min_length){ // if query length is more or equal minimum length then  
 $query = htmlspecialchars($query);   
 
 $query = mysql_real_escape_string($query);  
 
    
   $raw_results = mysql_query("SELECT * FROM members  
        WHERE (`FirstName` LIKE '%".$query."%') OR (`UserName` LIKE '%".$query."%')") or die(mysql_error());  

        
     if(mysql_num_rows($raw_results) > 0){ // if one or more rows are returned do following  
             
          while($results = mysql_fetch_array($raw_results)){   
				echo '<div class="nomeFriend"><form action="addfriend.php" method="get">';
				echo '<input name="name" type="hidden" id="name" value="'. $_SESSION['SESS_FIRST_NAME'].'"/>';
			   echo'<input type="hidden" name="firstname" value="'. $results['FirstName'] .'">'; 
			   echo'<input type="hidden" name="username" value="'. $results['UserName'] .'">';
			   echo'<input type="hidden" name="lastname" value="'. $results['LastName'] .'">';
			   echo'<input type="hidden" name="address" value="'. $results['Address'] .'">';
			   echo'<input type="hidden" name="contactno" value="'. $results['ContactNo'] .'">';
			   echo'<input type="hidden" name="url" value="'. $results['Url'] .'">';
			   echo'<input type="hidden" name="gender" value="'. $results['Gender'] .'"."<br>';
			   echo'<input type="hidden" name="propic" value="'. $results['profImage'] .'"."<br>';
			   echo'<input type="hidden" name="status" value="pending"."<br><br>';
				//echo'<input type="submit" name="addfriend" value="addfriend">';
				echo "<ul><li><img width=100 height=100 alt='Unable to View' src='" .$results['profImage'] . "'><br>";
				echo $results['FirstName']." ".$results['LastName']."<br>"; 
	   			echo'<input name="addfriend" type="submit" value="Add Friend" class="greenButton" /><li></ul>';
	   			echo '</form></div>';
            }  
          //error trapping
		  
		  $result = mysql_query("SELECT * FROM friendlist WHERE addby='". $_SESSION['SESS_FIRST_NAME'] ."'");
while($row = mysql_fetch_array($result))
  {
  echo'<input type="hidden" name="url" value="'. $row['friends_id'] .'">';
  }
		  
		  
		  //end of error trapping
		   
      }  
   else{ // if there is no matching rows do following  
       echo "No results"; 
      }  
        
 }  
 else{ // if query length is less than minimum  
      echo "Minimum length is ".$min_length;  
  } 
  } 
?>	

</div>
	<div class="buttonback1">

<div class="friends">
	<strong><div align="center">FRIENDS
	<?php
include("config.php");

$result = mysql_query("SELECT * FROM friendlist WHERE addby='".$_SESSION['SESS_FIRST_NAME'] ." ' and status='accepted' ORDER BY addby ASC");
	
	$numberOfRows = MYSQL_NUMROWS($result);	
	echo '<font size="2" color="red"><b>' . $numberOfRows. '</b></font>';
	?>
	</div></strong><br />
	<?php
include("config.php");

$result = mysql_query("SELECT * FROM friendlist WHERE addby='".$_SESSION['SESS_FIRST_NAME'] ."' and status='accepted' ORDER BY RAND() LIMIT 4");

echo "<br />";
while($row = mysql_fetch_array($result))
  {
  echo '<table width="125" height="50" border="0" cellspacing="0" cellpadding="0" align="center">';
  echo '<tr>';
  echo '<td width="50px" colspan="0" rowspan="3" align="left" valign="top">';
  echo "<img width=50 height=50 alt='Unable to View' src='" . $row["location"] . "'>";
  echo '</td>';
  echo '<td height="16">&nbsp;</td>';
  echo '</tr>';
  echo '<tr>';
  echo '<td height="17">';
  echo '<div align="left">';
  echo '&nbsp;&nbsp;';
  echo '<a href=remarks.php?id=' . $row["friends_id"] . '>' . $row['firstname'] . '</a>';
  echo '</div>';
  echo '</td>';
  echo '</tr>';
  echo '<tr>';
  echo '<td height="16">&nbsp;</td>';
  echo ' </tr>';
  echo '</table>';
  echo '<br>';
  		echo "<img width=50 height=50 alt='Unable to View' src='" . $row["location"] . "'>";
  		echo '<a href=member-index.php?id=' . $row["friends_id"] . '>' . $row['firstname'] . '</a><br />';
		
  }

mysql_close($con);
?>
	
	</div>
	  </div>  
    </div>
    </div>
  </div>
</div>
<div id="nav-right">
		<div class="fundo">
			Peçam, e será dado; busquem, e encontrarão; batam, e a porta será aberta.
			<br>
			(Mateus 7:7)
		</div>

		<div class="fundo friend">
			<p>Amigos</p>
			<br>
			<select name="" id="appearance-select">
				<option value="">
					Online<i class="fas fa-circle"></i>
				</option>
			</select>
		</div>
	</div>
	<footer>
		<div id="nav-bottom" class="text">
			Copyright &copy; 2019 Jovens Brasil - Todos os direitos reservados
		</div>
	</footer>
	<div id="foto"></div>
</body>
<script src="js/script.js"></script>
</html>