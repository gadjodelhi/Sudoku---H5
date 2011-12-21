<?php

require_once 'module_abstract.php';

class Module_menu extends Module_abstract
{
  public function execute()
  {
    $html = "<nav id=\"".htmlspecialchars($this->vars['id'])."\">\n";
    $html .= "<ul>\n";
    $count = 0;
    foreach($this->vars['items'] as $id=>$data)
    {
      if ($count == 0)
        $class = ' class="first-child"';
      else if ($count == sizeof($this->vars['items'])-1)
        $class = ' class="last-child"';
      else
        $class = '';
      $count++;
      $html .= "<li$class>";
      if ($this->vars['current'] == $id)
        $html .= "<strong>".htmlspecialchars($data['content'])."</strong>";
      else
        $html .= "<a href=\"".htmlspecialchars($data['url'])."\">".htmlspecialchars($data['content'])."</a>";
      $html .= "</li>\n";
    }
    $html .= "</ul>";
    $html .= "</nav>\n";
    if ($this->clear) $html .= "<div style=\"clear: both\"></div>";
    return $html;
  }
}