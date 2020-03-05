import React from 'react';
import { MDBRow, MDBCol, MDBContainer, MDBTooltip, } from 'mdbreact';
import { BattleChip } from './ChipLibrary';
import { ElementImage } from "./ElementImage";
import { FolderWebSocket } from "./FolderWebSocket";
import './App.css';
import './Battlechip.css';


/**
 * @typedef FolderChipObj
 * @type {object}
 * @property {string} Name
 * @property {boolean} Used
 */

class GroupFolderChip extends React.Component {
    render() {
        if (!this.props.playerName) throw new Error("playerName not set in props");
        if (!this.props.folderIndex) throw new Error("index not set");

        /** @type {FolderChipObj} */
        let folderChip = FolderWebSocket.getGroupFolders()[this.props.playerName].Chips[this.props.folderIndex];
        let chip = BattleChip.getChip(folderChip.Name);
        let type = "";
        if (folderChip.Used) {
            type = "UsedChip";
        } else {
            switch (chip.Type) {
                case "Giga":
                    type = "Giga";
                    break;
                case "Mega":
                    type = "Mega";
                    break;
                case "Standard":
                default:
                    type = "Chip";
                    break;
            }
        }
        return (
            <MDBTooltip domElement>
                <div className={type + " noselect "} id={`F${this.props.playername}_${this.props.folderIndex}`}>
                    <MDBRow center>
                        <MDBCol size="1" className="debug nopadding">
                            {this.props.folderIndex + 1}
                        </MDBCol>
                        <MDBCol size="3" className="debug nopadding">
                            <span style={{ whiteSpace: "nowrap" }}>{chip.Name}</span>
                        </MDBCol>
                        <MDBCol size="2" className="debug nopadding">
                            {chip.Skill}
                        </MDBCol>

                        <MDBCol size="1" className="debug nopadding">
                            {chip.Damage}
                        </MDBCol>
                        <MDBCol size="1" className="debug centercontent nopadding">
                            {chip.Range}
                        </MDBCol>
                        <MDBCol size="1" className="debug nopadding centercontent">
                            <span style={{ whiteSpace: "nowrap" }}>{chip.Hits}</span>
                        </MDBCol>
                        <MDBCol size="1" className="debug centerContent nopadding">
                            <ElementImage element={chip.Element} />
                        </MDBCol>
                        <MDBCol size="1" className="debug centerContent nopadding">
                            <input
                                name="chipUsed"
                                type="checkbox"
                                checked={folderChip.Used}
                                disabled
                            />
                        </MDBCol>
                    </MDBRow>
                </div>
                <span>{chip.Description}</span>
            </MDBTooltip>

        );
    }
}


export class GroupFolder extends React.Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.active;
    }

    render() {
        if (!this.props.playerName) throw new Error("no player name set");

        let folders = FolderWebSocket.getGroupFolders();
        if (!folders[this.props.playerName]) {
            return (
                <div />
            );
        }

        /** @type {FolderChipObj[]} */
        let folder = folders[this.props.playerName].Chips;
        let toRender = folder.map((_, index) => {
            return (
                <GroupFolderChip folderIndex={index} playerName={this.props.playerName} />
            );
        });

        let folderStatus = (this.props.active ? "Folder activefolder" : "Folder");
        return (
            <MDBContainer fluid>
                <MDBRow>
                    <MDBCol size="10" className="debug nopadding">
                        <MDBContainer className={folderStatus} id={`F${this.props.playerName}`} fluid>
                            <MDBRow center className="sticky-top" style={{ backgroundColor: "gray" }}>
                                <MDBCol size="1" className="debug Chip nopadding">

                                </MDBCol>
                                <MDBCol size="3" className="debug Chip nopadding">
                                    <span style={{ whiteSpace: "nowrap" }}>NAME</span>
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
                                    USED
                                </MDBCol>
                            </MDBRow>
                            {toRender}
                        </MDBContainer>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );

    }
}