<?php

//require_once 'CommandInterface.php';

class Command {
	public static function execute($command, $settings, $commandSettings, $data) {
		$command = basename($command);
		$commandClass = ucwords($command) . 'Command';
		$commandFile = $settings['commandsDir'] . '/' . $commandClass . '.php';
		
		if (!file_exists($commandFile)) {
			Command::error("Command file does not exist");
		}
		require_once $commandFile;
		
		if (!class_exists($commandClass)) {
			Command::error("Command class does not exist");
		}
		
		$commandObject = new $commandClass($commandSettings);
		try {
			if (method_exists($commandObject, 'validate')) {
				$commandObject->validate($data);
			}
			Command::success($commandObject->execute($data));
		}
		catch (Exception $e) {
			Command::error($e->getMessage());
		}
	}
	
	public static function error($error) {
		print json_encode(array(
			"type" => "error",
			"error" => $error
		));
		exit;
	}
	
	public static function success($result) {
		print json_encode(array(
			"type" => "success",
			"result" => $result
		));
		exit;
	}
}