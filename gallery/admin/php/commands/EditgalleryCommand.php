<?php

require 'XMLFileCommand.php';

class EditgalleryCommand extends XMLFileCommand {
	public function execute($data) {
		$gallery = $this->_xml->getElementById($data->originalid);
		$gallery->setAttribute('title', $data->title);
		$gallery->setAttribute('description', $data->description);
		$gallery->setAttribute('big', (isset($data->big) && $data->big) ? 'true' : 'false');
	
		$this->_export();
		
		$data->link = $data->id;
		$data->thumbnail = '/photos/' . $data->id . '/' . $data->id . '.png';
		$data->alt = $data->title;
		return $data;
	}
	
	public function validate($data) {
		if ($data->originalid && $data->originalid !== $data->id) {
			throw new Exception('ID change is not implemented yet');
		}
	
		if ($data->originalid) {
			$gallery = $this->_xml->getElementById($data->originalid);
			if (!$gallery) {
				throw new Exception('Gallery "' . $data->originalid . '" not found');
			}
		}

		if ($data->id !== $data->originalid && $this->_xml->getElementById($data->id)) {
			throw new Exception('Gallery "' . $data->id . '" already exists');
		}

		if (!in_array($data->category, array('hidden', 'asia', 'dance', 'other', 'mountains'))) {
			throw new Exception('Invalid category "' . $data->category . '"');
		}
	}
}