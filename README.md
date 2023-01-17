# bitburner
Scripts that automate various functions in the game Bitburner.

Written in Javascript using the Netscript2.0 framework.

Game URL: https://store.steampowered.com/app/1812820/Bitburner/

Repo contents:

#gang.js

Automatically grows and manages the gang feature; automating task assignment, recruitment, upgrades and ascension. Players are prompted at startup whether to focus on money or reputation generation. Includes a monitoring dashboard to easily view the status of members and an event log.

This script is currently only tailored for hacking gangs, combat gang management will be in a future release.

#hackingManager.js

Adapted script from Steam User PG SVDX
Automatically Hacks, Grows and Weakens all servers on the topology of the network that is able to reached given the player's current hacking skill and available programs. In addition, has modules to automate Hacknet and Server purchasing.

TODO: Refactor to increase readability.

#sleeves.js

Simple script to set all sleeves to either the Mug or Homicide crimes to boost money gain and karma loss, mostly used immediately after installing augmentations or at the start of a new Bitnode once the sleeve shock wears off.

TODO: Add check to ignore task reassignment if sleeve shock > threshold.

#monitor.js

Generates a dashboard window to monitor multiple aspects of the game instead of having to click through multiple menus in the game UI. Visualises a lot of functionality of the other automation scripts as well as introduces distinct visualisations.

TODO: Incorporate singularity API functionality and rebuild gang dashboard to bring across features from the gang.js script.
