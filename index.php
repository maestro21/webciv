<!DOCTYPE HTML>
<html>
	<head>
		<script src="jquery.min.js"></script>
		<style>
		body { background-color:black;}
		#console {color:white}
		#cp, .map {
			display:inline-block;
			vertical-align:top;
			position:relative;
		}
		
		.layer {
			position:absolute;
			top:0; left:0;
		}
		
		#terrain2 {
			z-index:10;
		}
		</style>
	</head>
	<body>
		<div id="cp">
			<canvas id="minimap" width=100 height=100></canvas>	
			<div id="console"></div>	
		</div>
		
		<div class="map" id="map">
			<canvas id="terrain2" width="2500px" height="1000px" class="layer"></canvas>			
			<canvas id="terrain" width="2500px" height="1000px" class="layer"></canvas>
		</div>
		
		<div id="console"></div>
		<script type="text/javascript" src="resources.js"></script>  
		<script type="text/javascript" src="map.js?efwe"></script>
			

</html>
