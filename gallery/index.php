<?php


/**

todo: fraszki, logo 'jacek karczmarczyk' na wszystkich/glownej (do rozwazenia)

*/

ini_set('include_path', ".:$_SERVER[DOCUMENT_ROOT]/lib/");
//require_once 'PHPTAL-1.1.13/PHPTAL.php';
require_once 'PHPTAL-1.2.0/PHPTAL.php';


if ($_SERVER["HTTP_HOST"] != "karczmarczyk.pl")
{
  header("HTTP/1.1 301 Moved Permanently");
  header("Location: http://karczmarczyk.pl".$_SERVER['REQUEST_URI']);
  die();
}

header("Content-type: text/html; charset=UTF-8");

$args = split('/', trim(preg_replace('/^\/https?:\/\/'.preg_quote($_SERVER['HTTP_HOST']).'/', '', strtolower(trim(preg_replace('/\?[^?]*$/', '', $_SERVER['REQUEST_URI'])))), '/'));
if (sizeof($args) <= 1 && @$args[0] == '') $args = array('home.html');



$tpl = new PHPTAL;
$tpl->setTemplate('views/core.html');

$menuitems = array(
  'site'=>array('home'=>'Strona główna', 'contact'=>'Kontakt', 'links'=>'Linki', /*'portfolio'=>'Portfolio', */'biography'=>'Biografia'),
  'galleries'=>array('gallery-asia'=>'Azja', 'gallery-dance'=>'Ze sceny', 'gallery-mountains'=>'Góry', 'gallery-other'=>'Różności'),
  'hidden'=>array('download'=>'Jak pobrać zdjęcie')
);

$galleries = simplexml_load_file('photos/photo.xml');

if (!preg_match('/^(.*)\.html$/', $args[0], $matches))
{
  if (preg_match('/\.jpg$/', $_SERVER['REQUEST_URI'])) {
	header("HTTP/1.0 404 Not Found");
	die("HTTP/1.0 404 Not Found");
  }
  
  $galleries = $galleries->xpath('//gallery[@id="'.$args[0].'"]');
  if (!sizeof($galleries))
  {
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: http://".$_SERVER['HTTP_HOST']);
    die();
  }

  $gallery = $galleries[0];
  if ((string)$gallery['password'] !== '') {
	if (!isset($_SERVER['PHP_AUTH_USER']) || $_SERVER['PHP_AUTH_USER'] != (string)$gallery['id'] || $_SERVER['PHP_AUTH_PW'] != (string)$gallery['password']) {
		header('WWW-Authenticate: Basic realm="Galeria prywatna"');
		header('HTTP/1.0 401 Unauthorized');
		echo 'Access denied';
		exit;
	} 
  }  
  
  $photos = $gallery[0]->xpath('photo');
  if (preg_match('/^([0-9]+)(,.*)?$/', $args[1], $m)) {
	$args[1] = $m[1];
  }
  if ($args[1] == 'rand') {
	$args[1] = rand(1, sizeof($photos));
	$random = true;
  }
  $photo = (is_numeric($args[1]) && array_key_exists((int)$args[1]-1, $photos)) ? $photos[(int)$args[1]-1] : null;

  if ($photo)
  {
	$canonical = '/'.$gallery['id'].'/'.$args[1].((string)$photo['title'] ? ','.urlencode(strtr((string)$photo['title'], '/', '.')) : '');
	if (!$random && $canonical !== $_SERVER['REQUEST_URI']) {
		header("HTTP/1.1 301 Moved Permanently");
		header("Location: http://".$_SERVER['HTTP_HOST'].$canonical);
		die();
	}
  
  
    $photono = "{$args[1]} z ".sizeof($photos); 
    $subtitle = (string)$photo['title'] ? (string)$photo['title'] : "zdjęcie $photono";
    
    $ctitle = (string)$gallery['index'] ? 'Z' : (string)$gallery['title'].' - z';
    $ctitle .= "djęcie {$photono}";
    if ((string)$photo['title']) $ctitle .= " - ".$photo['title'];
    
    $modules = array(
      array('breadcrumb', array('current'=>$ctitle, 'path'=>array('/'=>'Strona główna', '/gallery-'.$gallery['category'].'.html'=>$menuitems['galleries']['gallery-'.$gallery['category']], '/'.$args[0]=>$gallery['title']))), 
      array('photo', array('id'=>(int)$args[1], 'gallery'=>$gallery, 'template'=>'views/photo.html', 'path'=>'photos_', 'filepath'=>'photos')),
    );
    if (!(int)$gallery['index']) unset($modules[0][1]['path']['/'.$args[0]]);
    $tpl->set('class', 'photo');
	$title = (string)$photo['title'] ? ((string)$photo['title'].' ('.(string)$gallery['title'].')') : ((string)$gallery['title'].(' - Zdjęcie '.$args[1].' z '.sizeof($photos)));
	$description = $gallery['description'];
	$customVars['gallery'] = array(1, (string)$gallery['id'], 3);
    //$title = "{$gallery['title']} - {$subtitle}";
	
    if ((int)$gallery['index']) {
		$tpl->set('index', array('link'=>'/'.$args[0]));
	}	
	$tpl->set('start', array('link'=>'/'.$args[0].'/1'));
  }
  else if ($args[1] === 'big')
  {
    if ((string)$gallery['category']) {
		$path = array(
		  '/'=>'Strona główna',
		  '/gallery-'.$gallery['category'].'.html'=>$menuitems['galleries']['gallery-'.$gallery['category']],
		  '/'.$gallery['id']=>$gallery['title']
  	    );
	}
	else {
		$path = array(
		  '/'=>'Strona główna',
		  '/'.$gallery['id']=>$gallery['title']
  	    );
	}
    $modules = array(
      array('breadcrumb', array('current'=>$gallery['title'].' (wersja 990px)', 'path'=>$path)),
      array('bigindex', array('gallery'=>$gallery, 'template'=>'views/bigindex.html', 'path'=>'photos_')),
    );
	$tpl->set('canonical', '/'.$gallery['id']);
    $tpl->set('class', 'bigindex');
    $title = (string)$gallery['title'].' - galeria zdjęć';
	$description = (string)$gallery['title'] . ' - ' . (string)$gallery['description'];
	$customVars['gallery'] = array(1, (string)$gallery['id'], 3);
  }
  else
  {
    if (!(int)$gallery['index'])
    {
      header("HTTP/1.1 301 Moved Permanently");
      header("Location: http://".$_SERVER['HTTP_HOST']."/{$args[0]}/1");
      die();
    }
  
    $modules = array(
      array('breadcrumb', array('current'=>$gallery['title'], 'path'=>array('/'=>'Strona główna', '/gallery-'.$gallery['category'].'.html'=>$menuitems['galleries']['gallery-'.$gallery['category']]))),
      array('photoindex', array('gallery'=>$gallery, 'template'=>'views/photoindex.html', 'path'=>'photos')),
    );
    $tpl->set('class', 'photoindex');
    $title = (string)$gallery['title'].' - galeria zdjęć';
	$description = (string)$gallery['title'] . ' - ' . (string)$gallery['description'];
	$customVars['gallery'] = array(1, (string)$gallery['id'], 3);
  }
}






if (preg_match('/^(.*)\.html$/', $args[0], $matches))
{
  $page = $matches[1];
  
  if (!array_key_exists($page, array_merge($menuitems['site'], $menuitems['galleries'], $menuitems['hidden']))) $page = 'home';

  foreach($menuitems['site'] as $id=>$item) $menuitems['site'][$id] = array('url'=>'/'.$id.'.html', 'content'=>$item);
  foreach($menuitems['galleries'] as $id=>$item) $menuitems['galleries'][$id] = array('url'=>'/'.$id.'.html', 'content'=>$item);
  foreach($menuitems['hidden'] as $id=>$item) $menuitems['hidden'][$id] = array('url'=>'/'.$id.'.html', 'content'=>$item);

  $modules = array(
    array('menu', array('id'=>'topmenu', 'items'=>$menuitems['site'], 'current'=>$page)),
    array('header'),
    array('menu', array('id'=>'bottommenu', 'items'=>$menuitems['galleries'], 'current'=>$page)),
  );
  if (in_array($page, array('biography', 'links', 'home')))
  {
    $modules[] = array('html', array('file'=>'static/'.$page.'.html'));
    $title = $menuitems['site'][$page]['content'];
    if ($page == 'home') $title = "Galeria fotografii";
	$title = "Jacek Karczmarczyk - ".$title;
  }
  else if (array_key_exists($page, $menuitems['hidden']))
  {
    $modules[] = array('html', array('file'=>'static/'.$page.'.html'));
    $title = $menuitems['hidden'][$page]['content'];
	$title = "Jacek Karczmarczyk - ".$title;
  }
  else if (in_array($page, array('contact')))
  {
    $modules[] = array('mailer', array(
      'template_form'=>'views/contact.html',
      'template_sent'=>'views/contact_sent.html',
      'from'=>$_POST['from'],
      'fromname'=>$_POST['fromname'],
      'to'=>'jacek@karczmarczyk.pl',
      'toname'=>'Jacek Karczmarczyk',
      'message'=>$_POST['message'],
      'host'=>'karczmarczyk.pl',
      'username'=>'j.karczmarczyk@larch.nazwa.pl',
      'password'=>'pocztabuxVW16'
    ));
    $title = "Jacek Karczmarczyk - ".$menuitems['site'][$page]['content'];
  }
  else if (array_key_exists($page, $menuitems['galleries']))
  {
    $modules[] = array('galleries', array('data'=>$galleries, 'template'=>'views/galleries.html', 'images'=>'photos', 'category'=>str_replace('gallery-', '', $page)));
    $title = "Galeria zdjęć \"".$menuitems['galleries'][$page]['content']."\"";
  }

  $modules[1][1]['content'] = $title;
  $tpl->set('class', $page);
}

$customVarsStr = '';
if (is_array($customVars)) {
	foreach($customVars as $var=>$value) {
		$customVarsStr .= '_gaq.push(["_setCustomVar", ' . $value[0] . ', "' . addslashes($var) . '", "' . addslashes($value[1]) . '", ' . $value[2] . ']); ';
	}
}


$body = '';
foreach($modules as $module) $body .= addModule($module[0], $module[1], $tpl);
$tpl->set('body', $body);
$tpl->set('css', isset($_GET['css']) ? $_GET['css'] : '1.0');
$tpl->set('title', $title);
$tpl->set('description', $description ? $description : $title);
$tpl->set('customVars', $customVarsStr);
$tpl->set('serverTime', date("Y-m-d H:i:s"));
echo $tpl->execute();


function addModule($name, $args, $tpl)
{
  $name = strtolower(trim($name));

  if (!class_exists('module_'.$name))
  {
    if (!is_array($args)) $args = array();
    $filename = 'modules/module_'.$name.'.php';
  
    if (!file_exists($filename)) 
    {
      return "\n\n<!-- ERROR: Module '$name' not found! -->\n\n";
    }
  
    include_once($filename);
    if (!class_exists('module_'.$name))
    {
      return "\n\n<!-- ERROR: Class 'module_$name' not found! -->\n\n";
    }
  }
  
  $classname = 'module_'.$name;
  $module = new $classname;
  foreach($args as $key=>$value) $module->set($key, $value);
  $module->set('parentTemplate', $tpl);
  
  return "\n\n<!-- $name BEGIN -->\n".$module->execute()."\n<!-- $name END -->\n\n";
}


class Gallery_Manager
{
  private $filename;
  private $dom;
  private $xpath;
  public function __construct($filename) {
    $this->filename = $filename;
    $this->dom = new DOMDocument();
    $this->dom->load($filename);
    $this->xpath = new DOMXPath($this->dom);
  }
  public function createGallery($id, $category, $title, $description) {
    $gallery = $this->dom->createElement('gallery');
    $gallery->setAttribute('id', $id);
    $gallery->setAttribute('category', $category);
    $gallery->setAttribute('title', $title);
    $gallery->setAttribute('description', $description);
    $this->dom->documentElement->appendChild($gallery);
    $this->update(); 
  }
  public function removeGallery($id) {
    foreach($this->xpath->query('//gallery[@id="'.$id.'"]') as $gallery)
      $gallery->parentNode->removeChild($gallery); 
    $this->update(); 
  }  
  public function getGallery($id) {
    foreach($this->xpath->query('//gallery[@id="'.$id.'"]') as $gallery)
      return new Gallery($this, $gallery);
  }
  public function getGalleries($category='') {
    $galleries = array();
    foreach($this->xpath->query('//gallery[@category="'.$category.'"]') as $gallery)
      $galleries[] = new Gallery($this, $gallery);
    return $galleries;
  }
  public function update()
  {
    $this->dom->save($this->filename);
  }
}

class Gallery
{
  public function __construct(Gallery_Manager $manager, DOMElement $gallery) { }
  public function setTitle($title) { }
  public function setDescription($description) { }
  public function setCategory($description) { }
  public function setPath($path) { }
  public function addPhoto($src, $thumbnail, $title) { }
  public function removePhoto($no) { }
  public function getPhoto($no) { }
  public function getPhotos() { }
  public function update()
  {
    $this->manager->update();
  }
}

class Photo
{
  public function __construct(Gallery $gallery) { }
  public function setSrc($src) { }
  public function setThumbnail($thumbnail) { }
  public function setTitle($title) { }
  public function getGallery() { }
  public function update()
  {
    $this->manager->update();
  }
}
