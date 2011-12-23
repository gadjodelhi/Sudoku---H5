<?php

require_once 'module_abstract.php';

class Module_galleries extends Module_abstract {
	public function execute() {
		$galleries = array();
		foreach($this->vars['data']->xpath('//gallery[@category="'.$this->vars['category'].'"]') as $g) {
			$id = (string)$g['id'];
			
			if (file_exists($s = 'photos/'.trim((string)$g['path'], '/').'/'.$id.'.png')) {
				$thumbnail = $id.'.png';
			}
			else {
				$thumbnail = 'index.png';
			}

			$galleries[$id] = array(
				'link'=>"/$id".($g['index']?'':'/1'),
				'title'=>(string)$g['title'],
				'description'=>(string)$g['description'],
				'thumbnail'=>'/'.rtrim($this->vars['images'], '/').'/'.trim((string)$g['path'], '/').'/'.$thumbnail,
				'big'=>(string)$g['big'],
				'category'=>(string)$g['category'],
				'index'=>(int)$g['index'],
				'path'=>(string)$g['path'],
				'date'=>(string)$g['date'],
				'published'=>(string)$g['published']
			);
		}

		$tpl = new PHPTAL($this->vars['template']);
		$tpl->set('galleries', $galleries);
		return $tpl->execute();
	}
}