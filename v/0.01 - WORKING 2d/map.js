


(function() {	
	
		
	//id of map element
	var id = 'map';
	//canvas
	var canvas = document.getElementById(id);
	var ctx = canvas.getContext("2d");
	//map
	var map = new Map(100,100);
	var cells;
	//cursor
	var cursor = {absx:0, absy:0, x:0, y:0}
	//screen
	var screen = new Screen(8,4, 128, 128, '2d');
	
	var imgprefix = 'img/2d/terrain/';
	var imgext = '.png';
	
	resources.load([	
		imgprefix + 'desert' + imgext,
		imgprefix + 'grassland' + imgext,
		imgprefix + 'water' + imgext,
	]);
	
	
	function Map(x, y) {

		this.w = x;
		this.h = y;	
			
		
		$.ajax({
		  url: 'http://localhost/civ/game.php?do=loadmap',
		  context: document.body,
		  dataType:"json",
		}).done(function(data) {
			cells = data;
			screen.draw();
		});
	}
	
	// SCREEN 
	
	function Screen(x,y, cellw, cellh, mode) {
		this.w = x;
		this.h = y;
		this.offsetX = 0;
		this.offsetY = 0;
		this.cellw = cellw;
		this.cellh = cellh;
		this.mode = mode;
		this.imgprefix = 'img/2d/terrain/';
		this.imgext = '.jpg';	
		
		cursor.x = cursor.absx = Math.floor(x / 2);
		cursor.y = cursor.absy = Math.floor(y / 2);
	
		this.findCoords = function(x,y) {		
			switch(this.mode) {
				case '2d': this.find2dCoords(x,y);			
			}
		}		
		
		this.find2dCoords = function(x,y) { console.log(x + ' ' + y); console.log(this);
			cursor.x = Math.floor(x / this.cellw);
			cursor.y = Math.floor(y / this.cellh);
			 //абсолютные координаты выбранной клетки. нужны для отрисовки курсора
			cursor.absx = cursor.x + this.offsetX;
			cursor.absy = cursor.y + this.offsetY;
			console.log(cursor);
		}		
		
		//finds new map offset;
		this.findOffset = function() {
			//отступ это текущ отступ + курсор - полэкрана
			this.offsetX = this.offsetX + cursor.x - this.w / 2;
			this.offsetY = this.offsetY + cursor.y - this.h / 2;
			console.log(this.offsetX + ' ' + this.offsetY);
			 // отступ не может быть меньше нуля
			if(this.offsetX < 0) this.offsetX = 0;
 
			// отступ не может быть больше ширины карты. неактуально для круглой карты
			if(this.offsetX > map.w - this.w) this.offsetX = map.w - this.w; 

			//та же проверка для отступа по высоте
			if(this.offsetY < 0) this.offsetY = 0;
			if(this.offsetY > map.h - this.h) this.offsetY = map.h - this.h;
			//console.log(this.offsetX + ' ' + this.offsetY);
			
			//устанавливаем курсор
			cursor.x = cursor.absx - this.offsetX;
			cursor.y = cursor.absy - this.offsetY;
		}
		
		//draws screen;
		this.draw = function() {
			ctx.clearRect(0, 0, 1024, 512);
			for(y = this.offsetY; y < this.offsetY + screen.h; y++) {
				for(x = this.offsetX; x < this.offsetX + screen.w; x++) {
					this.drawCell(x,y);			
				}
			}
			this.drawCursor();
		}
		
		this.drawCell = function(x,y){
			switch(this.mode) {
				case '2d': this.draw2dCell(x,y);			
			}
		}
		
		this.draw2dCell = function(x,y) {
			//console.log(x + ' ' + y);
			var terrain = cells[x][y].terrain.toString();
			var tx = (x - this.offsetX) * this.cellw;
			var ty = (y - this.offsetY) * this.cellh;
			//console.log(tx + ' ' +  ty + ' ' + this.cellw + ' ' + this.cellh);
			ctx.drawImage(resources.get(imgprefix + terrain + imgext), tx,ty);
		}
		
		this.drawCursor = function(){
			switch(this.mode) {
				case '2d': this.draw2dCursor();			
			}
		}
		this.draw2dCursor = function(){
			ctx.beginPath();
			ctx.lineWidth="10";
			ctx.strokeStyle="white";
			var tx = cursor.x * this.cellw;
			var ty = cursor.y * this.cellh;
			ctx.rect(tx, ty, this.cellw, this.cellh);
			ctx.stroke();
			//console.log(tx + ' ' + ty);
			$('#console').html('Cursor: x - ' + (cursor.x +1) + ', y - ' + (cursor.y + 1) + 
			'<br> Offset: x - ' + this.offsetX + ' y - ' + this.offsetY + 
			'<br> Cell: x - ' + (cursor.absx + 1) + ' y - ' + (cursor.absy + 1) + 
			' Terrain: ' + cells[cursor.absx][cursor.absy].terrain.toString());
		}
		
		
		//redraws screen;
		this.redraw = function(e,offset) {
			var dx = e.pageX - offset.left;
			var dy = e.pageY - offset.top;
			this.findCoords(dx,dy);
			this.findOffset();
			this.draw();
		}
	}	
	
	//EOF SCREEN

	
	
	//finding coords
	$('#' + id).click(function(e){			
		var offset = $(this).offset();
		screen.redraw(e,offset);
	});
	
	/*$('#' + id).bind('contextmenu', function(e){
		e.preventDefault();	
		var offset = $(this).offset();
		screen.redraw(e,offset);	
		return false;
	}); 	*/
	
})();



