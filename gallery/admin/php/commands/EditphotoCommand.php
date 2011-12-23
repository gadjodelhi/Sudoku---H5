<?php

require 'XMLFileCommand.php';

class EditphotoCommand extends XMLFileCommand {
	public function execute($data) {
		$gallery = $this->_xml->getElementById($data->gallery);
		
		foreach($gallery->getElementsByTagName('photo') as $photo) {
			if ($photo->getAttribute('image') === $data->image) {
				$photo->setAttribute('title', $data->title);
				$this->_export();
				
				$data->link = $data->image ? $data->originallink : ('/' . $data->gallery . '/1');
				$data->linktitle = $data->title;
				$data->imgsrc = '/photos/' . trim($gallery->getAttribute('path'), '/') . '/thumbs/' . $data->image;
				$data->imgtitle = $data->title;
				return $data;
			}
		}
		
		throw new Exception('Photo "' . $data->image . '" not found');
	}

	public function validate($data) {
		$gallery = $this->_xml->getElementById($data->gallery);
		if (!$gallery) {
			throw new Exception('Gallery "' . $data->gallery . '" not found');
		}
	}
}