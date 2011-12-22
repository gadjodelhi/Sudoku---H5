<?php

$src = 'photos/'.$_GET['source'].'/*.jpg';
foreach(glob($src) as $file) {
	print htmlspecialchars("	<photo image=\"".basename($file)."\" title=\"\" />")."<BR>\n";
}