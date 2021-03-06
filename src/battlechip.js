import React from 'react';
import { MDBRow, MDBCol, MDBTooltip } from 'mdbreact';
import { ElementImage } from "./ElementImage";
import { BattleChip } from "./ChipLibrary";
import "./Battlechip.css";
import "./App.css";



export class Packchip extends React.Component {

    render() {
        if (!this.props.chipName) {
            throw new Error("chipName not set");
        }

        let chip = BattleChip.getChip(this.props.chipName.toLocaleLowerCase());
        let type = "";

        if (chip.Owned <= chip.Used) {
            type = "UsedChip";
        } else {
            switch (chip.Type) {
                case "Standard":
                default:
                    type = "Chip";
                    break;
                case "Support":
                    type = "SupportChip";
                    break;
                case "Mega":
                    type = "Mega";
                    break;
                case "Giga":
                    type = "Giga";
                    break;
            }
        }
        /**
         * @type {function}
         */
        let action;
        if (this.props.action === "remove") {
            action = () => {
                chip.Owned--;
                this.props.msgCallback(`You now own ${chip.Owned} copies of ${chip.Name}`);
            };
        } else {
            action = () => {
                try {
                    chip.addToFolder();
                    this.props.msgCallback(`A copy of ${chip.Name} has been added to your folder`);
                } catch (err) {
                    alert(err.message);
                }
            };
        }
        return (
            <MDBTooltip domElement>
                <div className={type + " noselect chipHover"} onDoubleClick={action} id={chip.Name + "_D"}>
                    <MDBRow center>
                        <MDBCol size="3" className="debug nopadding">
                            <span style={{ whiteSpace: "nowrap" }}>{chip.Name}</span>
                        </MDBCol>
                        <MDBCol size="2" className="debug nopadding">
                            {chip.Skill}
                        </MDBCol>

                        <MDBCol size="1" className="debug nopadding">
                            {chip.Damage}
                        </MDBCol>
                        <MDBCol size="1" className="debug nopadding">
                            {chip.Range}
                        </MDBCol>
                        <MDBCol size="1" className="debug nopadding">
                            <span style={{ whiteSpace: "nowrap" }}>{chip.Hits}</span>
                        </MDBCol>
                        <MDBCol size="1" className="debug nopadding centercontent">
                            <ElementImage element={chip.Element} />
                        </MDBCol>
                        <MDBCol size="1" className="debug nopadding">
                            {chip.Owned}
                        </MDBCol>
                        <MDBCol size="1" className="debug nopadding">
                            {chip.Used}
                        </MDBCol>
                    </MDBRow>
                </div>
                <span>{chip.Description}</span>
            </MDBTooltip>
        );
    }
}



export class LibraryChip extends React.Component {


    shouldComponentUpdate(nextProps) {
        if (this.props.chipName !== nextProps.chipName) {
            return true;
        }
        return false;
    }


    onChipDoubleClick = () => {
        let chip = BattleChip.getChip(this.props.chipName);
        chip.Owned++;
        this.props.msgCallback(`You now own ${chip.Owned} copies of ${chip.Name}`);
    }

    render() {
        if (!this.props.chipName) {
            throw new Error("missing chipName");
        }

        let chip = BattleChip.getChip(this.props.chipName.toLocaleLowerCase());
        let type = "";
        switch (chip.Type) {
            case "Standard":
            default:
                type = "Chip";
                break;
            case "Support":
                type = "SupportChip";
                break;
            case "Mega":
                type = "Mega";
                break;
            case "Giga":
                type = "Giga";
                break;
        }
        return (
            <MDBTooltip domElement>
                <div onDoubleClick={this.onChipDoubleClick} className={type + " noselect chipHover"} id={chip.Name + "_L"}>
                    <MDBRow center>
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
                    </MDBRow>
                </div>
                <span>{chip.Description}</span>
            </MDBTooltip>
        );
    }
}


/*
Battlechip.PropTypes = {
    chipName: PropTypes.string,
}
*/


//style={{backgroundColor: "#00637b", textAlign: "Left", paddingLeft: "0px", paddingRight: "1px", fontFamily: "Lucida Console", fontWeight:"bold", fontSize: "16px", color: "white", marginBottom: "0px", textShadow:"1px 1px grey"}}