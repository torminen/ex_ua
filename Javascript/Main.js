var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var pluginAPI = new Common.API.Plugin();

var Main = {
	mode : 0, // состояние полноэкранного режима
	WINDOW : 0,
	FULLSCREEN : 1,
	currentFSMode : 1, // тип полноэкранного режима

	sURL : "", // адрес страниы альбома

	index : 1, // номер активного канала
	smeh : 6, // смещение при перемещении верх-низ на странице
	string : 0, // номер строки с общими списками

	playlist : 0,
	sta : 0, // пауза или играть с начала

	janrURL : "http://www.ex.ua/ru/video/foreign",
	search : "?", // search : "?", search : "'>",
	POISK : 0,
	
	TVPlugin : 0,
	Audio : 0,
	audio_output_device : 0,
	hardware : 0,
	hardware_type : 0,
	serieC : false,
	serieE : false,
	serieB : false,
	serieText:"", // текстовая версия ТВ
	version_vidget : "0.9.5.4",
	mute : 0,
    NMUTE : 0,
    YMUTE : 1
};

var b = 1; // индекс активной строки
var c = 1; // индекс прошлой активной строки
var url = ""; // адрес стрима файла mp3

Main.onLoad = function() {
	
	this.Audio = document.getElementById('pluginAudio');
	this.audio_output_device = this.Audio.GetOutputDevice();
	this.TVPlugin = document.getElementById("pluginTV");
	this.hardware_type = this.TVPlugin.GetProductType();
	this.hardware = this.TVPlugin.GetProductCode(1);
	this.hardware_char=this.hardware.substring(4,5);
	alert (this.hardware );
	
	if(this.hardware.indexOf("C")>0){
		Main.serieC = true; Main.serieText ="C-series";		
	} else {
	if (this.hardware.indexOf("E") > 1 || (this.hardware.indexOf("C") < 0 && this.hardware.indexOf("D") < 0)) {
		Main.serieE = true;Main.serieText ="E-series";
		};
	};	
	if (this.hardware.indexOf("B") > 1) {
		Main.serieB = true;Main.serieText ="B-series";
		}			
		
	if (Player.init() && Audio.init() && Display.init()) {
		window.onShow = Main.onShowEventTVKey; // Стандартный индикатор
		widgetAPI.sendReadyEvent();// Сообщаем менеджеру приложений о готовности		
		document.getElementById("anchor").focus(); // Помещение фокуса на элемент "anchor"
		document.getElementById("playlist").style.display = "none";
		document.getElementById("plain").style.display = "none";
		document.getElementById("search").style.display = "none";
		document.getElementById("black").style.display = "none";
		widgetAPI.putInnerHTML(document.getElementById("vidget_ver_span"),"Model:"+this.hardware+"   Type:"+this.hardware_char+"   v."+Main.version_vidget);
		// адрес запроса
		this.sURL = this.janrURL + '?v=1,0&p=' + this.string + '&per=18';

		URLtoXML.Proceed(this.sURL);
		Display.setTime(0); // выставляем 0:00:00/0:00:00
		// громкости
		$('#svecKeyHelp_IIZH').sfKeyHelp({
			'TOOLS' : 'Поиск',
			'NUMBER' : 'Категория',
			'UPDOWN' : 'Позиция',
			'leftright' : 'Позиция',
			'Enter' : 'Выбор',
			'Exit' : 'Выход',
		});
	};
};

// Стандартный индикатор громкости
Main.onShowEventTVKey = function() {
 if(Main.serieC==false)
	pluginAPI.SetBannerState(1);
	pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
	pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
	pluginAPI.unregistKey(tvKey.KEY_MUTE);
	pluginAPI.setOffScreenSaver();
};
Main.onUnload = function() {
	Player.deinit();
	URLtoXML.deinit();
};
Main.keyDown = function() {
	var keyCode = event.keyCode;
	switch (keyCode) {
	case tvKey.KEY_EXIT:
		//alert("KEY_EXIT");
		widgetAPI.blockNavigation(event); //отменяем заводскую реакцию на событие.
		widgetAPI.sendReturnEvent();// <- выполняем выход из виджета ВОЗВРАТОМ в смартхаб - вместо закрытия смартхаба по widgetAPI.sendExitEvent();
		break;
	case 75: // поиск
		if (this.playlist == 0){
			/// если мы 0-м уровне - поиск работает.
		if (this.POISK == 0) {
			document.getElementById("title").style.display = "none";
			document.getElementById("janr").style.display = "none";


			document.getElementById("search").style.display = "block";
			document.getElementById("plain").style.display = "block";
			document.getElementById("black").style.display = "block";

			Search.Input();
			}
		};
		break;
	case tvKey.KEY_1:
	Player.PercentJump(1);
		Main.NewJanr("http://www.ex.ua/ru/video/foreign",
				"Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Зарубежные фильмы");
		break;
	case tvKey.KEY_2:
	Player.PercentJump(2);
		Main.NewJanr("http://www.ex.ua/ru/video/foreign_series",
				"Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Зарубежные сериалы");
		break;
	case tvKey.KEY_3:
		Main.NewJanr("http://www.ex.ua/ru/video/our",
				"Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Наше кино");
		break;
	case tvKey.KEY_4:
		Main.NewJanr("http://www.ex.ua/ru/video/our_series",
				"Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Наши сериалы");
		break;
	case tvKey.KEY_5:
		Main.NewJanr("http://www.ex.ua/ru/video/cartoon",
				"Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Мультфильмы");
		break;
	case tvKey.KEY_6:
		Main.NewJanr("http://www.ex.ua/ru/video/anime",
				"Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Аниме");
		break;
	case tvKey.KEY_7:
		Main.NewJanr("http://www.ex.ua/ru/video/documentary",
				"Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Документальное");
		break;
	case tvKey.KEY_8:
		Main.NewJanr("http://www.ex.ua/ru/video/show",
				"Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Шоу и Передачи");
		break;
	case tvKey.KEY_9:
		Main.NewJanr("http://www.ex.ua/ru/video/sport",
				"Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Спорт");
		break;
	case tvKey.KEY_0:
		Main.NewJanr("http://www.ex.ua/ru/video/trailer",
				"Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Трейлеры");
		break;

	case tvKey.KEY_INFO:
		Display.showplayer();
		break;
		
	case tvKey.KEY_RED:
//		Favorites.open();
		break;
		
	case tvKey.KEY_YELLOW:
//		Favorites.save();
		break;
		
	case tvKey.KEY_BLUE: // переключение типа полноэкранного режима (циклично от
		// 1 до 5, начальное значение 2)
		if (this.mode == this.WINDOW) { // не переключаем в свернутом режиме
			break;
		}
		this.currentFSMode = (this.currentFSMode < 5) ? this.currentFSMode + 1
				: 1;

		Player.setScreenMode(this.currentFSMode);
		Display.statusLine ("Режим "+this.currentFSMode);
		break;
		
	case tvKey.KEY_ASPECT: // переключение типа полноэкранного режима (циклично от
		// 1 до 5, начальное значение 2)
		if (this.mode == this.WINDOW) { // не переключаем в свернутом режиме
			break;
		}
		this.currentFSMode = (this.currentFSMode < 5) ? this.currentFSMode + 1
				: 1;

		Player.setScreenMode(this.currentFSMode);
		Display.statusLine ("Режим "+this.currentFSMode);
		break;

	case tvKey.KEY_STOP:
		Player.stopVideo();
		break;

	case tvKey.KEY_PAUSE:
		this.handlePauseKey();
		break;

	case tvKey.KEY_PLAY:
		alert(url);
		Main.handlePlayKey(url);
		this.sta = 1; // играть c начала
		break;
	case tvKey.KEY_FF:
		if(Player.getState() != Player.PAUSED) {
			Player.skipForwardVideo();
		}
		break;
	case tvKey.KEY_RW:
		if(Player.getState() != Player.PAUSED) {
			Player.skipBackwardVideo();
		}
		break;

	case tvKey.KEY_RETURN:
	case tvKey.KEY_PANEL_RETURN:
		widgetAPI.blockNavigation(event); // блокируем по умолчанию RETURN 
		if ((Player.getState() == Player.PLAYING || Player.getState() == Player.PAUSED) && this.mode == this.FULLSCREEN)
		//если смотрим фильм - в любом раскладе играет или пауза - выходим. экономим на нажатии кнопки СТОП
		//зачем надо проверять режим проигрывания - на понял - по идее хватает проверки полноэкранности, но сделал  по аналогии 
		{
			Player.stopVideo();
			break;
		};////////
		this.playlist = 0;
		document.getElementById("spisok").style.display = "block";
		document.getElementById("playlist").style.display = "none";
		$('#svecKeyHelp_IIZH').sfKeyHelp({
			'TOOLS' : 'Поиск',
			'NUMBER' : 'Категория',
			'UPDOWN' : 'Позиция',
			'leftright' : 'Позиция',
			'Enter' : 'Выбор'
		});
		break;

	case tvKey.KEY_LEFT: // лево
		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN)
		{
			Player.skipBackwardVideoFast();
			break;
		}
		else{
		if (this.playlist == 0) {
			if (this.index == 1) {
				this.index = Main.NewString(0, -1) ? 18 : 1;
				Main.ActivString(0);
			}
			else {
				Main.ActivString(-1);
				}
			}
			break;
		}

	case tvKey.KEY_RIGHT: // право
		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN) {
			Player.skipForwardVideoFast();
			break;
		}
		else
		{
		if (this.playlist == 0) {
			if (this.index == 18) {
				this.index = 1;
				Main.NewString(0, 1);
				Main.ActivString(0);
			}
			else {
				Main.ActivString(1);
				}
			}
			break;
		}

	case tvKey.KEY_UP:
		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN) {
			Player.skipForwardVideoFast();
			break;
		}
		
		if (this.playlist == 0) {
			this.smeh = -6;
			if (this.index == 1 || this.index == 2 || this.index == 3
					|| this.index == 4 || this.index == 5 || this.index == 6) {
				Main.NewString(12, -1);
			}// переход поиска вверх
			Main.ActivString(this.smeh);// активная строка
		} else if (this.playlist == 1) {
			this.selectUpVideo();
		}
		break;

	case tvKey.KEY_DOWN:
		if (Player.getState() == Player.PLAYING && this.mode == this.FULLSCREEN) {
			Player.skipBackwardVideoFast();
			break;
		}
		
		if (this.playlist == 0) {
			this.smeh = 6;
			if (this.index == 13 || this.index == 14 || this.index == 15
					|| this.index == 16 || this.index == 17 || this.index == 18) {
				Main.NewString(-12, 1);
			}// переход поиска вниз
			Main.ActivString(this.smeh);// активная строка
		} else if (this.playlist == 1) {
			this.selectNextVideo();
			this.sta = 1; // играть c начала
		}
		break;

	case tvKey.KEY_ENTER:
	case tvKey.KEY_PANEL_ENTER:

		if (this.playlist == 0) {
			this.playlist = 1;
			Main.handleActiv();
			for ( var h = 1; h <= 200; h++) {
				widgetAPI.putInnerHTML(document.getElementById("str" + h), "");
			}

			URLtoXML.xmlHTTP = null;
			this.sURL = URLtoXML.UrlSt[this.index]; // адрес страницы альбома
			URLtoXML.Proceed(this.sURL);
			document.getElementById("spisok").style.display = "none";
			document.getElementById("playlist").style.display = "block";
			document.getElementById("descript").style.display = "block";
			widgetAPI.putInnerHTML(document.getElementById("description"),
				"<img style='border-style: solid; border-width:10px; border-color:#3399FF; margin:10px; max-width: 200px; max-height: 200px; border-radius:5px; box-shadow:0 0 13px black; 'src='"
					+ URLtoXML.ImgDickr[this.index].replace("?100", "100")
					+ "max-width: 200px; max-height: 200px; ' align='left'"
					+ URLtoXML.pDes[this.index]);
		}
		else if (this.playlist == 1) {
			this.sta = 1;
			url = URLtoXML.pUrlSt[b];
			Main.handlePlayKey(url);
			widgetAPI.putInnerHTML(document.getElementById("description"),
				"<img style='border-style: solid; border-width:10px; border-color:#3399FF; margin:10px; max-width: 200px; max-height: 200px;  border-radius:5px; box-shadow:0 0 13px black;' src='"
					+ URLtoXML.ImgDickr[this.index].replace("?100", "100")
					+ "max-width: 200px; max-height: 200px; ' align='left'"
					+ URLtoXML.pDes[this.index]);
		}
		$('#svecKeyHelp_IIZH').sfKeyHelp({
			'BLUE' : 'Формат',
			'UPDOWN' : 'Позиция',
			'Enter' : 'Выбор',
			'return' : 'Назад'
		});
		break;

	case tvKey.KEY_VOL_UP:
	case tvKey.KEY_PANEL_VOL_UP: // громкость +
		if (this.mute == this.YMUTE) Main.noMuteMode();
		Audio.setRelativeVolume(0);
		break;

	case tvKey.KEY_VOL_DOWN:
	case tvKey.KEY_PANEL_VOL_DOWN: // громкость -
		if (this.mute == this.YMUTE) Main.noMuteMode();
		Audio.setRelativeVolume(1);
		break;
	
	case tvKey.KEY_MUTE:
        alert("MUTE");
        this.muteMode();
        break;
	
	default:
		alert("Unhandled key");
		break;

	}
	
	if (URLtoXML.sName[this.index].length > 180) {
		widgetAPI.putInnerHTML(document.getElementById("title"), URLtoXML.sName[this.index].substr(0, 180) + "...");
	}// название в заголовок
	else {
		widgetAPI.putInnerHTML(document.getElementById("title"), URLtoXML.sName[this.index]);
	}
	Main.ListTop();
};
// перемещение поиска по страницам
Main.NewString = function(per, a) {
	this.search = "?";
	this.smeh = per; // соответствие столбца
	this.string = this.string + a; // смещаем адресс поиска страницы
	if (this.string < 0) {// верхний предел
		this.string = 0;
		this.smeh = 0;
		return 0;
	} else {
		URLtoXML.xmlHTTP = null;
		this.sURL = this.janrURL + '?v=1,0&p=' + this.string + '&per=18'; // жанр
		// +
		// страница
		URLtoXML.Proceed(this.sURL);
		return 1;
	}
};
// активная строка
Main.ActivString = function(smeh) {
	this.smeh = smeh;
	document.getElementById("imgst" + this.index).style.borderColor = "#e9e9e9";
	this.index = this.index + this.smeh;
	document.getElementById("imgst" + this.index).style.borderColor = "#3399FF";
};

Main.ListTop = function() { // смещение списка по достижению пределов
	if (b == 16) {
		document.getElementById("list2").style.top = "-421px";
	} // переключение списка вверх 1
	if (b == 15) {
		document.getElementById("list2").style.top = "0px";
	} // переключение списка вниз 1

	if (b == 31) {
		document.getElementById("list2").style.top = "-842px";
	} // переключение списка вверх 2
	if (b == 30) {
		document.getElementById("list2").style.top = "-421px";
	} // переключение списка вниз 2

	if (b == 46) {
		document.getElementById("list2").style.top = "-1263px";
	} // переключение списка вверх 3
	if (b == 45) {
		document.getElementById("list2").style.top = "-842px";
	} // переключение списка вниз 3

	if (b == 61) {
		document.getElementById("list2").style.top = "-1684px";
	} // переключение списка вверх 4
	if (b == 60) {
		document.getElementById("list2").style.top = "-1263px";
	} // переключение списка вниз 4

	if (b == 76) {
		document.getElementById("list2").style.top = "-2105px";
	} // переключение списка вверх 5
	if (b == 75) {
		document.getElementById("list2").style.top = "-1684px";
	} // переключение списка вниз 5

	if (b == 91) {
		document.getElementById("list2").style.top = "-2526px";
	} // переключение списка вверх 6
	if (b == 90) {
		document.getElementById("list2").style.top = "-2105px";
	} // переключение списка вниз 6
	
	if (b == 106) {
		document.getElementById("list2").style.top = "-2947px";
	} // переключение списка вверх 7
	if (b == 105) {
		document.getElementById("list2").style.top = "-2526px";
	} // переключение списка вниз 7

	if (b == 121) {
		document.getElementById("list2").style.top = "-3368px";
	} // переключение списка вверх 8
	if (b == 120) {
		document.getElementById("list2").style.top = "-2947px";
	} // переключение списка вниз 8

	if (b == 136) {
		document.getElementById("list2").style.top = "-3789px";
	} // переключение списка вверх 9
	if (b == 135) {
		document.getElementById("list2").style.top = "-3368px";
	} // переключение списка вниз 9

	if (b == 151) {
		document.getElementById("list2").style.top = "-4210px";
	} // переключение списка вверх 10
	if (b == 150) {
		document.getElementById("list2").style.top = "-3789px";
	} // переключение списка вниз 10

	if (b == 166) {
		document.getElementById("list2").style.top = "-4631px";
	} // переключение списка вверх 11
	if (b == 165) {
		document.getElementById("list2").style.top = "-4210px";
	} // переключение списка вниз 11

	if (b == 181) {
		document.getElementById("list2").style.top = "-5052px";
	} // переключение списка вверх 12
	if (b == 180) {
		document.getElementById("list2").style.top = "-4631px";
	} // переключение списка вниз 12
	
	if (b == 196) {
		document.getElementById("list2").style.top = "-5473px";
	} // переключение списка вверх 12
	if (b == 195) {
		document.getElementById("list2").style.top = "-5052px";
	} // переключение списка вниз 12
};

Main.handlePauseKey = function() {
	switch (Player.getState()) {
	case Player.PLAYING:
		Player.pauseVideo();
		this.sta = 0; // пауза
		break;
	default:
		break;
	}
};

Main.handleActiv = function() {
	document.getElementById("list2").style.top = "0px"; // переключение списка
	// на 0
	document.getElementById("str" + b).style.color = "#c0c0c0"; // возвращение
	// цвета с
	// активного на
	// пасивный
	b = 1;
	c = 1;
	document.getElementById("str" + b).style.color = "#3399FF"; // активная
	// строка
};
Main.selectNextVideo = function() {
	if (b == 200) {
		b = 199;
	} // предел max
	b++;
	document.getElementById("str" + b).style.color = "#3399FF"; // активная
	// строка
	c = b - 1;
	document.getElementById("str" + c).style.color = "#c0c0c0"; // возвращение
	// цвета с
	// активного на
	// пасивный
	this.sta = 1;// играть c начала
};
Main.selectUpVideo = function(){
	if (b == 1) {
		b = 2;
	} // предел min
	b = b - 1;
	document.getElementById("str" + b).style.color = "#3399FF"; // активная
	// строка
	c = b + 1;
	document.getElementById("str" + c).style.color = "#c0c0c0"; // возвращение
	// цвета с
	// активного на
	// пасивный
	this.sta = 1;// играть c начала
};

Main.handlePlayKey = function(url)
{
	if (this.sta == 1) {
		Player.stopVideo();
		url = URLtoXML.pUrlSt[b];
		Player.playVideo(url);
	}
	switch (Player.getState()) {
	case Player.STOPPED:
		Player.playVideo(url);
		break;
	case Player.PAUSED:
		Player.resumeVideo();
		break;
	default:
		break;
	}
	widgetAPI.putInnerHTML(document.getElementById("description"),
		"<img style='border-style: solid; border-width:10px; border-color:#3399FF; margin:10px; max-width: 200px; max-height: 200px; border-radius:5px; box-shadow:0 0 13px black;' src='"
			+ URLtoXML.ImgDickr[this.index].replace("?100", "100")
			+ "max-width: 200px; max-height: 200px; ' align='left'"
			+ URLtoXML.pDes[this.index]
	);
	widgetAPI.putInnerHTML(document.getElementById("play_name"),URLtoXML.pName[b]);
	Main.ListTop();// смещение списка по достижению пределов
};

// перемещение поиска по страницам
Main.NewJanr = function(janr, text) {
	this.search = "?";
	URLtoXML.xmlHTTP = null;
	this.janrURL = janr;
	this.sURL = janr + '?v=1,0&p=' + this.string + '&per=18'; // жанр +
	// страница
	URLtoXML.Proceed(this.sURL);
	widgetAPI.putInnerHTML(document.getElementById("janr"), text);
};

Main.setFullScreenMode = function() {
	if (this.mode != this.FULLSCREEN) {
		document.getElementById("main").style.display = "none";
		Player.setScreenMode(this.currentFSMode);
		this.mode = this.FULLSCREEN;
	}
};

Main.setWindowMode = function() {
	if (this.mode != this.WINDOW) {
		document.getElementById("main").style.display = "block";
		Player.setWindow();
		this.mode = this.WINDOW;
	}
};

Main.toggleMode = function() {
	switch (this.mode) {
	case this.WINDOW:
		this.setFullScreenMode();
		break;

	case this.FULLSCREEN:
		this.setWindowMode();
		break;

	default:
		break;
	};
};
//////////////////////// modify MUTE mode
Main.setMuteMode = function()
	{
	    if (this.mute != this.YMUTE)
	    {
	    	Audio.plugin.SetSystemMute(true);
	    	this.mute = this.YMUTE;
	    	Display.statusMute();
	    }
};
Main.noMuteMode = function()
	{
	    if (this.mute != this.NMUTE)
	    {
	        Audio.plugin.SetSystemMute(false); 
	        this.mute = this.NMUTE;
	        Display.setVolume( Audio.getVolume() );

	    }
};

Main.muteMode = function(){
	switch (this.mute)
	{
		case this.NMUTE:
			this.setMuteMode();
	        break;
	            
	        case this.YMUTE:
	            this.noMuteMode();
	            break;
	            
	        default:
	            alert("ERROR: unexpected mode in muteMode");
	            break;
	    }
};

