<?php

require 'XMLFileCommand.php';

class RemovegalleryCommand extends XMLFileCommand {
	public function execute($data) {
		$gallery = $this->_xml->getElementById($data->id);
		$gallery->parentNode->removeChild($gallery);
	
		$this->_export();
		
		return $data->id;
	}
	
	public function validate($data) {
		$gallery = $this->_xml->getElementById($data->id);
		if (!$gallery) {
			throw new Exception('Gallery "' . $data->id . '" not found');
		}
	}
}