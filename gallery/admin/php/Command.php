<?php

class Command {
	public static execute($command, $settings, $commandSettings, $data) {
		$command = basename($command);
		$commandFile = $settings['commandsDir'] . '/' . $command . '.php';
		$commandClass = ucwords($command) . 'Command';
		
		if (!file_exists($commandFile)) {
			return;
		}
		require_once $commandFile;
		
		if (!class_exists($commandClass)) {
			return;
		}
		
		$commandObject = new $commandClass($commandSettings);
		$result = $commandObject->execute($data);
		print json_encode($result);
		exit;
	}
}