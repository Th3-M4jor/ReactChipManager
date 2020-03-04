import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MDBContainer, MDBNav, MDBNavItem, MDBNavLink, MDBTabContent, MDBTabPane, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdbreact';
import './App.css';
import './Battlechip.css';
import { Library, Pack } from './Library';
import { BattleChip } from './ChipLibrary';
import { Folder } from './Folder';





class App extends React.Component {
  state = {
    chipsLoaded: false,
    activeTab: "Library",
    updateText: "",
    modalText: "",
    modalOpen: false,
    modalCallback: () => { },
  }

  modificationTimeout = null;


  componentDidMount() {
    BattleChip.loadChips().then(() => {
      this.setState({
        chipsLoaded: true,
      });
    });
  }

  toggle = tab => e => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }


  /**
   * 
   * @callback modalOkCallback 
   */


  /**
   * @param {string} msg the message to have in the modal
   * @param {modalOkCallback} callback called if OK is clicked
   */
  openModal(msg, callback) {
    this.setState({ modalText: msg, modalOpen: true, modalCallback: callback });
  }

  closeModal() {
    this.setState({ modalOpen: false, modalText: "", modalCallback: () => { } });
  }

  /**
   * Callback function for some actions to set a message
   * @param {string} msg 
   */
  setMessage(msg) {
    clearTimeout(this.modificationTimeout);
    this.setState({
      updateText: msg,
    });
    this.modificationTimeout = setTimeout(() => {
      this.setState({
        updateText: "",
      });
    }, 15000);
  }



  render() {

    if (!this.state.chipsLoaded) {
      return null;
    }



    return (
      <MDBContainer style={{ backgroundColor: "#00637b", padding: "5px", maxWidth: "720px" }} fluid>
        <div style={{ backgroundColor: "#ffbd18", fontFamily: "Lucida Console", margin: "5px", color: "#FFFFFF", fontWeight: "bold" }}>
          <span style={{paddingLeft: "5px"}}>{this.state.activeTab}</span> <span style={{ float: "right", color: "red" }}>{this.state.updateText}</span>
        </div>
        <Router>
          <div style={{ backgroundColor: "#4abdb5", padding: "10px" }}>
          <div style={{paddingLeft: "15px", transform: "translate(0px,5px)"}}>
            <MDBNav tabs header>
              <MDBNavItem active={this.state.activeTab === "Folder"} className={(this.state.activeTab === "Folder" ? "activeTab" : "inactiveTab") + " nav-tabs"}>
                <MDBNavLink to="#" active={this.state.activeTab === "Folder"} onClick={this.toggle("Folder")} role="tab" className={this.state.activeTab === "Folder" ? "activeTab" : "inactiveTab"}>
                  Folder
            </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem active={this.state.activeTab === "Pack"} className={(this.state.activeTab === "Pack" ? "activeTab" : "inactiveTab") + " nav-tabs"}>
                <MDBNavLink to="#" active={this.state.activeTab === "Pack"} onClick={this.toggle("Pack")} role="tab" className={this.state.activeTab === "Pack" ? "activeTab" : "inactiveTab"}>
                  Pack
            </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem active={this.state.activeTab === "Library"} className={(this.state.activeTab === "Library" ? "activeTab" : "inactiveTab") + " nav-tabs"}>
                <MDBNavLink to="#" active={this.state.activeTab === "Library"} onClick={this.toggle("Library")} role="tab" className={this.state.activeTab === "Library" ? "activeTab" : "inactiveTab"}>
                  Library
            </MDBNavLink>
              </MDBNavItem>
            </MDBNav>
            </div>
            <MDBTabContent activeItem={this.state.activeTab}>
              <MDBTabPane tabId="Folder" role="tabpanel">
                <Folder active={this.state.activeTab === "Folder"} msgCallback={(msg) => { this.setMessage(msg) }} modalOpen={(msg, callback) => { this.openModal(msg, callback) }} />
              </MDBTabPane>
              <MDBTabPane tabId="Pack" role="tabpanel">
                <Pack contents={this.state.pack} active={this.state.activeTab === "Pack"} msgCallback={(msg) => this.setMessage(msg)} modalOpen={(msg, callback) => { this.openModal(msg, callback) }} />
              </MDBTabPane>
              <MDBTabPane tabId="Library" role="tabpanel">
                <Library msgCallback={(msg) => this.setMessage(msg)} active={this.state.activeTab === "Library"} modalOpen={(msg, callback) => { this.openModal(msg, callback) }} />
              </MDBTabPane>
            </MDBTabContent>
          </div>
        </Router>
        <MDBModal centered isOpen={this.state.modalOpen} toggle={() => { this.closeModal() }}>
          <MDBModalHeader>Confirm Action</MDBModalHeader>
          <MDBModalBody>
            {this.state.modalText}
          </MDBModalBody>
          <MDBModalFooter>
            <button onClick={() => { this.closeModal() }}>Cancel</button>
            <button onClick={() => { this.state.modalCallback(); this.closeModal() }}>Confirm</button>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
  }
}

export default App;
