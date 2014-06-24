<?php
$s=""; //generate a random string of 108KB and a random filename
$fname = chr(rand(0,57)+65).chr(rand(0,57)+65).chr(rand(0,57)+65).chr(rand(0,57)+65).'.txt';
for($i=0;$i<108000;$i++)
{
	$n=rand(0,57)+65;
	$s = $s.chr($n);
}

//write s to a file
file_put_contents($fname,$s);
$result = file_get_contents($fname);
echo $result;
