<?php

require 'XMLFileCommand.php';

class SortphotoCommand extends XMLFileCommand {
	public function execute($data) {
		$gallery = $this->_xml->getElementById($data->gallery);
		
		for($i = 0; $i < sizeof($data->order); $i++) {
			foreach($gallery->getElementsByTagName('photo') as $photo) {
				if ($photo->getAttribute('image') === $data->order[$i]) {
					$gallery->insertBefore($photo);
					break;
				}
			}
		}
		$this->_export();
	}

	public function validate($data) {
		$gallery = $this->_xml->getElementById($data->gallery);
		if (!$gallery) {
			throw new Exception('Gallery "' . $data->gallery . '" not found');
		}
	}
}