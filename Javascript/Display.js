var Display = {

};

Display.setTotalTime = function(total) {
	this.totalTime = total;
};

Display.setTime = function(time) {
	// var timeInfoFullScreen = document.getElementById("timeInfoFS");
	// var timePercent = (100 * time) / this.totalTime;
	var timeElement = document.getElementById("timeInfo");
	var timeHTML = "";
	var timeHour = 0;
	var timeMinute = 0;
	var timeSecond = 0;
	var totalTimeHour = 0;
	var totalTimeMinute = 0;
	var totalTimeSecond = 0;

	if (Player.state == Player.PLAYING) {
		totalTimeHour = Math.floor(this.totalTime / 3600000);
		timeHour = Math.floor(time / 3600000);

		totalTimeMinute = Math.floor((this.totalTime % 3600000) / 60000);
		timeMinute = Math.floor((time % 3600000) / 60000);

		totalTimeSecond = Math.floor((this.totalTime % 60000) / 1000);
		timeSecond = Math.floor((time % 60000) / 1000);

		timeHTML = timeHour + ":";

		if (timeMinute == 0)
			timeHTML += "00:";
		else if (timeMinute < 10)
			timeHTML += "0" + timeMinute + ":";
		else
			timeHTML += timeMinute + ":";

		if (timeSecond == 0)
			timeHTML += "00 / ";
		else if (timeSecond < 10)
			timeHTML += "0" + timeSecond + " / ";
		else
			timeHTML += timeSecond + " / ";

		timeHTML += totalTimeHour + ":";

		if (totalTimeMinute == 0)
			timeHTML += "00:";
		else if (totalTimeMinute < 10)
			timeHTML += "0" + totalTimeMinute + ":";
		else
			timeHTML += totalTimeMinute + ":";

		if (totalTimeSecond == 0)
			timeHTML += "00";
		else if (totalTimeSecond < 10)
			timeHTML += "0" + totalTimeSecond;
		else
			timeHTML += totalTimeSecond;

		if (totalTimeMinute != 0) {
			if (timeSecond == totalTimeSecond && timeMinute == totalTimeMinute
					&& timeHour == totalTimeHour) {
				Player.stopVideo();
				timeHTML = "0:00:00 / 0:00:00";
				setTimeout("Display.Timeout()", 3000);

			}
		}

	} else
		timeHTML = "0:00:00 / 0:00:00";

	widgetAPI.putInnerHTML(timeElement, timeHTML);

};

Display.Timeout = function() {
	Main.selectNextVideo(); // переключение на след. трек
	Main.handlePlayKey(); // играть

};
