<?php

require_once 'Command.php';

if (!isset($_SERVER['PHP_AUTH_USER']) || !($_SERVER['PHP_AUTH_USER'] == 'admin' && $_SERVER['PHP_AUTH_PW'] == (string)$galleries['password'])) {
	header('WWW-Authenticate: Basic realm="Dostep do panelu administracyjnego zablokowany"');
	header('HTTP/1.0 401 Unauthorized');
	echo 'Access denied';
	exit;
} 

if (isset($_POST['command'])) {
	$command = Command::execute($_POST['command'], array(
		'commandsDir' => dirname(__FILE__) . '/commands'
	), array(
		'file' => '../../photos/photo.xml',
	), json_decode($_POST['data']));
}

