<?php
header('Access-Control-Allow-Origin: *');

function getTerrain($id){

	$terrain = array('desert','grassland', 'plains', 'forrest2' ,'hills', 'mountains');
	if($id > (count($terrain) - 1))
		return 'water';
	else 
		return $terrain[$id];

}


function loadmap() {
	$map = array();
	for($i = 0; $i < 100; $i++) {
		$row = array();
		for($j = 0; $j < 100; $j++) {
			$cell = array(
				"unit" 		 => rand(0,54),
				"terrain" 	 => getTerrain(rand(0,15)),
				/*"city"		 => rand(0,101),
				"irrigation" => rand(0,11),
				"road"		 => rand(0,1),
				"terrain2"	 => rand(0,13),*/
			);
			$row[$j] = $cell;
		}
		$map[$i] = $row;
	}
	return json_encode($map);
}

$do = $_REQUEST['do'];
if(function_exists($do)) {
	echo $do();
}