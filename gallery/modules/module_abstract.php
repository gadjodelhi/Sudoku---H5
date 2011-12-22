<?php

abstract class Module_Abstract
{
  protected $vars = array();

  public function set($var, $value)
  {
    $this->vars[$var] = $value;
  }
  
  public function __get($var)
  {
    return $this->vars[$var];
  }
  
  abstract public function execute();
}
