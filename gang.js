/** @param {NS} ns */
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');
	const tickRate = 500;
	const maxTicks = 600; //600 = 5 minutes
	const maxLogs = 10;
	var ticks = 0;
	var cycles = 0;
	var maxBonus = ['0', 0];
	var eventLog = [];
	var upgCost = 0;
	var augCost = 0;
	var taskFlag = await ns.prompt('Prioritise $$$ over Rep?');
	var buyFlag = await ns.prompt('Auto-purchase upgrades and augmentations?');
	async function log(event) {
		eventLog.push(event);
		if (eventLog.length > maxLogs) {
			eventLog.shift();
		}
	}
	async function recruitingManager() {
		var gMembers = await ns.gang.getMemberNames();
		var numMembers = gMembers.length;
		if (numMembers < 12 && ns.gang.canRecruitMember()) {
			var newName = (Math.random() + 1).toString(36).substring(0, 5);
			if (gMembers.includes(newName) == false) {
				ns.gang.recruitMember(newName);
				log(`Recruited new gang member : ${newName}`);
			}
		}
	}
	async function taskManager() {
		var gMembers = ns.gang.getMemberNames();
		var gInfo = await ns.gang.getGangInformation();
		const hackTasks = ["Unassigned", "Ransomware", "Phishing", "Identity Theft", "DDoS Attacks", "Plant Virus", "Fraud & Counterfeiting", "Money Laundering", "Cyberterrorism", "Ethical Hacking"];
		const hackTiers = [130, 260, 320, 410, 700, 1000];
		// if (gInfo['wantedLevelGainRate'] > 0) {
		// 		var ethicalHackers = [gMembers[cycles % 3], gMembers[(cycles % 3) + 1]];
		// 	}
		// 	else {
		// 		var ethicalHackers = [gMembers[cycles % 3]];
		// 	}
		var ethicalHackers = [gMembers[cycles % 3]]
		for (var i = 0; i < gMembers.length; i++) {
			var mInfo = await ns.gang.getMemberInformation(gMembers[i]);
			var currentTask = mInfo['task'];
			if (mInfo['hack'] < hackTiers[0] && currentTask != hackTasks[8]) { //&& gInfo['respect'] < 1000000) {
				await ns.gang.setMemberTask(gMembers[i], hackTasks[8]);
				log(`Assigned ${gMembers[i]} to ${hackTasks[8]}`);
			}
			else if (ethicalHackers.includes(gMembers[i]) && mInfo['hack'] >= hackTiers[0] && currentTask != hackTasks[9]) {
				await ns.gang.setMemberTask(gMembers[i], hackTasks[9]);
				log(`Assigned ${gMembers[i]} to ${hackTasks[9]}`);
			}
			else if (ethicalHackers.includes(gMembers[i]) == false && mInfo['hack'] >= hackTiers[0] && mInfo['hack'] < hackTiers[1] && currentTask != hackTasks[2]) {
				await ns.gang.setMemberTask(gMembers[i], hackTasks[2]);
				log(`Assigned ${gMembers[i]} to ${hackTasks[2]}`);
			}
			else if (ethicalHackers.includes(gMembers[i]) == false && mInfo['hack'] >= hackTiers[1] && mInfo['hack'] < hackTiers[2] && currentTask != hackTasks[3]) {
				await ns.gang.setMemberTask(gMembers[i], hackTasks[3]);
				log(`Assigned ${gMembers[i]} to ${hackTasks[3]}`);
			}
			else if (ethicalHackers.includes(gMembers[i]) == false && mInfo['hack'] >= hackTiers[2] && mInfo['hack'] < hackTiers[3] && currentTask != hackTasks[4]) {
				await ns.gang.setMemberTask(gMembers[i], hackTasks[4]);
				log(`Assigned ${gMembers[i]} to ${hackTasks[4]}`);
			}
			else if (ethicalHackers.includes(gMembers[i]) == false && mInfo['hack'] >= hackTiers[3] && mInfo['hack'] < hackTiers[4] && currentTask != hackTasks[5]) {
				await ns.gang.setMemberTask(gMembers[i], hackTasks[5]);
				log(`Assigned ${gMembers[i]} to ${hackTasks[5]}`);
			}
			else if (ethicalHackers.includes(gMembers[i]) == false && mInfo['hack'] >= hackTiers[4] && mInfo['hack'] < hackTiers[5] && currentTask != hackTasks[6]) {
				await ns.gang.setMemberTask(gMembers[i], hackTasks[6]);
				log(`Assigned ${gMembers[i]} to ${hackTasks[6]}`);
			}
			else if (ethicalHackers.includes(gMembers[i]) == false && mInfo['hack'] >= hackTiers[5] && currentTask != hackTasks[7] && taskFlag) {
				await ns.gang.setMemberTask(gMembers[i], hackTasks[7]);
				log(`Assigned ${gMembers[i]} to ${hackTasks[7]}`)
			}
			else if (ethicalHackers.includes(gMembers[i]) == false && mInfo['hack'] >= hackTiers[5] && currentTask != hackTasks[8] && taskFlag == false) {
				await ns.gang.setMemberTask(gMembers[i], hackTasks[8]);
				log(`Assigned ${gMembers[i]} to ${hackTasks[8]}`)
			}
			// else {
			// 	log(`${gMembers[i]} unchanged, hacklvl: ${mInfo['hack']}, task: ${currentTask}`);
			// }
		}
	}
	async function upgradeManager() {
		const upgrades = ["NUKE Rootkit", "Soulstealer Rootkit", "Demon Rootkit", "Hmap Node", "Jack the Ripper", "BitWire", "Neuralstimulator", "DataJack"];
		upgCost = 0; augCost = 0;
		for (var i = 0; i < upgrades.length; i++) {
			if (i < 5) {
				upgCost += await ns.gang.getEquipmentCost(upgrades[i])
			}
			else {
				augCost += await ns.gang.getEquipmentCost(upgrades[i])
			}
		}
		if (buyFlag) {
			var gMembers = await ns.gang.getMemberNames();
			for (var i = 0; i < gMembers.length; i++) {
				var mInfo = await ns.gang.getMemberInformation(gMembers[i]);
				var money = await ns.getPlayer().money;
				for (var j = 0; j < upgrades.length; j++) {
					if (mInfo['upgrades'].includes(upgrades[j]) == false && mInfo['augmentations'].includes(upgrades[j]) == false && await ns.gang.getEquipmentCost(upgrades[j]) < money) {
						await ns.gang.purchaseEquipment(gMembers[i], upgrades[j]);
						log(`Bought ${upgrades[j]} for Gang Member ${gMembers[i]}`);
					}
				}
			}
		}
	}
	async function ascensionManager() {
		var ascThreshold = 1.25;
		var gMembers = await ns.gang.getMemberNames();
		for (var i = 0; i < gMembers.length; i++) {
			var mInfo = await ns.gang.getMemberInformation(gMembers[i]);
			var result = await ns.gang.getAscensionResult(gMembers[i]);
			if (result != undefined) {
				if (result['hack'] > maxBonus[1]) {
					maxBonus = [gMembers[i], result['hack']];
				}
			}
		}
		if (ticks >= maxTicks) {
			ticks = 0
			cycles++;
			if (maxBonus[1] > ascThreshold) {
				await ns.gang.ascendMember(maxBonus[0])
				log(`Ascended ${maxBonus[0]}`);
				ticks = 0;
				maxBonus = ['0', 0];
			}
			else {
				log(`${maxBonus[0]} did not meet threshold for ascension`);
			}
		}
		else {
			ticks++;
		}
	}
	async function lineWrap(content) {
		var spacer = '-'; var maxLineLength = 50;
		var contentLength = content.length;
		var dashes = maxLineLength - contentLength;
		var left; var right;
		if (content == 'gap') {
			await ns.print(`${spacer}${' '.repeat(maxLineLength - 2)}${spacer}`)
		}
		else if (contentLength < maxLineLength) {
			if (dashes % 2 != 0) {
				left = ((dashes + 1) / 2) - 1; right = ((dashes - 1) / 2) - 1;
			}
			else {
				left = (dashes / 2) - 1; right = (dashes / 2) - 1;
			}
			if (left <= 0) { left = 1 };
			if (right <= 0) { right = 0 };
			left = spacer.repeat(left); right = spacer.repeat(right);
			if (contentLength == 0) {
				await ns.print(spacer.repeat(maxLineLength));
			}

			else {
				await ns.print(`${left} ${content} ${right}`);
			}
		}
		else {
			await ns.print(`${spacer} ${content}`);
		}
	}
	async function logWindow() {
		var numMembers = await ns.gang.getMemberNames().length;
		var info = await ns.gang.getGangInformation();
		await lineWrap('');
		await lineWrap("ber's Hacking Gang Manager v1.0");
		await lineWrap(`Upgrade Cost: \$${(upgCost / 1000000).toFixed(1)}M | Augment Cost: \$${(augCost / 1000000).toFixed(1)}M`);
		await lineWrap(`Number of Gang members: ${numMembers}`);
		await lineWrap('gap');
		await lineWrap(`Tick Rollover: ${maxTicks} | Ticks: ${ticks} | Cycles: ${cycles}`);
		await lineWrap(`Next asc: ${maxBonus[0]} | Mult: ${maxBonus[1].toFixed(4)}`);
		await lineWrap('gap');
		await lineWrap('Event Log')
		await lineWrap('gap');
		for (var i = 0; i < eventLog.length; i++) {
			await lineWrap(`${eventLog[i]}`);
		}
		await lineWrap('');
	}

	while (true) {
		ns.clearLog();
		await logWindow();
		await recruitingManager();
		await upgradeManager();
		await ascensionManager();
		await taskManager();
		await ns.sleep(tickRate);
	}

}