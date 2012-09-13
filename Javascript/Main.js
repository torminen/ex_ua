var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var pluginAPI = new Common.API.Plugin();

var Main ={
    mode : 0, // состояние полноэкранного режима
    WINDOW : 0,
    FULLSCREEN : 1,
	currentFSMode : 3, //тип полноэкранного режима (по умолчанию 16х9 без кропов)

    sURL : "", //  адрес страниы альбома
 
    index : 1, // номер активного канала
    smeh  : 6, // смещение при перемещении верх-низ на странице
    string :0, // номер строки с общими списками 
  
    playlist : 0,
    sta : 0, //пауза или играть с начала
  
    janrURL : "http://www.ex.ua/ru/video/foreign_series",
    search : "?", //search : "?", search : "'>",
	POISK : 0,
};

var b = 1; //индекс активной строки
var c = 1; //индекс прошлой активной строки
var url = "";  // адрес стрима файла mp3

Main.onLoad = function () {
 if ( Player.init() && Audio.init() ){
    widgetAPI.sendReadyEvent();//Сообщаемa менеджеру приложений о готовности
    document.getElementById("anchor").focus(); //  Помещение фокуса на элемент "anchor"	
	document.getElementById("playlist").style.display="none";
    document.getElementById("plain").style.display="none";
	document.getElementById("search").style.display="none";
	document.getElementById("black").style.display="none";
	
	//Search.Input();
	
	// адрес жанра запроса
    this.sURL = this.janrURL + '?v=1,0&p='+this.string+'&per=18';
	//this.sURL = "http://www.ex.ua/search?s=darude";
	//this.sURL = "http://www.ex.ua/search?s=depeche+mode+the+best";
	
	URLtoXML.Proceed(this.sURL);
	Display.setTime(0); // выставляем   0:00:00/0:00:00
	window.onShow = Main.onShowEventTVKey; //Стандартный индикатор громкости
	$('#svecKeyHelp_IIZH').sfKeyHelp({'TOOLS':'Поиск','NUMBER':'Категория','INFO':'Видео','UPDOWN':'Позиция','leftright':'Позиция' , 'Enter':'Выбор', 'return':'Вернуться'});
	}
};


//Стандартный индикатор громкости
Main.onShowEventTVKey = function(){
  pluginAPI.SetBannerState(1);  
  pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
  pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
  pluginAPI.unregistKey(tvKey.KEY_MUTE);
}


Main.onUnload = function () {};


Main.keyDown = function(){
	var keyCode = event.keyCode;
//alert(keyCode);
	switch(keyCode)
	{
	   case 75:  // поиск 
	    if(this.POISK == 0){
		 document.getElementById("title").style.display="none";
		 document.getElementById("janr").style.display="none";
		 
		 document.getElementById("search").style.display="block";
		 document.getElementById("plain").style.display="block";
		 document.getElementById("black").style.display="block";
		 
		 Search.Input();
		 }
	   
	   break;
	//--------------------------------------------------------------
	
	            case tvKey.KEY_1:
				   Main.NewJanr( "http://www.ex.ua/ru/video/documentary", "Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Документальное кино");
                   break;
                case tvKey.KEY_2:
				    Main.NewJanr( "http://www.ex.ua/view/3", "Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Mузыка");
                    break;
                case tvKey.KEY_3:
				   Main.NewJanr( "http://www.ex.ua/ru/video/foreign","Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Зарубежные фильмы");
                   break;
                case tvKey.KEY_4:
				   Main.NewJanr( "http://www.ex.ua/ru/video/foreign_series", "Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Зарубежные сериалы"); 
                   break;
                case tvKey.KEY_5:
                   Main.NewJanr( "http://www.ex.ua/ru/video/cartoon", "Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Мультфильмы");
                   break;
                case tvKey.KEY_6:
                   Main.NewJanr( "http://www.ex.ua/ru/video/clip", "Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Клипы");
                   break;
                case tvKey.KEY_7:
                   Main.NewJanr( "http://www.ex.ua/ru/video/concert", "Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Концерты"); 
                   break;
                case tvKey.KEY_8:
                   Main.NewJanr( "http://www.ex.ua/ru/video/our_series", "Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Наши сериалы"); 
                   break;
                case tvKey.KEY_9:
                   Main.NewJanr( "http://www.ex.ua/ru/video/our", "Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Наше");
                   break;
                case tvKey.KEY_0:
                   Main.NewJanr( "http://www.ex.ua/ru/video/show", "Жанр : &nbsp;&nbsp;&nbsp;&nbsp; Шоу и Передачи"); 
                   break;

	
	   case tvKey.KEY_INFO: // устанавливаемa директорию на /dtv/usb/sda1/
		    this.toggleMode(); // выбор полноэкранного режима
	   break;

	   case tvKey.KEY_RED: // переключение типа полноэкранного режима (циклично от 1 до 5, начальное значение 3)
			if (this.mode == this.WINDOW) { //не переключаем в свернутом режиме
				break;
			}
			this.currentFSMode = (this.currentFSMode < 5) ? this.currentFSMode + 1 : 1;
	
			Player.setScreenMode(this.currentFSMode);
	   break;
	
	   case tvKey.KEY_STOP:
            Player.stopVideo();
       break; 
			
			
        case tvKey.KEY_PAUSE:
            this.handlePauseKey();
        break;
		
		
        case tvKey.KEY_PLAY:
		    Main.handlePlayKey(url);
            this.sta=1; //играть c начала
        break;
			
			
		case tvKey.KEY_RETURN:
		case tvKey.KEY_PANEL_RETURN:
			widgetAPI.blockNavigation(event); //  блокируем по умолчанию RETURN
			this.playlist=0;
			document.getElementById("spisok").style.display="block";
			document.getElementById("playlist").style.display="none";
			$('#svecKeyHelp_IIZH').sfKeyHelp({'TOOLS':'Поиск','NUMBER':'Категория','INFO':'Видео','UPDOWN':'Позиция','leftright':'Позиция' , 'Enter':'Выбор', 'return':'Вернуться'});
		break;
			
			
		case tvKey.KEY_LEFT: // лево
		    if(this.playlist==0){
		     if(this.index ==1){this.index =2}
			 Main.ActivString(-1);//активная строка
			 }
			else if(this.playlist==1 && Player.getState() != Player.PAUSED){
			 Player.skipBackwardVideo();
			 }
		break;


		case tvKey.KEY_RIGHT: // право
		    if(this.playlist==0){
             if(this.index ==18){this.index =17}
			 Main.ActivString(1);//активная строка
			 }
			if(this.playlist==1 && Player.getState() != Player.PAUSED)
             Player.skipForwardVideo();
		break;
			
			
		case tvKey.KEY_UP:
		    if(this.playlist==0){
			  this.smeh =-6;
			  if(this.index==1 || this.index==2 || this.index==3 || this.index==4 || this.index==5 || this.index==6)
			  {Main.NewString(12, -1);}//переход поиска вверх
			  Main.ActivString(this.smeh);//активная строка
			  }
			else if(this.playlist==1){
			  this.selectUpVideo();
			}
		break;
			
			
		case tvKey.KEY_DOWN:
		    if(this.playlist==0){
		      this.smeh=6;
			  if(this.index==13 || this.index==14 || this.index==15 || this.index==16 || this.index==17 || this.index==18)
			  {Main.NewString(-12, 1);}//переход поиска вниз
			  Main.ActivString(this.smeh);//активная строка
			  }
			else if(this.playlist==1){
			  this.selectNextVideo();
			  this.sta=1; //играть c начала
			} 
		break;
			
			
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			if(this.playlist==0){
			  this.playlist=1;
			  Main.handleActiv(); 
			   for(var h=1; h <= 100; h++)
				{
				  document.getElementById("str" + h).innerHTML= "";
				}
				
		      URLtoXML.xmlHTTP = null;        
	          this.sURL= URLtoXML.UrlSt[this.index] // адрес страницы альбома
	          URLtoXML.Proceed(this.sURL);
			  document.getElementById("spisok").style.display="none";
			  document.getElementById("playlist").style.display="block";
			  
			  document.getElementById("description").innerHTML = "<img style='border-style: solid; border-width:10px; border-color:#cccccc; margin:10px; width:250px; height: 250px; border-radius:5px; box-shadow:0 0 13px black;' src='" + URLtoXML.ImgDickr[this.index].replace("?100", "200") + "' >" ;
			}
			else if(this.playlist==1){
			  this.sta=1;
			  url = URLtoXML.pUrlSt[b];
			  Main.handlePlayKey(url);
			  document.getElementById("description").innerHTML = "<img style='border-style: solid; border-width:10px; border-color:#cccccc; margin:10px; width:250px; height: 250px; border-radius:5px; box-shadow:0 0 13px black;' src='" + URLtoXML.ImgDickr[this.index].replace("?100", "200") + "' >" + "<img style='margin-bottom:17px; margin-left:-10px; width:67px;' src='images/vinil.png' ><br>" + URLtoXML.pName[b];
			}
			$('#svecKeyHelp_IIZH').sfKeyHelp({'TOOLS':'Поиск','INFO':'Видео','UPDOWN':'Позиция','leftright':'Перемотка' , 'Enter':'Выбор', 'return':'Вернуться'});
		break;	
	
	
	    case tvKey.KEY_VOL_UP:
        case tvKey.KEY_PANEL_VOL_UP:  //  громкость +
             Audio.setRelativeVolume(0);
        break;
			
			
        case tvKey.KEY_VOL_DOWN:
        case tvKey.KEY_PANEL_VOL_DOWN:  //  громкость -
             Audio.setRelativeVolume(1);
        break;
			
			
		default:
			alert("Unhandled key");
		break;

	}
	 if(URLtoXML.sName[this.index].length >80){document.getElementById("title").innerHTML = URLtoXML.sName[this.index].substr(0,80)+"...";}//название в заголовок
	 else{document.getElementById("title").innerHTML= URLtoXML.sName[this.index]};
	 Main.ListTop();
};


//  перемещение поиска по страницам
Main.NewString = function(per, a ){
    this.search ="?";
	this.smeh =per; // соответствие столбца
	this.string=this.string+a; // смещаем адресс поиска страницы
	if(this.string<0){//  верхний предел
	  this.string=0; this.smeh=0}
	else{
	  URLtoXML.xmlHTTP = null;
	  this.sURL = this.janrURL + '?v=1,0&p='+this.string+'&per=18'; // жанр + страница
	  URLtoXML.Proceed(this.sURL);
	}
};
// активная строка
Main.ActivString = function(smeh){ 
	this.smeh=smeh;
	document.getElementById("imgst" + this.index).style.borderColor="#e9e9e9";
	this.index= this.index + this.smeh;
	document.getElementById("imgst" + this.index).style.borderColor="#fe761c"; 
};

Main.ListTop = function(){ // смещение списка по достижению пределов
   if(b == 16){document.getElementById("list2").style.top= "-421px";} //  переключение списка вверх 1
   if(b == 15){document.getElementById("list2").style.top= "0px";}    //  переключение списка вниз 1
   
   if(b == 31){document.getElementById("list2").style.top= "-842px";} //  переключение списка вверх 2
   if(b == 30){document.getElementById("list2").style.top= "-421px";} //  переключение списка вниз 2
   
   if(b == 46){document.getElementById("list2").style.top= "-1263px";} //  переключение списка вверх 3
   if(b == 45){document.getElementById("list2").style.top= "-842px";} //  переключение списка вниз 3
   
   if(b == 61){document.getElementById("list2").style.top= "-1684px";} //  переключение списка вверх 4
   if(b == 60){document.getElementById("list2").style.top= "-1263px";} //  переключение списка вниз 4
   
   if(b == 76){document.getElementById("list2").style.top= "-2105px";} //  переключение списка вверх 5
   if(b == 75){document.getElementById("list2").style.top= "-1684px";} //  переключение списка вниз 5
   
   if(b == 91){document.getElementById("list2").style.top= "-2526px";} //  переключение списка вверх 6
   if(b == 90){document.getElementById("list2").style.top= "-2105px";} //  переключение списка вниз 6
};

Main.handlePauseKey = function(){
    switch ( Player.getState() ){
        case Player.PLAYING:
            Player.pauseVideo();
			this.sta = 0; //пауза
            break;
        default:
            break;
    }
};

Main.handleActiv = function(){
	document.getElementById("list2").style.top= "0px";  //  переключение списка на 0
	document.getElementById("str" + b).style.color="#c0c0c0";  //возвращение цвета с активного на пасивный
    b=1;
    c=1;
	document.getElementById("str" + b).style.color="#fe761c";  //активная строка
};

Main.selectNextVideo = function(){
	if(b == 100){b=99;} //предел max
	b=b+1;
	document.getElementById("str" + b).style.color="#fe761c";  //активная строка 
	c=b-1;
	document.getElementById("str" + c).style.color="#c0c0c0";  //возвращение цвета с активного на пасивный
	this.sta=1;//играть c начала
}; 

Main.selectUpVideo = function(){
    if(b == 1){b=2;} //предел min
	b=b-1;
	document.getElementById("str" + b).style.color="#fe761c";  //активная строка 
	c=b+1;
	document.getElementById("str" + c).style.color="#c0c0c0";  //возвращение цвета с активного на пасивный
	this.sta=1;//играть c начала
};

Main.handlePlayKey = function(url){
 if(this.sta==1 ) {
   Player.stopVideo();
   url = URLtoXML.pUrlSt[b];
   Player.playVideo(url);
  }	   
    switch ( Player.getState() )
    {
        case Player.STOPPED:
            Player.playVideo(url);
            break;     
        case Player.PAUSED:
            Player.resumeVideo();
            break;
        default:
            break;
    }
	//document.getElementById("description").innerHTML = "<img style='border-style: solid; border-width:10px; border-color:#cccccc; margin:10px; width:250px; border-radius:5px;' src='" + URLtoXML.ImgDickr[this.index].replace("?100", "") + "' ><br>" +URLtoXML.pName[b];
	document.getElementById("description").innerHTML = "<img style='border-style: solid; border-width:10px; border-color:#cccccc; margin:10px; width:250px; height: 250px; border-radius:5px; box-shadow:0 0 13px black;' src='" + URLtoXML.ImgDickr[this.index].replace("?100", "200") + "' >" + "<img style='margin-bottom:17px; margin-left:-10px; width:67px;' src='images/vinil.png' ><br>" + URLtoXML.pName[b];
	Main.ListTop();// смещение списка по достижению пределов
};

//  перемещение поиска по страницам
Main.NewJanr = function(janr, text ){ 
     this.search ="?";
     URLtoXML.xmlHTTP = null;
	 this.janrURL= janr;
	 this.sURL = janr + '?v=1,0&p='+this.string+'&per=18'; // жанр + страница
	 URLtoXML.Proceed(this.sURL);
	 document.getElementById("janr").innerHTML = text;
};




Main.setFullScreenMode = function(){
    if (this.mode != this.FULLSCREEN)
    {
	    document.getElementById("main").style.display="none";
        Player.setScreenMode(this.currentFSMode);
        this.mode = this.FULLSCREEN;
    }
};

Main.setWindowMode = function(){
    if (this.mode != this.WINDOW)
    {
	    document.getElementById("main").style.display="block";
        Player.setWindow();
        this.mode = this.WINDOW;
    }
};

Main.toggleMode = function() {
    switch (this.mode)
    {
        case this.WINDOW:
            this.setFullScreenMode();
            break;
            
        case this.FULLSCREEN:
            this.setWindowMode();
            break;
            
       default:
            break;
    }
};