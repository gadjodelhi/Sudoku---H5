<?php

require_once 'module_abstract.php';

class Module_breadcrumb extends Module_abstract
{
  public function execute()
  {
    $html = '<nav class="breadcrumb"><ul>';
    foreach($this->path as $link=>$name)
	  if ($name)
        $html .= '<li><a href="'.htmlspecialchars($link).'">'.htmlspecialchars($name).'</a></li>';
    $html .= '<li><strong>'.(string)$this->current.'</strong></li>';
    $html .= '</ul></nav>';
    return $html;
  }
}