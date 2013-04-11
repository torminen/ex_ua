var Favorites = {

};

Favorites.open = function {
	document.getElementById("anchor").focus(); // перемещаем фокус на элемент
												// "anchor"
	URLtoXML.xmlHTTP = null;
	Main.sURL = "/mtd_rwcommon/common/ex_fav.data" ";
	URLtoXML.Proceed(Main.sURL);
	
	document.getElementById("title").style.display = "block";
	document.getElementById("janr").style.display = "none";
	document.getElementById("plain").style.display = "none";
	document.getElementById("search").style.display = "none";
	document.getElementById("black").style.display = "none";
	$('#svecKeyHelp_IIZH').sfKeyHelp({
		'TOOLS' : 'Поиск',
		'NUMBER' : 'Категория',
		'UPDOWN' : 'Позиция',
		'leftright' : 'Позиция',
		'Enter' : 'Выбор',
		'return' : 'Назад'
	});
};

Favorites.write = function {
	var fileSystemObj = new FileSystem();
    var oFile=fileSystemObj.openCommonFile("ex_fav.data", "w");
    if (oFile)
    {
        for(var i=0; i < array.length; i++)
        oFile. writeLine(array[i]);
        fileSystemObj.closeCommonFile(oFile);
    }
};

Favorites.read = function(array) {
	var l;
    var fileSystemObj = new FileSystem();
    var oFile=fileSystemObj.openCommonFile("ex_fav.data", "r");
    if (oFile)
    {
    while(1)
            {
                 = oFile. readLine();
                if (l==null) 
                break;
                array.push(l);
            }
            fileSystemObj.closeCommonFile(oFile);
    }
};

Favorites.save  = function()
{
                var url1 ="<td><a href='/view/"+this.makeTags(URLtoXML.UrlSt[this.index][1],"'>"")
                + this.makeTags(URLtoXML.UrlSt[this.index][2],"stream_url")
                + this.makeTags(URLtoXML.UrlSt[this.index][3],"logo_30x30")
                + this.makeTags(URLtoXML.UrlSt[this.index][4],"description")
                + this.makeTags(URLtoXML.UrlSt[this.index][6],"playlist_url")+"</channel>";

                var tempArray=new Array();
                Favorites.read(tempArray); 

                if(tempArray.length<3)
                    {
                        tempArray.splice(0,0,"<items>");
                        tempArray.splice(1,0,url1);
                        tempArray.splice(2,0,"</items>");
                    }
                else 
                    {
                        tempArray.splice(0,1,"<items>");
                        tempArray.splice(1,0,url1);
                    }
                Favorites.write(tempArray);
                Display.status("Добавленно в избранное");
                setTimeout("Display.hidestatus();", 1000);
}

