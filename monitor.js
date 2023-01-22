/** @param {NS} ns */
export async function main(ns) {
	const MAXLINELENGTH = 50;
	const MAXLINES = 28;
	var SERVERS = [];
	var GANG = [];
	var HACKING = [];
	var STOCKS = [];
	var SLEEVES = [];
	var MISC = [];
	var HACKNET = [];
	ns.tail();
	ns.resizeTail(1500, 700);
	ns.disableLog('ALL');
	ns.clearLog();
	var grid = [3, 2];


	const header = '-'.repeat((MAXLINELENGTH + 1) * grid[0]);

	async function lineWrap(content) {
		var spacer = '-';
		var contentLength = content.length;
		var dashes = MAXLINELENGTH - contentLength;
		var left = spacer; var right = ' '; var output = '';
		if (content == 'gap') {
			output = `${' '.repeat(MAXLINELENGTH - 2)}`;
		}
		else if (contentLength < MAXLINELENGTH) {
			if (dashes % 2 != 0) {
				left = ((dashes + 1) / 2) - 1; right = ((dashes - 1) / 2) - 1;
			}
			else {
				left = (dashes / 2) - 1; right = (dashes / 2) - 1;
			}			
			if (left < 1) {
				left = `${spacer.repeat(1)}`;
			}
			else {
				left = `${spacer.repeat(left)}`; 
			}
			if (right < 1) {
				right = ` `; 
			}
			else {
				right = `${spacer.repeat(right)}`;
			}
			if (contentLength == 0) {
				output = `${spacer.repeat(MAXLINELENGTH)}`;
			}

			else {
				output = `${left} ${content} ${right}`;
			}
		}
		else {
			output = `${left} ${content} ${right}`;
		}
		return (output);
	}

	async function hackMonitor() {
		var output = [];
		output.push(await lineWrap("HACKING MONITOR"));

		//Code here

		return (output);
	}

	async function serverMonitor() {
		//Initialise variables
		var costs = {};
		var servers = await ns.getPurchasedServers();
		var tiers = [];
		var output = [];

		//Generate a reference list of server ram and their tier in order to get the upgrade cost
		for (var i = 1; i <= 30; i++) {
			var ram = Math.pow(2, i);
			tiers.push(await ns.nFormat(ram * 1000000000, '0.0b'));
			var cost = await ns.nFormat(await ns.getPurchasedServerCost(ram), '\$0.00a');
			costs[await ns.nFormat(ram * 1000000000, '0.0b')] = `${cost}, ${i}`;
		}

		//Push UI header
		output.push(await lineWrap("SERVER MONITOR"));
		output.push(await lineWrap(""));
		output.push(await lineWrap("Name ----- RAM ------- Util ------ $Upg"));

		//Calculate each respective field and push to output array
		//TODO: Line length normalisation
		for (var i = 0; i < servers.length; i++) {
			var name; var ram; var util; var upg; var rRam; var rUtil; var percUtil; var ramCap; var ramUtil;
			if (i == 0) { name = `  ${i}  ` } else if (i < 10) { name = `  ${i}  ` } else { name = `  ${i} ` }
			ramCap = await ns.getServerMaxRam(servers[i]);
			ramUtil = await ns.getServerUsedRam(servers[i]);
			rRam = await ns.nFormat(ramCap * 1000000000, '0.0b');
			ram = rRam.concat(' '.repeat(7 - rRam.length));
			rUtil = await ns.nFormat(ramUtil * 1000000000, '0.0b');
			percUtil = await ns.nFormat(ramUtil / ramCap, '0.00%');
			util = percUtil.concat(' '.repeat(7 - percUtil.length));
			if (ram == "1.0PB") {
				upg = 'MAX';
			}
			else {
				upg = costs[tiers[tiers.indexOf(rRam) + 1]].split(',')[0];
			}
			output.push(await lineWrap(`${name} ---- ${ram} ----- ${util} --- ${upg}`));
		}
		return (output);
	}

	async function stocksMonitor() {
		var output = [];
		output.push(await lineWrap("STOCKS MONITOR"));

		//Code here

		return (output);
	}

	async function statsMonitor() {
		var output = [];
		var player = await ns.getPlayer();
		var factions = player["factions"];
		var maxFactionLen = 16;
		output.push(await lineWrap("STATS AND AUGMENTATIONS MONITOR"));
		output.push(await lineWrap(""));
		output.push(await lineWrap(`Karma: ${await ns.nFormat(ns.heart.break(), '0.000a')} -- Tor Browser: ${await ns.hasTorRouter()}`));
		output.push(await lineWrap(`Faction ------ Rep --- Fav --- Augs`));
		for (var i = 0; i < factions.length; i++) {
			var rep; var favor; var augAvail; 
			var faction = factions[i];
			rep = await ns.nFormat(await ns.singularity.getFactionRep(faction), '0.0a');
			favor = await ns.nFormat(await ns.singularity.getFactionFavor(faction), '0a');
			augAvail = (await ns.singularity.getAugmentationsFromFaction(faction)).length;
			if (faction.length < maxFactionLen) {
				faction = `${faction}${' '.repeat(maxFactionLen - faction.length)}`;
			}
			

			output.push(await lineWrap(`${faction} -- ${rep} -- ${favor} -- ${augAvail}`));
		}

		return (output);
	}

	async function gangMonitor() {
		try {
		var output = [];
		var gInfo = await ns.gang.getGangInformation();
		//await ns.print(typeof gInfo);
		// if (typeof gInfo != array) {
		// 	throw "GANG NOT JOINED";
		// }
		// else {
		var faction = gInfo["faction"];
		var moneySec = await ns.nFormat((gInfo["moneyGainRate"] * 5), '\$0.0000a');
		var rep = await ns.nFormat(gInfo["respect"], '0.0000a');
		var repSec = await ns.nFormat(gInfo["respectGainRate"], '0.0000a');
		var want = await ns.nFormat(gInfo["wantedLevel"], '0.0000a');
		var wantSec = await ns.nFormat(gInfo["wantedLevelGainRate"], '0.0000a');
		var wantPen = await ns.nFormat((gInfo["wantedPenalty"] - 1) * 100, '0.0000a');
		var gMembers = await ns.gang.getMemberNames();
		const maxTaskLength = 15;
		output.push(await lineWrap("GANG MONITOR"));
		output.push(await lineWrap(`Faction: ${faction}`));
		output.push(await lineWrap(`\$/Sec: ${(moneySec)} -- Penalty: ${wantPen}%`));
		output.push(await lineWrap(`Respect Level: ${rep} -- Rep/Sec: ${repSec}`));
		output.push(await lineWrap(`Wanted Level: ${want} -- Wanted/Sec: ${wantSec}`));
		output.push(await lineWrap(""));
		output.push(await lineWrap("Name - Hack - Asc Mult - Upg ----------- Task"));
		for (var i = 0; i < gMembers.length; i++) {
			var hackMult; var ascMult; var upgNum; var task; var info; var line;
			info = await ns.gang.getMemberInformation(gMembers[i]);
			hackMult = await ns.nFormat(info['hack'], '0.0a'); info['hack'];
			ascMult = await ns.gang.getAscensionResult(gMembers[i])
			if (ascMult != undefined) { ascMult = ascMult['hack'] } else { ascMult = 0.0000 };
			upgNum = info['upgrades'].length + info['augmentations'].length;
			task = info['task'];
			if (task.length < maxTaskLength && maxTaskLength - task.length > 1) {
				task = `${' '.repeat((maxTaskLength - task.length))}${task}`
			}
			else {
				task = task.substring(0, maxTaskLength);
			}

			output.push(await lineWrap(`${gMembers[i]} - ${hackMult} -- ${ascMult.toFixed(4)} --- ${upgNum} - ${task}`))
		}

		return (output);
		}//}
		catch (err) {
			output = [await lineWrap("GANG MONITOR"), await lineWrap(err.split('\n')[0]), await lineWrap("GANG NOT JOINED")];
			return (output);
		}
	}

	async function sleevesMonitor() {
		var output = [];
		var numSleeves = ns.sleeve.getNumSleeves();
		output.push(await lineWrap(``));
		output.push(await lineWrap("SLEEVES MONITOR"));
		output.push(await lineWrap(``));
		output.push(await lineWrap(`Num Sleeves: ${numSleeves}`));
		output.push(await lineWrap(`Sleeve -- Shock -- Augs -- Purch --------- Task`));
		for (var i = 0; i < numSleeves; i++) {
			var sle = await ns.sleeve.getSleeve(i);
			var augAcq = await ns.sleeve.getSleeveAugmentations(i).length;
			var augAva = await ns.sleeve.getSleevePurchasableAugs(i).length;
			var task = await ns.sleeve.getTask(i);
			var location = 'home';
			if (task == null) { task = 'idle' }
			else if (task['type'] == 'FACTION') {
				task = `${task['factionWorkType']} -- ${task['factionName']}`;
			}
			else if (task['type'] == 'CRIME'){
				task = `${task['crimeType']} -- ${location}`;
			}
			else {task = task['type']};
			output.push(await lineWrap(`${i} ---- ${sle["shock"].toFixed(3)} ---- ${augAcq} ---- ${augAva} -- ${task}`));
		}
		return (output);
	}

	async function hackNetMonitor() {
		var output = [];
		var numHNNodes = ns.hacknet.numNodes();
		var prodSec = 0;
		//output.push(await lineWrap(``));
		output.push(await lineWrap("HACKNET MONITOR"));
		output.push(await lineWrap(``));
		output.push(await lineWrap(`Num Servers: ${numHNNodes}`));
		output.push(await lineWrap(`Server -- Level -- RAM -- Cores -- \$Upg`));
		for (var i = 0; i < numHNNodes; i++) {
			var level; var ram; var cores; var cache; var upg = 0;
			var info = ns.hacknet.getNodeStats(i);
			level = info['level'];
			ram = info['ram'];
			cores = info['cores'];
			cache = info['cache'];
			prodSec += info['production'];
			upg = await ns.nFormat(Math.min(ns.hacknet.getLevelUpgradeCost(i, 1), ns.hacknet.getRamUpgradeCost(i, 1), ns.hacknet.getCoreUpgradeCost(i, 1)), '$0.00a');
			output.push(await(lineWrap(`${i} -- ${level} -- ${ram} -- ${cores} -- ${upg}`)))
		}
		output.push(await lineWrap(`Total Prod/Sec: ${await ns.nFormat(prodSec, '0.000a')}`));
		return (output);
		//await ns.print(output)
	}

	async function printer(arrs) {
		const spacer = `${' '.repeat(MAXLINELENGTH)}`
		var numArr = arrs.length;
		for (var lineNum = 0; lineNum < MAXLINES; lineNum++) {
			var lineContent = '';
			for (var arrNum = 0; arrNum < arrs.length; arrNum++) {
				var arr = arrs[arrNum];
				var lineData = arr[lineNum];
				//await ns.print(lineData);
				if (lineNum > arr.length - 1) {
					lineContent += spacer;
				}
				else if (lineData.length < MAXLINELENGTH) {
					lineContent += `${lineData}${' '.repeat(MAXLINELENGTH - lineData.length)}`
				}
				else if (lineData.length > MAXLINELENGTH) {
					lineContent += lineData.substring(0, MAXLINELENGTH);
				}
				else {
					lineContent += lineData;
				}
				lineContent += '|'
			}
			await ns.print(lineContent);

		}
	}
	while (true) {
		ns.clearLog();
		SERVERS = await serverMonitor();
		GANG = await gangMonitor();
		HACKING = await hackMonitor();
		STOCKS = await stocksMonitor();
		SLEEVES = await sleevesMonitor();
		MISC = await statsMonitor();
		HACKNET = await hackNetMonitor();
		var misc_sleeves = MISC.concat(SLEEVES);
		//PRE-GANG
		//var row1 = [misc_sleeves, SERVERS, HACKNET];
		//GANG
		var row1 = [misc_sleeves, SERVERS, GANG];
		//var row2 = [HACKING, STOCKS];
		await ns.print(header)
		await printer(row1);
		//await ns.print(header)
		//await printer(row2);

		await ns.sleep(500);
	}

}