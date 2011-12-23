<?php

require_once 'Command.php';

define('XMLFILE', '../../photos/photo.xml');

$galleries = simplexml_load_file(XMLFILE);


if (!isset($_SERVER['PHP_AUTH_USER']) || !($_SERVER['PHP_AUTH_USER'] == 'admin' && $_SERVER['PHP_AUTH_PW'] == (string)$galleries['password'])) {
	header('WWW-Authenticate: Basic realm="Dostep do panelu administracyjnego zablokowany"');
	header('HTTP/1.0 401 Unauthorized');
	echo 'Access denied';
	exit;
} 

if (isset($_POST['command'])) {
	$data = get_magic_quotes_gpc() ? stripslashes($_POST['data']) : $_POST['data'];

	$command = Command::execute($_POST['command'], array(
		'commandsDir' => dirname(__FILE__) . '/commands'
	), array(
		'file' => XMLFILE,
	), json_decode($data));
}

