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
		}
		</style>
	</head>
	<body>
		<div id="cp">
			<canvas id="minimap" width=100 height=100></canvas>	
			<div id="console"></div>	
		</div>
		
		<div class="map">
			<canvas id="map" width="1024" height="512"></canvas>
		</div>
		
		<div id="console"></div>
		<script type="text/javascript" src="resources.js"></script>  
		<script type="text/javascript" src="map.js"></script>
			

</html>
