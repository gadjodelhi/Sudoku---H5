<?php

require 'XMLFileCommand.php';

class RemovephotoCommand extends XMLFileCommand {
	public function execute($data) {
		$gallery = $this->_xml->getElementById($data->gallery);

		foreach($gallery->getElementsByTagName('photo') as $photo) {
			if ($photo->getAttribute('image') === $data->image) {
				$gallery->removeChild($photo);
				$this->_export();
				break;
			}
		}

		return $data;
	}

	public function validate($data) {
		$gallery = $this->_xml->getElementById($data->gallery);
		if (!$gallery) {
			throw new Exception('Gallery "' . $data->gallery . '" not found');
		}
	}
}