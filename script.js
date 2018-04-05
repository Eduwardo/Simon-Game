let power = false,
	canStart = false,
	strict = false,
	turn = 0,
	series = [],
	userSeries = [],
	isStart = false,
	message = '',
	userTurn = false;
const buttons = ['red', 'blue', 'green', 'yellow'],
	generateNum = () => Math.floor(Math.random() * buttons.length);

$('.simon-toggle.power').click(() => powerSwitch());
$('.simon-toggle.strict').click(() => strictSwitch());
$('.simon-start').click(() => power && canStart ? start() : false);
$('#t-red').click(() => power ? checkClick('red') : false);
$('#t-blue').click(() => power ? checkClick('blue') : false);
$('#t-green').click(() => power ? checkClick('green') : false);
$('#t-yellow').click(() => power ? checkClick('yellow') : false);

let audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
	colorTone = {
	red: '220',
	blue: '165',
	green: '333',
	yellow: '280',
	error: '100'
};

function loadTone(color) {
	let oscillator = audioCtx.createOscillator();
	oscillator.type = color === 'error' ? 'triangle' : 'sine';
	oscillator.frequency.setValueAtTime(colorTone[color], audioCtx.currentTime);
	oscillator.connect(audioCtx.destination);
	oscillator.start();
	setTimeout(() => {
		oscillator.stop();
		oscillator.disconnect(audioCtx.destination);
		oscillator = null;
		}, 500);
}

function powerSwitch() {
	power = !power;
	if (power === true) {
		$('polygon').css('cursor', 'pointer');
		$('svg').addClass('svg-spin');
		setTimeout(() => {
			canStart = true;
			$('.t-red').removeClass('tg-red');
			$('.t-green').removeClass('tg-green');
		}, 1400);
	} else {
		power = false;
		canStart = false;
		turn = 0;
		series = [];
		userSeries = [];
		userTurn = false;
		isStart = false;
		message = '00';
		$('.simon-display').html(message);
		$('.simon-start').html('Start');
		$('polygon').css('cursor', 'default');
		$('svg').removeClass('svg-spin');
		$('.t-red').addClass('tg-red');
		$('.t-green').addClass('tg-green');
	}
	displaySeries();
}

function strictSwitch() {
	strict = !strict;
}

function start() {
	if (turn === 0) {
		isStart = true;
	}
	turnCount();
	generateSeries();
	runSeries();
	canStart = false;
}

function turnCount() {
	turn += 1;
	message = turn < 10 ? '0' + turn : turn;
	$('.simon-display').html(message);
}

function displaySeries() {
	if (power === true) {
		$('.simon-display').addClass('power-on');
	} else {
		$('.simon-display').removeClass('power-on');
	}
}

function checkClick(color) {
	if (userTurn === true && isStart === true) {
		switch (color) {
			case 'red':
				updateUserSeries(color);
				checkSeries(color);
				break;
			case 'blue':
				updateUserSeries(color);
				checkSeries(color);
				break;
			case 'green':
				updateUserSeries(color);
				checkSeries(color);
				break;
			case 'yellow':
				updateUserSeries(color);
				checkSeries(color);
				break;
		}
	}
}

function generateSeries () {
	series.push(buttons[generateNum()]);
}

function resetUserSeries() {
	userSeries = [];
}

function light(turn) {
	$(`.t-${turn}`).addClass(`tg-${turn}`);
	setTimeout(() => {
		$(`.t-${turn}`).removeClass(`tg-${turn}`);
		}, 500);
}

function checkSeries(color) {
	let userCheck = [...series.slice(0, userSeries.length)];
	if (JSON.stringify(userSeries) !== JSON.stringify(userCheck)) {
		light(color);
		loadTone('error');
		wrongSeries();
	} else {
		if (userSeries.length === series.length) {
			successSeries();
		}
		light(color);
		loadTone(color);
	}
}

function wrongSeries() {
	if (strict === true) {;
		$('.simon-display').html('!!');
		setTimeout(() => {
			$('.simon-display').html(message);
			resetUserSeries();
			turn = 0;
			series = [];
			canStart = false;
			start();
		}, 250);

	} else {
		$('.simon-display').html('!!');
		setTimeout(() => {
			$('.simon-display').html(message);
			resetUserSeries();
			runSeries();
			}, 250);
	}
}

function successSeries() {
	if (turn === 20) {
		setTimeout(() => {
			resetUserSeries();
			isStart = false;
			turn = 0;
			series = [];
			userSeries = [];
			userTurn = false;
			canStart = true;
			$('.simon-display').html('You Won!');
			$('.simon-start').html('Restart');
		}, 1000);
	}
	else if (turn < 20) {
		userTurn = false;
		setTimeout(() => {
			resetUserSeries();
			canStart = true;
			start();
		}, 1000);
	}
}

function updateUserSeries(color) {
	if (userSeries.length < series.length) {
		userSeries.push(color);
	}
}

function runSeries() {
	userTurn = false;
	let time = 0;
	for (let turn of series) {
		setTimeout(() => {
			switch (turn) {
				case 'red':
					light(turn);
					loadTone(turn);
					break;
				case 'blue':
					light(turn);
					loadTone(turn);
					break;
				case 'green':
					light(turn);
					loadTone(turn);
					break;
				case 'yellow':
					light(turn);
					loadTone(turn);
					break;
			}
		}, time += 1000);
	}
	setTimeout(() => {
		userTurn = true;
		}, time + 1000);
}
