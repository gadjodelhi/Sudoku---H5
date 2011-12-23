<?php

//require_once 'CommandInterface.php';

class Command {
	public static function execute($command, $settings, $commandSettings, $data) {
		$command = basename($command);
		$commandClass = ucwords($command) . 'Command';
		$commandFile = $settings['commandsDir'] . '/' . $commandClass . '.php';
		
		if (!file_exists($commandFile)) {
			throw new Exception("Command file does not exist");
		}
		require_once $commandFile;
		
		if (!class_exists($commandClass)) {
			throw new Exception("Command class does not exist");
		}
		
		$commandObject = new $commandClass($commandSettings);
		$result = $commandObject->execute($data);
		print json_encode($result);
		exit;
	}
}