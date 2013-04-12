var ScreenWidth = 960;
var ScreenHeight = 540;

var Player = {
	plugin : null,
	state : -1,
	stopCallback : null,

	STOPPED : 0,
	PLAYING : 1,
	PAUSED : 2,
	FORWARD : 3,
	REWIND : 4,
	duration : 0,
    current_time : 0
};

Player.init = function() {
	var success = true;

	this.state = this.STOPPED;
	this.plugin = document.getElementById("pluginPlayer");
	this.mwPlugin = document.getElementById("pluginObjectTVMW");

        if (!this.plugin )
        {
        success = false;
        }
        if (!this.mwPlugin || !this.mwPlugin.GetSource) 
        {
        success = false;
        } 
        else 
		{
        this.originalSource = this.mwPlugin.GetSource();
        this.mwPlugin.SetMediaSource();
        }
	this.setWindow();

	this.plugin.OnCurrentPlayTime = 'Player.setCurTime';
	this.plugin.OnStreamInfoReady = 'Player.setTotalTime';
//	this.plugin.OnBufferingStart = 'Player.onBufferingStart';
//	this.plugin.OnBufferingProgress = 'Player.onBufferingProgress';
//	this.plugin.OnBufferingComplete = 'Player.onBufferingComplete';

	return success;
};

Player.deinit = function()
{
	if (this.plugin)
		this.plugin.Stop();
	if(this.mwPlugin != null)
        this.mwPlugin.SetMediaSource(this.originalSource);
};

Player.setWindow = function() // видео скрыто
{
	this.plugin.SetDisplayArea(ScreenWidth, ScreenHeight, 0, 0); // 458, 58,
																	// 472, 270
};

Player.setFullscreen = function() // полноэкранный режим
{
	this.plugin.SetDisplayArea(0, 0, ScreenWidth, ScreenHeight);
};

// переключение типа полноэкранного режима, значения от 1 до 5
Player.setScreenMode = function(modesize) {
	var w = this.plugin.GetVideoWidth();
	var h = this.plugin.GetVideoHeight();
	if (w <= 0 || h <= 0)
		return -1;

	var wCorr = w < (h * 4 / 3) ? h * 4 / 3 : w;
	var crop = {
		x : 0,
		y : 0,
		w : w,
		h : h
	};
	var disp = {
		x : 0,
		y : 0,
		w : ScreenWidth,
		h : ScreenHeight
	};

	var result = ((!modesize) ? 1 : modesize) + "";

	switch (result) {
	case "1":
		if (h / w > 9 / 16) {
			var h1 = wCorr * 9 / 16;
			crop = {
				x : 0,
				y : (h - h1) / 2,
				w : w,
				h : h1
			};
		} else {
			var w1 = h * 16 / 9;
			crop = {
				x : (w - w1) / 2,
				y : 0,
				w : w1,
				h : h
			};
		}
		break;
	case "2":
		if (h / w > 9 / 16) {
			var h1 = ScreenHeight;
			var w1 = h1 * wCorr / h;
			var x = (ScreenWidth - w1) / 2;
			if (x < 0)
				x = 0;
			disp = {
				x : x,
				y : 0,
				w : w1,
				h : h1
			};
		} else {
			var w1 = ScreenWidth;
			var h1 = w1 * h / w;
			var y = (ScreenHeight - h1) / 2;
			if (y < 0)
				y = 0;
			disp = {
				x : 0,
				y : y,
				w : w1,
				h : h1
			};
		}
		;
		break;

	default:
	case "3":
		break;
	case "4":
		crop = {
			x : 80,
			y : 80,
			w : w - 160,
			h : h - 160
		};
		break;
	case "5":
		crop = {
			x : 0,
			y : 0.0625 * h,
			w : w,
			h : 0.875 * h
		};
		break;
	}

	this.plugin.SetDisplayArea(disp.x, disp.y, disp.w, disp.h);
	this.plugin.SetCropArea(crop.x, crop.y, crop.w, crop.h);
	return result;
};

Player.playVideo = function() // играть
{
	//alert(url);
	this.state = this.PLAYING;
	// this.setWindow();
	this.plugin.Play(url);
	Display.showplayer();
	Main.setFullScreenMode();
	document.getElementById("main").style.display = "none";
	Player.setFullscreen();
	this.plugin.SetDisplayArea(0, 0, ScreenWidth, ScreenHeight); 
};

Player.pauseVideo = function() // пауза
{
	this.state = this.PAUSED;
	this.plugin.Pause();
	Display.showplayer();
	document.getElementById("but_pause").style.display="block";
	document.getElementById("but_play").style.display="none";
};

Player.stopVideo = function() // стоп
{
	// Display.setTime(0);
	if (this.state != this.STOPPED) {
		this.plugin.Stop();
		this.state = this.STOPPED;
		if (this.stopCallback) {
			// this.stopCallback();
		}
		Main.setWindowMode(); 
		document.getElementById("main").style.display = "block";
		Display.hideplayer();
	}
};

Player.resumeVideo = function() // стоп кадр
{
	this.state = this.PLAYING;
	this.plugin.Resume();
    Display.showplayer();
	document.getElementById("but_pause").style.display="none";
	document.getElementById("but_play").style.display="block";
};

Player.getState = function() // текущее состояние
{
	return this.state;
};

Player.skipForwardVideo = function() {

	this.skipState = this.FORWARD;
	this.plugin.JumpForward(30);
	Display.showplayer();
};

Player.skipForwardVideoFast = function() {

	this.skipState = this.FORWARD;
	this.plugin.JumpForward(120);
	Display.showplayer();
};

Player.skipBackwardVideo = function() {

	this.skipState = this.REWIND;
	this.plugin.JumpBackward(30);
	Display.showplayer();
};

Player.skipBackwardVideoFast = function() {

	this.skipState = this.REWIND;
	this.plugin.JumpBackward(120);
	Display.showplayer();
};

Player.PercentJump = function(percent) 
{
                if(this.jump==0)
                {
                    this.statusmessage = percent*10 + "%";
                    var jump_to_minutes = (this.duration*percent/10 - this.current_time)/1000;
                                if (jump_to_minutes > 0)
                                {
                                    this.plugin.JumpForward(jump_to_minutes); 
                                    this.jump=1;
                                }
                                else if (jump_to_minutes < 0)
                                {
                                    this.plugin.JumpBackward(jump_to_minutes*-1);
                                    this.jump=1;

                                }
                                widgetAPI.putInnerHTML(Display.statusDiv,(this.statusmessage));
                                if(this.jump==1)
                                {
                                    this.state = this.PAUSA;
                                    Display.showplayer();
                                    clearTimeout(Display.loadingshow_timer);
                                }
                }
};

// функция таймера проигрывания трека, вызывается плагином:
// plugin.OnCurrentPlayTime
Player.setCurTime = function(time) {
	Display.setTime(time);
};
// функция размера трека, вызывается плагином: plugin.OnStreamInfoReady

Player.setTotalTime = function() {
	Display.setTotalTime(Player.plugin.GetDuration());
};