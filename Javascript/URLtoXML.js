var URLtoXML = {
	outTXT : "",// строка, куда соберем список
	fMode : true, // режим обмена данными (асинхронный=true синхронный=false)

	// По умолчанию основные параметры определяем для EX.UA
	prefixURL : "http://ex.ua/view/",

	nStart : 0, // начальный символ поиска в ответе нужных данных

	xmlHTTP : null,

	sName : new Array(), // имя файла
	UrlSt : new Array(), // адрес
	ImgDickr : new Array(), // картинка
	pName : new Array(),
	pDes : new Array(),
	qDes : new Array(),
	

	pUrlSt : new Array(),

	arrVideoExt : [".avi", ".asf", ".asx", ".3gp",".3g2", ".3gp2", ".3gpp", ".flv", ".mp4", ".mp4v", ".m4v", ".m2v",".m2ts", ".m2t", ".mp2v", ".mov", ".mpg", ".mpe", ".mpeg", ".mkv",".swf", ".mts", ".wm", ".wmx", ".wmv", ".vob", ".iso", ".f4v", ".ts", ".flac", ".mp3", ".dts", ".ac3"],
   
   //двумерный массив строк, которые нужно заменить в тексте - первый вариант на второй
   arrReplWordsDesc : [["h1>", "b>"], ["</*p>","<br>"], ["\\s*<br>\\s*<br>", "<br>"], ["</*p>","</*p>"]],
   arrReplWordsFrwd : [["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"], ["'", "&apos;"], ["\"", "&quot;"]],
   //массив строк-масок регулярных выражений, подлежащих удалению из текста
   arrDelWords : ["<\\s*a[^<^>]*>", "<\\s*/\\s*a\\s*>", "<\\s*/*\\s*span[^>]*>", "<\\s*/*\\s*div[^>]*>", "<\\s*/*\\s*img[^>]*>", "<\\s*/*\\s*strong[^>]*>"],
   prefixTAG : "<a href='",
   endedTAG : "'>",

};




URLtoXML.deinit = function () {
	if (this.xmlHTTP ) {
		this.xmlHTTP.abort();
	}
};

// обработка ссылки
URLtoXML.Proceed = function(sURL) {

	this.outTXT = "";// очищаем строку-приемник конечного плейлиста

	if (this.xmlHTTP == null) {// инициализируем связь с интернетом
		this.xmlHTTP = new XMLHttpRequest();

		// отсылаем пустой запрос и ловим страницу в строку
		this.xmlHTTP.open("GET", sURL, this.fMode); // ?асинхронно

		this.xmlHTTP.onreadystatechange = function() {
			if (URLtoXML.xmlHTTP.readyState == 4) {
				URLtoXML.outTXT = URLtoXML.ParseXMLData(); // генерим конечный плейлист на основании полученных данных
			}
		};

		this.xmlHTTP
				.setRequestHeader("User-Agent","Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.9.168 Version/11.51");
		this.xmlHTTP.send();
	}
};

// из полученного ответа вытаскиваем нужные данные
URLtoXML.ParseXMLData = function() {
	var TMPnStart, sOut;
	var index = 0; // индекс масcива
	var index2 = 0; // индекс масcива
	var index3 = 0; // индекс масcива
	var index4 = 0; // индекс масcива

	if (this.xmlHTTP.status == 200)// если ответ от сервера корректный
	{
		// сразу удаляем переводы строк для удобного поиска
		sOut = URLtoXML.DelTrash(this.xmlHTTP.responseText);

		if (Main.playlist == 0) {
			// определяем символ начала поиска объявлений на странице
			this.nStart = 0;

			while (this.nStart >= 0) {
				// alert(Main.search);
				// ищем ссылки страниц
				sUrl = URLtoXML.FindVal(sOut, this.nStart,
						"<td><a href='/view/", Main.search); // для поиска
				// "'>" иначе
				// "?"
				// alert(sUrl);
				if (sUrl != "" && sUrl.length >= 5) {//
					// приводим ссылку к нормальному виду
					sUrl = this.prefixURL + sUrl;
					index3 = index3 + 1;
					this.UrlSt[index3] = sUrl;

				}
				// ищем картинку без сдвига счетчика
				TMPnStart = this.nStart;
				sImg = URLtoXML.FindVal(sOut, this.nStart, "<img src='", "'");
				this.nStart = TMPnStart;// возвращаем значение глобального поиска

				if (sImg != "" && sImg.length >= 25) {
					index = index + 1;
					sImg = sImg.replace("?100", "?100");
					this.ImgDickr[index] = sImg;
					widgetAPI.putInnerHTML(document.getElementById("bloc" + index), "<img class='blockImage' id='imgst" + index +  "';  src='" + sImg + "' />");
				}
				// ищем описание
				TMPnStart = this.nStart;
				sDes = URLtoXML.FindVal(sOut, this.nStart, "", "</td>");
				this.nStart = TMPnStart;// возвращаем значение глобального поиска

				// Если нашли описание
				if (sDes != "")
				
				// ищем описание
				TMPnStart = this.nStart;
				nDes = URLtoXML.FindVal(sOut, this.nStart, "", "</td>");
				this.nStart = TMPnStart;// возвращаем значение глобального поиска

				// Если нашли описание
				if (nDes != "")
				{
					nDes = this.prefixTAG + sUrl + this.endedTAG + nDes;
					nDes =  URLtoXML.ReplWords(nDes, this.arrReplWordsDesc);
					nDes = URLtoXML.DelWords(nDes);
					nDes = URLtoXML.DelTrash(nDes);
					{
						index4 = index4 + 1; // индекс масива
						this.pDes[index4] = nDes; // заносим заголовок в масив

					}
				}
					{
					// возвращаемa положение поиска
					// Ищем заголовок в описании
					TMPnStart = this.nStart;
					sTit = URLtoXML.FindVal(sDes, 0, "alt='", "'></a>");

					this.nStart = TMPnStart; // возвращаем значение глобального поиска
					// Если нашли заголовок иссключаемa лишнее
					if (sTit != ""
							&& sTit.indexOf('EX') == -1
							&& sTit.indexOf('перейти на первую страницу') == -1
							&& sTit.indexOf('перейти на предыдущую страницу') == -1
							&& sTit.indexOf('перейти на следующую страницу') == -1
							&& sTit.indexOf('перейти на последнюю страницу') == -1) {

						index2 = index2 + 1; // индекс масива
						this.sName[index2] = sTit; // заносим заголовок в масив
							
					}
				}
			}

			if (this.sName[Main.index].length > 180) {
				widgetAPI.putInnerHTML(document.getElementById("title"), this.sName[Main.index].substr(0, 180) + "...");
			}// название в заголовок
			else {
				widgetAPI.putInnerHTML(document.getElementById("title"), this.sName[Main.index]);
			}
			document.getElementById("imgst" + Main.index).style.borderColor = "#3399FF"; // активная строка
			

		} else if (Main.playlist == 1) {

			this.nStart = 0;
			while (this.nStart >= 0) {
				// находимa часть строки с адресам и названием
				sUrl = URLtoXML.FindVal(sOut, this.nStart, "href='/get/", ">");

				// проверяем вхождения встречающихся в массиве расширений слова
				for ( var i in this.arrVideoExt) {
					var wrd = this.arrVideoExt[i];// слово из массива

					if (sUrl.length != 0 && sUrl.indexOf(wrd) >= 0) {

						TMPnStart = this.nStart; // возвращаемa положение поиска
						// находим идентификатор адреса стрима
						pUrl = URLtoXML.FindVal(sUrl, 0, "", "'");
						index = index + 1;
						// приводим адрес в нормальный вид
						this.pUrlSt[index] = "http://www.ex.ua/get/" + pUrl;

						// ищем имени файлов
						pTit = URLtoXML.FindVal(sUrl, 0, "title='", "'");
						this.pName[index] = pTit;

						// выводи имена в список плейлисста (обрезаем имя после 40 символа и добавляемa многоточье )
						if (pTit.length >= 40 && index < 200) {
							widgetAPI.putInnerHTML(document.getElementById("str" + index), pTit.substr(0, 40) + "...");
						} else if (index < 200) {
							widgetAPI.putInnerHTML(document.getElementById("str" + index), pTit);
						}
						this.nStart = TMPnStart;
					}

				}

			}
		}
	}

};


// поиск значения на странице и вычленение его
URLtoXML.FindVal = function(sOut, nBeg, keyBVal, keyEVal) {
	var nEnd, sRes;

	sRes = sOut.toLowerCase();// приводим к нижнему регистру
	nBeg = sRes.indexOf(keyBVal.toLowerCase(), nBeg);// ищем первый ключ

	if (nBeg >= 0) {// если значение найдено

		nBeg = nBeg + keyBVal.length;// передвигаем начало поиска на след.
		// символ за первичным ключом
		// ищем вторичный ключ
		nEnd = sRes.indexOf(keyEVal.toLowerCase(), nBeg);
		this.nStart = nEnd + keyEVal.length;// если не нашли окончание значения
		// - становимся в конец строки +1
		// символ

		sRes = sOut.substring(nBeg, nEnd); // вычленяем значение
	} else {
		sRes = "";// не найден первичный ключ
		this.nStart = nBeg;// конец поиска - маска не найдена
	}
	return sRes;
};

// удаление "мусора" из строки
URLtoXML.DelTrash = function(str) {
	// заменяем мусор на пробелы
	str = str.replace(new RegExp("&nbsp;", 'gim'), " ");
	str = str.replace(new RegExp("&mdash;", 'gim'), " ");
	str = str.replace(new RegExp("\t", 'gim'), " "); // табуляция
	str = str.replace(new RegExp("\n", 'gim'), " "); // конец строки
	str = str.replace(new RegExp("\r", 'gim'), " "); // перевод каретки

	// заменяем все "длинные" пробелы на один
	while (str.indexOf("  ") >= 0) {
		str = str.replace(new RegExp("  ", 'gim'), " ");
	}
	return URLtoXML.trim(str);
};

//удаление исключенных слов из результата
URLtoXML.DelWords = function(sVal){
var wrd, sRes;

    sRes = sVal;
    //удаляем из входной строки все встречающиеся в массиве исключений слова
    for (var i in this.arrDelWords){
       //слово из массива
       wrd = this.arrDelWords[i];
       sRes = sRes.replace(new RegExp(wrd, 'gim'), "");
    }
    
    //возвращаем результат
    return sRes;
};

//замена слов в результате по массиву замен
URLtoXML.ReplWords = function(sVal, arrRepl){
var wrd, sRes;

    sRes = sVal;
    //идем по внешнему массиву и выдергиваем слова поиска
    for (var i in arrRepl){
       //искомое слово из массива - первый элемент массива
       wrd = arrRepl[i][0];
       //заменяем в выходной строке искомое слово на нужный вариант из справочника - второй элемент массива
       sRes = sRes.replace(new RegExp(wrd, 'gim'), arrRepl[i][1]);
    }
    
    //возвращаем результат
    return sRes;
};

// удаляемa пробелы в конце и в начале
URLtoXML.trim = function(str) {
	while (str.charAt(str.length - 1) == " ") {
		str = str.substring(0, str.length - 1);
	}
	while (str.charAt(0) == " ") {
		str = str.substring(1);
	}
	return str;
};
