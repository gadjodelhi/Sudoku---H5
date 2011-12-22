<?php

require_once 'module_abstract.php';

class Module_photo extends Module_abstract
{
  /**
   @vars: gallery (galeria - simplexml), template (szablon indeksu), path (katalog ze zdjeciami), back (nazwa dzialu galerii)
   */
  public function execute()
  {
    $photos = $this->gallery->xpath('photo');
    $id = $this->id < 1 ? 1 : ($this->id > sizeof($photos) ? sizeof($photos) : $this->id); 
    $photo = $photos[$id-1];
    $title = (string)$photo['title'] ? ((string)$photo['title'].' ('.(string)$this->gallery['title'].')') : ((string)$this->gallery['title'].(' - Zdjęcie '.$id.' z '.sizeof($photos)));
    $file = strtr((string)$photo['title'] ? (string)$photo['title'] : (string)$this->gallery['title'], '/?', '-.');
    $photosize = getimagesize('photos/'.trim($this->gallery['path'], '/').'/'.(string)$photo['image']);
	$hasbig = file_exists(trim($this->filepath, '/').'/'.trim($this->gallery['path'], '/').'/big/'.(string)$photo['image']);
    
    $tal = new PHPTAL($this->template);
    $tal->set('src', '/'.trim($this->path).'/'.trim($this->gallery['path'], '/').'/'.preg_replace('/\.jpg$/', '', (string)$photo['image']).'/'.$file.'.jpg');
	if ($hasbig) {
		$tal->set('big', '/'.trim($this->path).'/'.trim($this->gallery['path'], '/').'/big/'.preg_replace('/\.jpg$/', '', (string)$photo['image']).'/'.$file.'.jpg');
	}
	else {
	}
	
    $tal->set('title', $title);
    $tal->set('shorttitle', (string)$photo['title'] ? (string)$photo['title'] : (string)$this->gallery['title']);
    $tal->set('gallerytitle', (string)$this->gallery['title']);
    $tal->set('photowidth', $photosize[0] - 90);
    $tal->set('id', $id);
    $tal->set('count', sizeof($photos));
	$tal->set('facebook', 'http://www.facebook.com/share.php?u='.urlencode('http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']));

	$prev = $prevtitle = $next = $nextitle = '';
    if ($id > 1) {
	  $prevphoto = $photos[$id-2];
	  $prev = '/'.$this->gallery['id'].'/'.($id-1).((string)$prevphoto['title'] ? ','.urlencode(strtr((string)$prevphoto['title'], '/', '.')) : '');
	  $prevtitle = (string)$prevphoto['title'] ? (string)$prevphoto['title'] : (string)$this->gallery['title'];
	}
    else if ((int)$this->gallery['index']) {
      $prev = '/'.$this->gallery['id'];
	  $prevtitle = (string)$this->gallery['title'];
	}
	$tal->set('prev', $prev);
	$tal->set('prevtitle', $prevtitle);
	$this->parentTemplate->set('prev', array('link'=>$prev, 'title'=>$prevtitle));
  
    if ($id < sizeof($photos)) {
	  $nextphoto = $photos[$id];
	  $next = '/'.$this->gallery['id'].'/'.($id+1).((string)$nextphoto['title'] ? ','.urlencode(strtr((string)$nextphoto['title'], '/', '.')) : '');
	  $nexttitle = (string)$nextphoto['title'] ? (string)$nextphoto['title'] : (string)$this->gallery['title'];
	}
    else if ((int)$this->gallery['index']) {
      $next = '/'.$this->gallery['id']; 
	  $nexttitle = (string)$this->gallery['title'];
	}
	$tal->set('next', $next);
	$tal->set('nexttitle', $nexttitle);
	$this->parentTemplate->set('next', array('link'=>$next, 'title'=>$nexttitle));

    return $tal->execute();
  }
}