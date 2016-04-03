


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
	var imgext = '2.png';
	
	resources.load([	
		imgprefix + 'desert' + imgext,
		imgprefix + 'grassland' + imgext,
		imgprefix + 'water' + imgext,
		imgprefix + 'plains' + imgext,
		imgprefix + 'forrest2' + imgext,
		imgprefix + 'hills' + imgext,
		imgprefix + 'mountains' + imgext,
	]);
	
	
	function Map(x, y) {

		this.w = x;
		this.h = y;	
			
		this.minimap = function() {
			var color;
			var terrain;
			var r; var g; var b; var a = 255;
			var mctx = document.getElementById('minimap').getContext('2d');
			var id = mctx.createImageData(1,1); 
			var d  = id.data;

			for(j = 0 ; j < this.h; j++){
				for( i = 0 ; i < this.w; i++) {
					terrain = cells[i][j].terrain.toString();
					switch(terrain) {
						case 'water': r = 0; g = 0; b = 255; break;
						case 'grassland': r = 0; g = 255; b = 0; break;
						case 'plains': r = 255; g = 255; b = 0;break;
						case 'hills': r = 255; g = 255; b = 0;break;	
						case 'mountains': r = 255; g = 255; b = 0;break;
						case 'forrest2': r = 255; g = 255; b = 0;break;						
					}
					d[0]   = r;
					d[1]   = g;
					d[2]   = b;
					d[3]   = a;
					mctx.putImageData( id, i, j );
				}
			}
			
			/* cursor */
			mctx.fillStyle="red";
			mctx.strokeStyle="white";	
			mctx.lineWidth = 2;			
			mctx.clearRect(0, 0, mctx.width, mctx.height);
			mctx.beginPath();
			mctx.rect(screen.offsetX, screen.offsetY, screen.w, screen.h);
			mctx.stroke();
			mctx.fillRect(cursor.absx - 1, cursor.absy - 1, 3, 3);
		}	
			
		
		$.ajax({
		  url: 'http://localhost/civ/game.php?do=loadmap',
		  context: document.body,
		  dataType:"json",
		}).done(function(data) {
			cells = data;
			screen.draw();
			map.minimap();
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
		
		this.moveTo = function(x,y) {
			cursor.absx = x;
			cursor.absy = y;
			console.log(x + ' ' + y);
			var w05; var h05;
			cursor.x = w05 = Math.floor(this.w / 2);
			cursor.y = h05 = Math.floor(this.h / 2);
			
			if(cursor.absx < cursor.x) {
				cursor.x = cursor.absx;
				this.offsetX = 0;
			} else if(cursor.absx > map.w - w05) {
				this.offsetX = map.w - this.w;
				cursor.x = cursor.absx - this.offsetX;
			} else {
				cursor.x = w05;
				this.offsetX = cursor.absx - cursor.x;
			}

			if(cursor.absy < cursor.y) {
				cursor.y = cursor.absy;
				this.offsetY = 0;
			} else if(cursor.absy > map.h - h05) {				
				this.offsetY = map.h - this.h;
				cursor.y = cursor.absy - this.offsetY;
			} else {
				cursor.y = w05;
				this.offsetY = cursor.absy - cursor.y;
			}
			
			console.log(cursor.x + ' ' + cursor.y + ' abs:' + cursor.absx + ' ' + cursor.absy);
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
			map.minimap();
		}
		
		this.drawCell = function(x,y){
			switch(this.mode) {
				case '2d': this.draw2dCell(x,y);			
			}
		}
		
		this.draw2dCell = function(x,y) {
			//console.log(x + ' ' + y);
			var terrain = cells[x][y].terrain.toString();
			var tx = (x - this.offsetX) * this.cellw -16;
			var ty = (y - this.offsetY) * this.cellh -16;
			if(x == 0) tx -= 16;
			if(y == 0) ty -= 16;
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
			$('#console').html(cells[cursor.absx][cursor.absy].terrain.toString() + ' (' + 
			(cursor.absx + 1) + ',' + (cursor.absy + 1) + ')');
			/*$('#console').html('Cursor: x - ' + (cursor.x +1) + ', y - ' + (cursor.y + 1) + 
			'<br> Offset: x - ' + this.offsetX + ' y - ' + this.offsetY + 
			'<br> Cell: x - ' + (cursor.absx + 1) + ' y - ' + (cursor.absy + 1) + 
			' Terrain: ' + cells[cursor.absx][cursor.absy].terrain.toString());*/
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
	
	$('#minimap').click(function(e) {
		var offset = $(this).offset();
		var dX = e.pageX - offset.left;
		var dY = e.pageY - offset.top;
		screen.moveTo(dX,dY);
		screen.findOffset();
		screen.draw();
	});
	
	/*$('#' + id).bind('contextmenu', function(e){
		e.preventDefault();	
		var offset = $(this).offset();
		screen.redraw(e,offset);	
		return false;
	}); 	*/
	
})();



