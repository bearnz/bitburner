/** @param {NS} ns */
export async function main(ns) {
    var a = 'mug';
    var b = 'homicide';
    for (var i = 0; i < ns.sleeve.getNumSleeves(); i++) {
        var crime = ns.sleeve.getTask(i);
        try {
        if (crime['crimeType'] != undefined) {
            if (crime['crimeType'].toLowerCase() == b) {
                ns.sleeve.setToCommitCrime(i, a);
            }
            else {
                ns.sleeve.setToCommitCrime(i, b);
            }
        }
        else if (crime.toLowerCase() == null) {
            ns.sleeve.setToCommitCrime(i, b);
        }
        else {
            var crime = ns.sleeve.getTask(i)['crimeType'];
        }}
        catch (error) {
            ns.sleeve.setToCommitCrime(i, b);
        }
    }
}