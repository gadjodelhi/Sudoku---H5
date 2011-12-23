<?php

class XMLFileCommand {
	private $_filename;
	
	protected $_xml;

	public function __construct($settings) {
		$this->_filename = $settings['filename'];
		$this->_xml = new DOMDocument();
		$this->_xml->loadXML(file_get_contents($this->_filename));
		foreach($this->_xml->getElementsByTagName('gallery') as $gallery) {
			$gallery->setIdAttribute('id', true);
		}
	}
	
	protected function _export() {
		file_put_contents($this->_filename, $this->_xml->saveXML());
	}
}
