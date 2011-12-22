<?php

require_once 'module_abstract.php';

class Module_header extends Module_abstract
{
  public function execute()
  {
    return "<h1>".$this->vars['content']."</h1>\n";
  }
}