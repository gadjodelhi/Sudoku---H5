<?php

require 'XMLFileCommand.php';

class EditgalleryCommand extends XMLFileCommand {
	public function execute($data) {
		if (@$data->originalid) {
			$gallery = $this->_xml->getElementById($data->originalid);
		}
		else {
			$gallery = $this->_xml->createElement('gallery');
			$this->_xml->documentElement->insertBefore($gallery, $this->_xml->documentElement->childNodes->length ? $this->_xml->documentElement->childNodes->item(0) : null);
			$gallery->setAttribute('id', $data->id);
			$gallery->setAttribute('path', $data->id);
			$gallery->setAttribute('published', date("Y-m-d H:i:s"));
			$gallery->setAttribute('index', 1);
		}
		$gallery->setAttribute('title', $data->title);
		$gallery->setAttribute('description', $data->description);
		$gallery->setAttribute('big', $data->big);
		$gallery->setAttribute('category', $data->category);
	
		$this->_export();
		
		$data->link = $data->id;
		$data->thumbnail = '/photos/' . $data->id . '/' . $data->id . '.png';
		$data->alt = $data->title;
		return $data;
	}
	
	public function validate($data) {
		if (@$data->originalid && $data->originalid !== $data->id) {
			throw new Exception('ID change is not implemented yet');
		}
	
		if (@$data->originalid) {
			$gallery = $this->_xml->getElementById($data->originalid);
			if (!$gallery) {
				throw new Exception('Gallery "' . $data->originalid . '" not found');
			}
		}

		if ($data->id !== @$data->originalid && $this->_xml->getElementById($data->id)) {
			throw new Exception('Gallery "' . $data->id . '" already exists');
		}

		if (!in_array($data->category, array('hidden', 'asia', 'dance', 'other', 'mountains'))) {
			throw new Exception('Invalid category "' . $data->category . '"');
		}
	}
}