import React from 'react';
import { MDBRow, MDBCol, MDBContainer, MDBBtn, } from 'mdbreact';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
// eslint-disable-next-line
import { BattleChip } from './ChipLibrary';
import { Packchip } from './battlechip';
import './App.css';
import './Battlechip.css';


function cmp(a, b) {
    if (a > b) return +1;
    if (a < b) return -1;
    return 0;
}

export class Pack extends React.Component {

    state = {
        sortBy: "Name",
        doubleClickAction: "folder"
    }

    static rightClickedChipName = "";

    sortSelectChanged = (event) => { this.setState({ sortBy: event.target.value }); }

    doubleClickActionChanged = (event) => { this.setState({ doubleClickAction: event.target.value }); }

    addToFolderClick = () => {
        if (Pack.rightClickedChipName !== "") {
            try {
                let chip = BattleChip.getChip(Pack.rightClickedChipName);
                chip.addToFolder();
                this.props.msgCallback(`A copy of ${chip.Name} has been added to your folder`);
            } catch (err) {
                alert(err.message);
            }
            Pack.rightClickedChipName = "";
        }
    }

    removeFromPackClick = () => {
        if (Pack.rightClickedChipName !== "") {
            let chip = BattleChip.getChip(Pack.rightClickedChipName);
            chip.Owned--; this.props.msgCallback(`A copy of ${chip.Name} has been removed from your pack`);
        }
        Pack.rightClickedChipName = "";
    }

    markChipUnused = () => {
        if (Pack.rightClickedChipName !== "") {
            let chip = BattleChip.getChip(Pack.rightClickedChipName);
            if (chip.Used <= 0) {
                alert(`You do not have any used coppies of ${chip.Name}`);
                Pack.rightClickedChipName = "";
                return;
            }
            chip.Used--; this.props.msgCallback(`A copy of ${chip.Name} has been marked unused`);
        }
    }

    OnShowContextMenu = () => {
        let target = document.querySelector(".chipHover:hover");
        if (target === null) {
            console.log("did not find element");
            return;
        } else {
            console.log(target.id.slice(0, -2));
        }
        Pack.rightClickedChipName = target.id.slice(0, -2);
    }

    onHideContextMenu = () => {
        Pack.rightClickedChipName = "";
    }

    eraseData() {
        this.props.modalOpen("Are you sure you want to remove everything from your pack and folder?", () => {
            BattleChip.unloadChips();
            this.props.msgCallback("Your folder and pack are now empty");
        });
    }

    importData() {
        this.props.modalOpen("Importing will erase your current folder and pack, are you sure you want to continue?", () => {
            this.upload.click();
        });
    }


    importFileGet() {
        let files = document.getElementById('jsonFile').files;
        if (files && files.length > 0) {

            /**@type {File} */
            let file = files[0];
            file.text().then((text) => {
                let result = BattleChip.importChips(text);
                if (!result) {
                    this.props.msgCallback("Import Failed");
                } else {
                    this.props.msgCallback(`${result} chips total are in your pack and folder`);
                }
            });
        }
    }

    /**
     * @private
     * @param {BattleChip[]} list
     * @returns {BattleChip[]}
     */
    sortChips(list) {
        switch (this.state.sortBy) {
            case "Name":
                return list.sort((a, b) => cmp(a.TypeSortPos, b.TypeSortPos) || cmp(a.Name, b.Name));
            case "Element":
                return list.sort((a, b) => cmp(a.Element[0], b.Element[0]) || cmp(a.Name, b.Name));
            case "MaxDamage":
                return list.sort((a, b) => cmp(b.MaxDamage, a.MaxDamage) || cmp(a.Name, b.Name));
            case "AverageDamage":
                return list.sort((a, b) => cmp(b.AvgDamage, a.AvgDamage) || cmp(a.Name, b.Name));
            case "Skill":
                return list.sort((a, b) => cmp(a.SkillSortPos, b.SkillSortPos) || cmp(a.Name, b.Name));
            case "Range":
                return list.sort((a, b) => cmp(a.RangeSortPos, b.RangeSortPos) || cmp(a.Name, b.Name));
            case "Owned":
                return list.sort((a, b) => cmp(b.Owned, a.Owned) || cmp(a.Name, b.Name));
            default:
                throw Error("Invalid sort option");
        }
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.active === false) {
            return false;
        }
        return true;
    }

    render() {


        /**@type {BattleChip[]} */
        let chipList = BattleChip.libraryAsArray().filter((chip) => {
            return chip.Owned > 0;
        });

        this.sortChips(chipList);

        let chips = chipList.map((chip) => {

            return (
                <Packchip chipName={chip.Name} ownedCt={chip.Owned} usedCt={chip.Used} key={chip.Name + "P"} action={this.state.doubleClickAction} msgCallback={this.props.msgCallback} />
            );
        });
        
        let packStatus = (this.props.active ? "Folder activefolder" : "Folder");
        return (

            <MDBContainer fluid>
                <MDBRow>
                    <MDBCol size="10" className="debug nopadding">
                        <MDBContainer id="fullPack" className={packStatus} fluid>
                            <MDBRow center className="sticky-top" style={{ backgroundColor: "gray" }}>
                                <MDBCol size="3" className="debug Chip nopadding">
                                    NAME
                    </MDBCol>
                                <MDBCol size="2" className="debug Chip nopadding">
                                    SKILL
                    </MDBCol>

                                <MDBCol size="1" className="debug Chip nopadding">
                                    DMG
                    </MDBCol>
                                <MDBCol size="1" className="debug Chip nopadding">
                                    RANGE
                    </MDBCol>
                                <MDBCol size="1" className="debug Chip nopadding">
                                    HITS
                    </MDBCol>
                                <MDBCol size="1" className="debug Chip nopadding">

                                </MDBCol>
                                <MDBCol size="1" className="debug Chip nopadding">
                                    OWN
                                </MDBCol>
                                <MDBCol size="1" className="debug Chip nopadding">
                                    USED
                                </MDBCol>
                            </MDBRow>
                            <ContextMenuTrigger id="PackContextMenu">
                                {chips}
                            </ContextMenuTrigger>
                            <ContextMenu id="PackContextMenu" hideOnLeave onShow={this.OnShowContextMenu} onHide={this.onHideContextMenu}
                                className="RightClickMenu">
                                <MenuItem onClick={this.addToFolderClick} className="RightClickMenuItem">
                                    <span className="noselect">Add to Folder</span>
                                </MenuItem>
                                <MenuItem onClick={this.removeFromPackClick} className="RightClickMenuItem">
                                    <span className="noselect">Remove from Pack</span>
                                </MenuItem>
                                <MenuItem onClick={this.markChipUnused} className="RightClickMenuItem">
                                    <span className="noselect">Mark copy Unused</span>
                                </MenuItem>
                            </ContextMenu>
                        </MDBContainer>
                    </MDBCol>
                    <MDBCol size="2" className="debug nopadding">
                        <span unselectable="off" className="Chip">Sort By</span><br />
                        <select value={this.state.sortBy} onChange={this.sortSelectChanged} style={{ width: "100%" }} className="browser-default custom-select">
                            <option value="Name">Name</option>
                            <option value="Element">Element</option>
                            <option value="MaxDamage">MaxDamage</option>
                            <option value="AverageDamage">AverageDamage</option>
                            <option value="Skill">Skill</option>
                            <option value="Range">Range</option>
                            <option value="Owned">Owned</option>
                        </select>
                        <br />
                        <br />
                        <span unselectable="off" className="Chip">Double Clicking Will:</span><br />
                        <select value={this.state.doubleClickAction} onChange={this.doubleClickActionChanged} style={{ width: "100%" }} className="browser-default custom-select">
                            <option value="folder">Add To Folder</option>
                            <option value="remove">Remove From Pack</option>
                        </select>

                        <br />
                        <br />
                        <div className="centerContent">
                            <MDBBtn onClick={() => {
                                let count = BattleChip.jackOut();
                                this.props.msgCallback(`${count} chips have been marked as unused`);
                            }} color="blue-grey"
                            >
                                <span className="Chip">Jack Out</span>
                            </MDBBtn>
                            <MDBBtn onClick={() => { BattleChip.exportJSON() }} color="blue-grey">
                                <span className="Chip">Export JSON</span>
                            </MDBBtn>
                            <MDBBtn onClick={() => { BattleChip.exportText() }} color="blue-grey">
                                <span className="Chip">Export TXT</span>
                            </MDBBtn>
                            <MDBBtn onClick={() => { this.eraseData() }} color="blue-grey">
                                <span className="Chip">Erase Data</span>
                            </MDBBtn>
                            <MDBBtn onClick={() => { this.importData() }} color="blue-grey">
                                <span className="Chip">Import Data</span>
                            </MDBBtn>
                        </div>
                        <input id="jsonFile" type="file" ref={(ref) => this.upload = ref} style={{ display: 'none' }} accept=".json" onChange={() => { this.importFileGet() }} />
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}