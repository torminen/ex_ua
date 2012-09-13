var ScreenWidth = 960;
var ScreenHeight = 540;

var Player =
{
    plugin : null,
    state : -1,
    stopCallback : null,   
 
    STOPPED : 0,
    PLAYING : 1,
    PAUSED  : 2,  
    FORWARD : 3,
    REWIND  : 4 
}

Player.init = function() // функция инициализации плагина
{
    var success = true;
 
    this.state = this.STOPPED;
    this.plugin = document.getElementById("pluginPlayer");
    
    if (!this.plugin)
    {   
         success = false;
    }

    this.setWindow();
	
	this.plugin.OnCurrentPlayTime = 'Player.setCurTime';
    this.plugin.OnStreamInfoReady = 'Player.setTotalTime';
    this.plugin.OnBufferingStart = 'Player.onBufferingStart';
    this.plugin.OnBufferingProgress = 'Player.onBufferingProgress';
    this.plugin.OnBufferingComplete = 'Player.onBufferingComplete';
   
   return success;
}



Player.setWindow = function()  //видео скрыто
{
    this.plugin.SetDisplayArea(ScreenWidth, ScreenHeight, 0,0); //458, 58, 472, 270
}


Player.setFullscreen = function()  //полноэкранный режим
{
    this.plugin.SetDisplayArea(0, 0, ScreenWidth, ScreenHeight);
}

//переключение типа полноэкранного режима, значения от 1 до 5
Player.setScreenMode = function(modesize)
{
	var w = this.plugin.GetVideoWidth();
	var h = this.plugin.GetVideoHeight();
	
	var wCorr = w < h*4/3 ? h*4/3 : w;
	
	if (w <= 0 || h <= 0) return -1;
	
	var disp = {
		x: 0,
		y: 0,
		w: ScreenWidth,
		h: ScreenHeight
	};
	var crop = {
		x: 0,
		y: 0,
		w: w,
		h: h
	};
	
	var result = (modesize == null ? 1 : modesize) + "";
	
	switch (result) {
	default:
	case "1":
		if (h / w > 9 / 16) {
			var h1 = wCorr * 9 / 16;
			crop = {
				x: 0,
				y: (h - h1) / 2,
				w: w,
				h: h1
			}
		} else {
			var w1 = h * 16 / 9;
			crop = {
				x: (w - w1) / 2,
				y: 0,
				w: w1,
				h: h
			}
		}
		break;
	case "2":
		if (h / w > 9 / 16) {
			var h1 = ScreenHeight;
			var w1 = h1 * wCorr / h;
			var x = (ScreenWidth - w1) / 2;
			if (x < 0) x = 0;
			disp = {
				x: x,
				y: 0,
				w: w1,
				h: h1
			}
		} else {
			var w1 = ScreenWidth;
			var h1 = w1 * h / w;
			var y = (ScreenHeight - h1) / 2;
			if (y < 0) y = 0;
			disp = {
				x: 0,
				y: y,
				w: w1,
				h: h1
			}
		};
		break;
	case "3":
		break;
	case "4":
		var crop = {
			x: 80,
			y: 80,
			w: w - 160,
			h: h - 160
		};
		break;
	case "5":
		crop = {
			x: 0,
			y: 0.0625 * h,
			w: w,
			h: 0.875 * h
		};
		break;
	}
	
	this.plugin.SetDisplayArea(disp.x, disp.y, disp.w, disp.h);
	this.plugin.SetCropArea(crop.x, crop.y, crop.w, crop.h);
	return result;
}

Player.playVideo = function(url) // играть 
{
      alert(url);
        this.state = this.PLAYING;
        //this.setWindow();
        this.plugin.Play(url);
}

Player.pauseVideo = function()  //пауза
{
    this.state = this.PAUSED;
    this.plugin.Pause();
}

Player.stopVideo = function()  //стоп
{
   //Display.setTime(0);
    if (this.state != this.STOPPED)
    {
        this.state = this.STOPPED;
        this.plugin.Stop();
		
       
        if (this.stopCallback)
        {
            //this.stopCallback();
        }
    }

}

Player.resumeVideo = function() //стоп кадр 
{
    this.state = this.PLAYING;
    this.plugin.Resume();	
}



Player.getState = function()  //текущее состояние
{
    return this.state;
}


Player.skipForwardVideo = function()
{
    
    this.skipState = this.FORWARD;
    this.plugin.JumpForward(50); 
}

Player.skipBackwardVideo = function()
{
    
	this.skipState = this.REWIND;
    this.plugin.JumpBackward(50);
}


// функция таймера проигрывания трека, вызывается  плагином:  plugin.OnCurrentPlayTime
Player.setCurTime = function(time)
{
   Display.setTime(time);
}
// функция размера трека, вызывается  плагином:  plugin.OnStreamInfoReady
Player.setTotalTime = function()
{
   Display.setTotalTime(Player.plugin.GetDuration());
}


/*
Player.onBufferingProgress = function(percent)
{
    switch(this.skipState)
    {
        case this.FORWARD:
            document.getElementById("BackForward").innerHTML= "Buffering: " + percent + "%&nbsp;&nbsp;&nbsp;&nbsp;>>>";
            break;
        
        case this.REWIND:
            document.getElementById("BackForward").innerHTML= "Buffering: " + percent + "%&nbsp;&nbsp;&nbsp;&nbsp;<<<";
            break;
    }
}



Player.onBufferingComplete = function(percent)
{
  document.getElementById("BackForward").innerHTML= ""; 
}
*/


