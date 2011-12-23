<?php

require_once 'module_abstract.php';

class Module_photoindex extends Module_abstract
{
  /**
   @vars: gallery (galeria - simplexml), template (szablon indeksu), path (katalog ze zdjeciami), back (nazwa dzialu galerii)
   */
  public function execute()
  {
    $photos = array();
	$all = $this->gallery->xpath('photo');
	
    foreach($all as $id=>$photo) {
	  $photono = "Zdjęcie ".($id+1)." z ".sizeof($all);

      $thumbnail = '/'.trim($this->path, '/').'/'.trim($this->gallery['path'], '/').'/thumbs/'.(string)$photo['image'];
      $photos[] = array(
        'title'=>(string)$photo['title'] ? (string)$photo['title'] : $photono,
		'linktitle'=>(string)$photo['title'] ? (string)$photo['title'] : ((string)$this->gallery['title'].' - '.$photono),
        'link'=>'/'.$this->gallery['id'].'/'.($id+1).((string)$photo['title'] ? (','.urlencode(strtr((string)$photo['title'], '/', '.'))) : ''),
        'thumbnail'=>$thumbnail,
		'originaltitle'=>(string)$photo['title'],
		'file'=>(string)$photo['image']
      );
    }

    $tpl = new PHPTAL($this->template);
    $tpl->set('title', (string)$this->gallery['title']);
    $tpl->set('description', (string)$this->gallery['description']);
    $tpl->set('photos', $photos);
	$tpl->set('galleryid', $this->gallery['id']);
	$tpl->set('sizematters', (string)$this->gallery['big'] !== "false" && file_exists(trim($this->path, '/').'/'.trim($this->gallery['path'], '/').'/big') ? ('/'.$this->gallery['id'].'/big') : null);
    return $tpl->execute();
  }
}