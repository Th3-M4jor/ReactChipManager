import { saveAs } from "file-saver";
import { FolderWebSocket } from "./FolderWebSocket";


const URL = "https://spartan364.hopto.org/chips.json";


/**
 * @typedef chipProps
 * @type {object}
 * @property {string} Name
 * @property {string[]} Element
 * @property {string[]} Skills
 * @property {string} Range
 * @property {string} Damage
 * @property {("Standard"|"Mega"|"Giga"|"Dark"|"Support")} Type
 * @property {string} Hits
 * @property {string} Description
 * @property {string} All
 * 
 */

/**
 * @typedef FolderChipObj
 * @type {object}
 * @property {string} Name
 * @property {boolean} Used
 */


const damageRegex = /(\d+)d(\d+)/;


function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        let x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

const elementsEnum = {
    Fire: 0,
    Aqua: 1,
    Elec: 2,
    Wood: 3,
    Wind: 4,
    Sword: 5,
    Break: 6,
    Cursor: 7,
    Recovery: 8,
    Invis: 9,
    Object: 10,
    Null: 11,
};

const skillsEnum = {
    Sense: 0,
    Info: 1,
    Coding: 2,
    Strength: 3,
    Speed: 4,
    Stamina: 5,
    Charm: 6,
    Bravery: 7,
    Affinity: 8,
    Varies: 9,
    None: 10,
};

const rangesEnum = {
    Far: 0,
    Near: 1,
    Close: 2,
    Self: 3,
}

const chipTypeEnum = {
    Standard: 0,
    Mega: 1,
    Giga: 2,
    Dark: 3,
    Support: 0,
}


/**
 * @class BattleChip represents a full battlechip's data
 * static values hold the entire library and owned chip data
 */
export class BattleChip {

    /** @private */static _FOLDER_LIMIT = 15;

    /** @private */static _STANDARD_DUPLICATES_LIMIT = 3;

    /** @private */static _MEGA_DUPLICATES_LIMIT = 1;

    /** @private */static _GIGA_DUPLICATES_LIMIT = 1;

    /**
     * @private
     * @type {FolderChipObj[]}
     */
    static _FOLDER = [];

    static _SAVE_ON_INTERVAL = true;

    /** @private
     * @type {Map<string, BattleChip>}
     */
    static _library = new Map();


    static getFolderSize() {
        return BattleChip._FOLDER_LIMIT;
    }

    /**
     * 
     * @param {number} newSize 
     */
    static setFolderSize(newSize) {
        if (newSize < BattleChip._FOLDER.length) {
            throw new Error("You must remove chips from your folder before you can lower this number");
        }
        BattleChip._FOLDER_LIMIT = newSize;
    }

    static getFolder() {
        return BattleChip._FOLDER;
    }

    static async loadChips() {

        window.addEventListener("beforeunload", function (e) {
            let confirmationMessage = 'Progress might be lost if you leave without saving an export.';

            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            BattleChip.saveChips();
            return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
        });

        BattleChip._library.clear();
        let body = await fetch(URL);
        let result = await body.json();
        result.forEach(chip => {
            BattleChip._library.set(chip.Name.toLocaleLowerCase(), new BattleChip(chip));
        });

        if (!storageAvailable('localStorage')) {
            alert("Local storage is not available, it is used to backup your folder and pack periodically");
            BattleChip._SAVE_ON_INTERVAL = false;
            return true;
        }

        let pack = window.localStorage.getItem('pack');
        let folder = window.localStorage.getItem('folder');
        let chipLimit = window.localStorage.getItem('chipLimit');
        if (chipLimit != null && +chipLimit > 0) {
            BattleChip._FOLDER_LIMIT = +chipLimit;
        }
        if (pack != null) {
            try {
                let oldSave = JSON.parse(pack);
                oldSave.forEach((chip) => {
                    if (BattleChip._library.has(chip.Name.toLocaleLowerCase())) {
                        let battlechip = BattleChip._library.get(chip.Name.toLocaleLowerCase());
                        battlechip.Owned = chip.Owned;
                        battlechip.Used = chip.Used;
                    } else {
                        alert(`The chip ${chip.Name} no longer exists in the library, cannot add it to your pack, you owned ${chip.Owned} of them`);
                    }
                });
            } catch (e) {
                alert("Unable to load old pack");
            }
        }
        if (folder != null) {
            try {
                let oldSave = JSON.parse(folder);
                oldSave.forEach((chip) => {
                    if (BattleChip._library.has(chip.Name.toLocaleLowerCase())) {
                        BattleChip._FOLDER.push({ Name: chip.Name, Used: chip.Used });
                    }
                    else {
                        alert(`The chip ${chip.Name} no longer exists in the library, cannot add it to your folder you had it marked as ${chip.Used ? "used" : "unused"}`);
                    }
                });
            } catch (e) {
                alert("unable to load old folder");
            }
        }
        setInterval(() => {
            BattleChip.saveChips();
        }, 600000);
        return true;
    }

    /**
     * Return all chips from you folder to your pack
     * 
     * @returns {number} the number of chips removed
     */
    static emptyFolder() {
        let toRet = BattleChip._FOLDER.length;
        while (BattleChip._FOLDER.length !== 0) {
            let removedChip = BattleChip._FOLDER.shift();
            let packChip = BattleChip.getChip(removedChip.Name);
            packChip.Owned++;
            if (removedChip.Used) {
                packChip.Used++;
            }
        }
        FolderWebSocket.folderUpdated();
        return toRet;
    }

    static saveChips() {
        if (!BattleChip._SAVE_ON_INTERVAL) return;
        let folder = JSON.stringify(BattleChip._FOLDER);
        let packArr = [];
        BattleChip._library.forEach((chip) => {
            if (chip.Owned > 0) {
                packArr.push({ Name: chip._name, Owned: chip._owned, Used: chip._used });
            }
        });
        let pack = JSON.stringify(packArr);
        window.localStorage.setItem('pack', pack);
        window.localStorage.setItem('folder', folder);
        window.localStorage.setItem('chipLimit', BattleChip._FOLDER_LIMIT.toFixed(0));
    }

    static exportJSON() {
        BattleChip.saveChips();
        let packArr = [];
        BattleChip._library.forEach((chip) => {
            if (chip.Owned > 0) {
                packArr.push({ Name: chip._name, Owned: chip._owned, Used: chip._used });
            }
        });

        let toSave = JSON.stringify({ Folder: BattleChip._FOLDER, Limit: BattleChip._FOLDER_LIMIT, Pack: packArr }, null, '\t');
        let blob = new Blob([toSave], { type: "application/json;charset=utf-8" });
        saveAs(blob, "pack.json");
    }

    static exportText() {
        BattleChip.saveChips();

        /** @type {string} */
        let text;
        if (BattleChip._FOLDER.length !== 0) {
            text = "Folder: ";
            BattleChip._FOLDER.forEach((chip) => {
                text += chip.Name;
                if (chip.Used) {
                    text += " (Used), ";
                } else {
                    text += ", ";
                }
            });
            text = text.slice(0, -2);
            text += "\nPack: ";
        } else {
            text = "Pack: ";
        }
        let packArr = [];
        BattleChip._library.forEach((chip) => {
            if (chip.Owned > 0) {
                packArr.push({ Name: chip._name, Owned: chip._owned, Used: chip._used });
            }
        });

        packArr.forEach((chip) => {
            text += chip.Name;
            if (chip.Owned > 1) {
                text += ` x${chip.Owned}`;
            }

            if (chip.Used === 1 && chip.Owned === 1) {
                text += " (Used)";
            } else if (chip.Used > 0) {
                text += ` (${chip.Used} Used)`;
            }
            text += ", ";
        });

        text = text.slice(0, -2);
        let blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "pack.txt");

    }


    static unloadChips() {
        BattleChip._FOLDER = [];
        BattleChip._FOLDER_LIMIT = 15;
        BattleChip._library.forEach((chip) => {
            chip.Used = 0;
            chip.Owned = 0;
        });
        FolderWebSocket.folderUpdated();
        if (BattleChip._SAVE_ON_INTERVAL) {
            window.localStorage.removeItem('pack');
            window.localStorage.removeItem('folder');
            window.localStorage.removeItem('chipLimit');
        }
    }

    /**
     * 
     * @param {string} data a json to parse and convert to your folder, and pack 
     * 
     * @return {boolean | number} returns the number of chips now in your pack, or false if it failed to parse the text
     */
    static importChips(data) {

        let pack;
        try {
            pack = JSON.parse(data);
            if (!Array.isArray(pack.Folder) || typeof pack.Limit !== "number" || !Array.isArray(pack.Pack)) {
                return false;
            }
        } catch (e) {
            return false;
        }
        BattleChip.unloadChips();
        BattleChip._FOLDER_LIMIT = pack.Limit;
        let num = 0;
        try {
            pack.Pack.forEach((chip) => {
                if (typeof chip !== "object" || typeof chip.Name !== "string" || typeof chip.Owned !== "number" || typeof chip.Used !== "number") {
                    alert("Save appears to be improperly formatted, aborting");
                    throw new Error();
                }
                if (BattleChip._library.has(chip.Name.toLocaleLowerCase())) {
                    let battlechip = BattleChip._library.get(chip.Name.toLocaleLowerCase());
                    battlechip.Owned = chip.Owned;
                    battlechip.Used = chip.Used;
                    num += chip.Owned;
                } else {
                    alert(`The chip ${chip.Name} no longer exists in the library, cannot add it to your pack, you owned ${chip.Owned} of them`);
                }
            });

            pack.Folder.forEach((chip) => {
                if (typeof chip !== "object" || typeof chip.Name !== "string" || typeof chip.Used !== "boolean") {
                    alert("Save appears to be improperly formatted, aborting");
                    throw new Error();
                }

                if (BattleChip._library.has(chip.Name.toLocaleLowerCase())) {
                    BattleChip._FOLDER.push({ Name: chip.Name, Used: chip.Used });
                    num += 1;
                }
                else {
                    alert(`The chip ${chip.Name} no longer exists in the library, cannot add it to your folder you had it marked as ${chip.Used ? "used" : "unused"}`);
                }
            });
        } catch (e) {
            FolderWebSocket.folderUpdated();
            return false;
        }
        FolderWebSocket.folderUpdated();
        return num;
    }

    /**
     * @returns {BattleChip[]} an array of all battlechips
     */
    static libraryAsArray() {
        return [...BattleChip._library.values()];
    }

    /**
    * 
    * @param {string} name
    * 
    * @returns {BattleChip} a battlechip if there is one
    * 
    * @throws if an improper chip name was used
    */
    static getChip(name) {
        if (!BattleChip._library.has(name?.toLocaleLowerCase())) {
            throw new Error("Bad chip name");
        }
        return BattleChip._library.get(name.toLocaleLowerCase());
    }

    /**
     * 
     * @param {chipProps} chipObj the raw chip data
     */
    constructor(chipObj) {
        /** @private */this._name = chipObj.Name;
        /** @private
         *  @type {number[]}
         */
        this._element = chipObj.Element.map((elem) => {
            return elementsEnum[elem];
        });
        /** @private */this._skills = chipObj.Skills;
        /** @private
        *  @type {number} */
        this._skillSortPos = 0;
        if (this._skills.length > 1) {
            this._skillSortPos = skillsEnum.Varies;
        } else {
            this._skillSortPos = skillsEnum[this._skills[0]];
        }
        if (this._skills[0] === "None") {
            this._skills[0] = "--";
        }
        /** @private */this._range = chipObj.Range;
        /** @private */this._damage = chipObj.Damage;
        /** @private */this._type = chipObj.Type;
        /** @private */this._hits = chipObj.Hits;
        /** @private */this._description = chipObj.Description;
        /** @private */this._all = chipObj.All;

        /** @private */this._avgDamage = 0;
        /** @private */this._maxDamage = 0;
        let dice = damageRegex.exec(this._damage);
        if (dice !== null) {
            //average damage is determined by average die roll (always half max face value + 0.5) * number of dice
            this._avgDamage = Math.floor(((+dice[2] / 2) + 0.5) * (+dice[1]));
            this._maxDamage = +dice[2] * +dice[1];
        }
        
        /**@private 
         * @type {number}
         */
        this._chipTypeSortPos = chipTypeEnum[this._type];

        /**
         * @private
         * @type {number}
         */
        this._chipRangeSortPos = rangesEnum[this._range];


        /** @private */this._owned = 0;
        /** @private */this._used = 0;

    }

    get Name() {
        return this._name;
    }

    get Element() {
        return this._element;
    }

    get Skill() {
        if (this._skills.length > 1) return "Varies";
        else return this._skills[0];
    }

    get Damage() {
        return this._damage;
    }

    get AvgDamage() {
        return this._avgDamage;
    }

    get MaxDamage() {
        return this._maxDamage;
    }

    get Range() {
        return this._range;
    }

    get Type() {
        return this._type;
    }

    get Hits() {
        return this._hits;
    }

    get Description() {
        return this._description;
    }

    get RangeSortPos() {
        return this._chipRangeSortPos;
    }

    get TypeSortPos() {
        return this._chipTypeSortPos;
    }

    get SkillSortPos() {
        return this._skillSortPos;
    }

    get Owned() {
        return this._owned;
    }

    get Used() {
        return this._used;
    }

    get UnUsed() {
        return this._owned - this._used;
    }

    /**
     * @param {number} newCt
     */
    set Owned(newCt) {

        if (newCt < 0) {
            throw new Error(`Bad owned value for ${this._name}`);
        }

        if (newCt < this._used) {
            this._used = newCt;
        }
        this._owned = newCt;
    }

    /**
     * @param {number} newCt
     */
    set Used(newCt) {
        if (newCt > this._owned) {
            throw new Error("Cannot set used count higher than owned count");
        }
        this._used = newCt;
    }

    /**
     * the full text of the chip as written in the official Chip Library
     */
    get All() {
        return this._all;
    }

    addToFolder() {




        if (BattleChip._FOLDER_LIMIT <= BattleChip._FOLDER.length) {
            throw new Error(`Cannot add a copy of ${this._name} to your folder for the following reason:\n your folder is full`);
        }

        let unused = this._owned - this._used;
        if (unused <= 0) {
            throw new Error(`Cannot add a copy of ${this._name} to your folder for the following reason:\nyou don't have an unused copy`);
        }

        let currCount = BattleChip._FOLDER.filter((chip) => {
            return chip.Name === this._name;
        }).length;


        switch (this._type) {

            case "Giga":
                if (currCount >= BattleChip._GIGA_DUPLICATES_LIMIT) {
                    throw new Error(`Cannot add a copy of ${this._name} to your folder for the following reason:\nYou cannot have more than ${BattleChip._GIGA_DUPLICATES_LIMIT} of the same Giga Chip`);
                }
                break;

            case "Mega":
                if (currCount >= BattleChip._MEGA_DUPLICATES_LIMIT) {
                    throw new Error(`Cannot add a copy of ${this._name} to your folder for the following reason:\nYou cannot have more than ${BattleChip._MEGA_DUPLICATES_LIMIT} of the same Mega Chip`);
                }
                break;

            case "Standard":
            default:
                if (currCount >= BattleChip._STANDARD_DUPLICATES_LIMIT) {
                    throw new Error(`Cannot add a copy of ${this._name} to your folder for the following reason:\nYou cannot have more than ${BattleChip._STANDARD_DUPLICATES_LIMIT} of the same Standard Chip`);
                }
        }

        BattleChip._FOLDER.push({ Name: this.Name, Used: false });
        this._owned--;
        FolderWebSocket.folderUpdated();
    }

    /**
     * Remove a specified chip from the folder and return it to the pack, as used or unused
     * 
     * @param {string} name 
     * @param {boolean} used
     */
    static returnToPack(name, used) {
        let chipIndex = -1;
        for (let i = 0; i < BattleChip._FOLDER.length; i++) {
            if (BattleChip._FOLDER[i].Name === name) {
                chipIndex = i;
            }
        }
        if (chipIndex < 0) {
            throw new Error("Could not find specified chip");
        }
        BattleChip._FOLDER.splice(chipIndex, 1);
        let chip = BattleChip.getChip(name);
        chip.Owned++;
        if (used) {
            chip.Used++;
        }
        FolderWebSocket.folderUpdated();
    }

    /**
     * returns a specific index back into the pack from your folder
     * @param {number} index 
     * @returns {string} the name of the chip returned
     */
    static returnToPackByIndex(index) {
        let chip = BattleChip._FOLDER.splice(index, 1)[0];
        let packChip = BattleChip.getChip(chip.Name);
        packChip.Owned++;
        if (chip.Used) {
            packChip.Used++;
        }
        FolderWebSocket.folderUpdated();
        return chip.Name;
    }

    /**
     * reset all used chips to unused
     * 
     * @return {number} number of chips returned to unused
     */
    static jackOut() {
        let usedCount = 0;
        BattleChip._FOLDER.forEach((chip) => {
            if (chip.Used) {
                usedCount++;
                chip.Used = false;
            }
        });
        BattleChip._library.forEach((chip) => {
            usedCount += chip.Used;
            chip.Used = 0;
        });
        FolderWebSocket.folderUpdated();
        return usedCount;
    }



}