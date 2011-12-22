<?php

require_once 'module_abstract.php';

class Module_html extends Module_abstract
{
  public function execute()
  {
    if (file_exists($this->vars['file']))
      return "<div class=\"static\">".file_get_contents($this->vars['file'])."</div>\n";
    else
      return "<!-- File ".htmlspecialchars($this->vars['file'])." not found! -->\n";
  }
}