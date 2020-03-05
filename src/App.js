import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MDBContainer, MDBNav, MDBNavItem, MDBNavLink, MDBTabContent, MDBTabPane, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBInput } from 'mdbreact';
import './App.css';
import './Battlechip.css';
import { Library, Pack } from './Library';
import { BattleChip } from './ChipLibrary';
import { Folder } from './Folder';
import { GroupFolder } from './GroupFolder';
import { FolderWebSocket } from './FolderWebSocket';





class App extends React.Component {
  state = {
    chipsLoaded: false,
    activeTab: "Library",
    updateText: "",
    modalText: "",
    modalOpen: false,
    modalCallback: () => { },
    folderGroupModalOpen: false,
  }

  modificationTimeout = null;
  groupName = "";
  playerName = "";


  componentDidMount() {
    BattleChip.loadChips().then(() => {
      this.setState({
        chipsLoaded: true,
      });
    });
    FolderWebSocket.setUpdateCallback(this.FolderWebSocketUpdated.bind(this));
  }

  toggle = tab => e => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  FolderWebSocketUpdated() {
    this.forceUpdate();
  }

  /**
   * 
   * @callback modalOkCallback
   * @returns {void}
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

  closeGroupModal() {
    this.setState({ folderGroupModalOpen: false });
  }

  openGroupModal() {
    if (FolderWebSocket.inFolderGroup()) {
      throw new Error("already in a group");
    }
    this.setState({ folderGroupModalOpen: true });
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

  componentDidUpdate() {
    if (!FolderWebSocket.inFolderGroup() || FolderWebSocket.groupLength() <= 1) return;
    let badActiveTab = true;
    let folders = FolderWebSocket.getGroupFolders();
    for (const player in folders) {
      if (this.state.activeTab === "folder_" + player) {
        badActiveTab = false;
      }
    }
    if (badActiveTab) {
      this.setState({ ActiveTab: "Library" });
    }
  }

  render() {

    if (!this.state.chipsLoaded) {
      return null;
    }

    let navLinks = ([
      <MDBNavItem active={this.state.activeTab === "Folder"} className={(this.state.activeTab === "Folder" ? "activeTab" : "inactiveTab") + " nav-tabs"}>
        <MDBNavLink to="#" active={this.state.activeTab === "Folder"} onClick={this.toggle("Folder")} role="tab" className={this.state.activeTab === "Folder" ? "activeTab" : "inactiveTab"}>
          Folder
            </MDBNavLink>
      </MDBNavItem>,
      <MDBNavItem active={this.state.activeTab === "Pack"} className={(this.state.activeTab === "Pack" ? "activeTab" : "inactiveTab") + " nav-tabs"}>
        <MDBNavLink to="#" active={this.state.activeTab === "Pack"} onClick={this.toggle("Pack")} role="tab" className={this.state.activeTab === "Pack" ? "activeTab" : "inactiveTab"}>
          Pack
          </MDBNavLink>
      </MDBNavItem>,
      <MDBNavItem active={this.state.activeTab === "Library"} className={(this.state.activeTab === "Library" ? "activeTab" : "inactiveTab") + " nav-tabs"}>
        <MDBNavLink to="#" active={this.state.activeTab === "Library"} onClick={this.toggle("Library")} role="tab" className={this.state.activeTab === "Library" ? "activeTab" : "inactiveTab"}>
          Library
        </MDBNavLink>
      </MDBNavItem>
    ]);

    let tabItems = ([
      <MDBTabPane tabId="Folder" role="tabpanel">
        <Folder active={this.state.activeTab === "Folder"} msgCallback={(msg) => { this.setMessage(msg) }} modalOpen={(msg, callback) => { this.openModal(msg, callback) }} groupModalOpen={() => { this.openGroupModal() }} />
      </MDBTabPane>,
      <MDBTabPane tabId="Pack" role="tabpanel">
        <Pack contents={this.state.pack} active={this.state.activeTab === "Pack"} msgCallback={(msg) => this.setMessage(msg)} modalOpen={(msg, callback) => { this.openModal(msg, callback) }} />
      </MDBTabPane>,
      <MDBTabPane tabId="Library" role="tabpanel">
        <Library msgCallback={(msg) => this.setMessage(msg)} active={this.state.activeTab === "Library"} modalOpen={(msg, callback) => { this.openModal(msg, callback) }} />
      </MDBTabPane>
    ]);

    if (FolderWebSocket.groupLength() > 1) {

      let folders = FolderWebSocket.getGroupFolders();
      for (let player in folders) {
        if (player === FolderWebSocket.getPlayerName()) continue;
        navLinks.push((
          <MDBNavItem active={this.state.activeTab === "Folder_" + player} className={(this.state.activeTab === "Folder_" + player ? "activeTab" : "inactiveTab") + " nav-tabs"}>
            <MDBNavLink to="#" active={this.state.activeTab === "Folder_" + player} onClick={this.toggle("Folder_" + player)} role="tab" className={this.state.activeTab === "Folder_" + player ? "activeTab" : "inactiveTab"}>
              {player}
            </MDBNavLink>
          </MDBNavItem>
        ));

        tabItems.push((
          <GroupFolder active={this.state.activeTab === "Folder_" + player} playerName={player} />
        ));
      }
    }



    return (
      <MDBContainer style={{ backgroundColor: "#00637b", padding: "5px", maxWidth: "720px" }} fluid>
        <div style={{ backgroundColor: "#ffbd18", fontFamily: "Lucida Console", margin: "5px", color: "#FFFFFF", fontWeight: "bold" }}>
          <span style={{ paddingLeft: "5px" }}>{this.state.activeTab}</span> <span style={{ float: "right", color: "red" }}>{this.state.updateText}</span>
        </div>
        <Router>
          <div style={{ backgroundColor: "#4abdb5", padding: "10px" }}>
            <div style={{ paddingLeft: "15px", transform: "translate(0px,5px)" }}>
              <MDBNav tabs header>
                {navLinks}
              </MDBNav>
            </div>
            <MDBTabContent activeItem={this.state.activeTab}>
              {tabItems}
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
        <MDBModal centered isOpen={this.state.folderGroupModalOpen} toggle={() => { this.closeGroupModal() }}>
          <MDBModalHeader>Join a group</MDBModalHeader>
          <MDBModalBody>
            <MDBInput label="Group Name" type="text" id="setGroupName"/>
            <MDBInput label="Player Name" type="text" id="setPlayerName"/>
          </MDBModalBody>
          <MDBModalFooter>
            <button onClick={() => {
              this.closeGroupModal();
              try {
                this.groupName = document.getElementById("setGroupName").value;
                this.playerName = document.getElementById("setPlayerName").value;
                FolderWebSocket.connect(this.groupName, this.playerName);
              } catch (e) {
                alert(e.message);
              }
            }}>Join</button>
            <button onClick={() => { this.closeGroupModal(); }}>Cancel</button>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
  }
}

export default App;
