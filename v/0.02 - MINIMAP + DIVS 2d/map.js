(function() {	
	
	
	
	//id of map element
	var id = 'map';

	//map
	var map = new Map(100,100);
	var cells;
	//cursor
	var cursor = {absx:0, absy:0, x:0, y:0}
	//screen
	var screen = new Screen(8,4, 128, 128, '2d');
	
	//var imgprefix = 'img/2d/terrain/';
	var imgext = '.png';

		
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
						case 'desert': r = 255; g = 255; b = 0;break;					
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
		
		this.createScreenGrid = function(x,y) {
			var html  = '<table class="map" cellpadding=0 cellspacing=0 border=0>';
			for(j = 0; j < y; j++) {
				html +='<tr id="row_'+j+'">';
				for(i = 0; i < x; i++) {
					html +='<td id="cell_'+i+'_'+j+'"><div class="left"><div class="top"><div class="corner"></div></div></div></td>';
				}
				html += '</tr>';			
			}
			html  += '</table>';
			$('#map').append(html);
			console.log($('.map'));
		}
		
		
		this.createScreenGrid(x,y);
		

		this.w = x;
		this.h = y;
		this.offsetX = 0;
		this.offsetY = 0;
		this.cellw = cellw;
		this.cellh = cellh;
		this.mode = mode;
		this.imgprefix = 'img/' + mode  + '/';
		this.imgext = '.png';	
		this.html  = '';

		
		cursor.x = cursor.absx = Math.floor(x / 2);
		cursor.y = cursor.absy = Math.floor(y / 2);
	
		/* finding coordinates */
		this.findCoords = function(x,y) {		
			switch(this.mode) {
				case '2d': this.find2dCoords(x,y);			
			}
		}		
		
		this.find2dCoords = function(x,y) { 
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
			//console.log(this.offsetX + ' ' + this.offsetY);
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
			for(y = this.offsetY; y < this.offsetY + screen.h; y++) {
				for(x = this.offsetX; x < this.offsetX + screen.w; x++) {
					var terrain = cells[x][y].terrain.toString();
					//console.log($('#cell_'+x+'_'+y));
					dX = x - this.offsetX;
					dY = y - this.offsetY;
					$('#cell_'+dX+'_'+dY).removeClass().addClass(terrain);
					$('#cell_'+dX+'_'+dY+ ' .top').attr('class',"top");
					$('#cell_'+dX+'_'+dY+ ' .left').attr('class',"left");
					$('#cell_'+dX+'_'+dY+ ' .corner').attr('class',"corner");
					
					if(dX > 0) $('#cell_'+dX+'_'+dY + ' .left').addClass(cells[x-1][y].terrain.toString() + '_l');
					if(y > 0) $('#cell_'+dX+'_'+dY + ' .top').addClass(cells[x][y-1].terrain.toString() + '_t');
					if(y > 0 && dX > 0) $('#cell_'+dX+'_'+dY + ' .corner').addClass(cells[x-1][y-1].terrain.toString() + '_tl');				
				}
			}
			$('#cell_'+cursor.x+'_'+cursor.y).addClass('cursor');
			map.minimap();
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



