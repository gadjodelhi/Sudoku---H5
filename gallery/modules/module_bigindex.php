<?php

require_once 'module_abstract.php';

class Module_bigindex extends Module_abstract
{
	/**
	@vars: gallery (galeria - simplexml), template (szablon indeksu), path (katalog ze zdjeciami), back (nazwa dzialu galerii)
	*/
	public function execute()
	{
		$photos = array();
		$all = $this->gallery->xpath('photo');
		foreach($all as $id=>$photo) {
			$file = strtr((string)$photo['title'] ? (string)$photo['title'] : (string)$this->gallery['title'], '/?#', '-..');
			$path = trim($this->path, '/').'/'.trim($this->gallery['path'], '/').'/big/'.preg_replace('/\.jpg$/', '', (string)$photo['image']).'/'.$file.'.jpg';
			$photos[] = array(
				'title'=>(string)$photo['title'] ? (string)$photo['title'] : (string)$this->gallery['title'],
				'alt'=>(string)$this->gallery['title'].((string)$photo['title'] ? (' - '.(string)$photo['title']) : ''),
				'path'=>'/'.$path
			);
		}

		$tpl = new PHPTAL($this->template);
		$tpl->set('title', (string)$this->gallery['title']);
		$tpl->set('description', (string)$this->gallery['description']);
		$tpl->set('photos', $photos);
		$tpl->set('gallery', (string)$this->gallery['id']);
		return $tpl->execute();
	}
}