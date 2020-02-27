import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MDBContainer, MDBNav, MDBNavItem, MDBNavLink, MDBTabContent, MDBTabPane, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader} from 'mdbreact';
import './App.css';
import './Battlechip.css';
import { Library, Pack } from './Library';
import { BattleChip } from './ChipLibrary';
import { Folder } from './Folder';


class App extends React.Component {
  state = {
    chipsLoaded: false,
    activeTab: "Pack",
    updateText: "",
    modalText: "",
    modalOpen: false,
    modalCallback: () => {},
  }

  modificationTimeout = null;

  componentDidMount() {
    BattleChip.loadChips().then(() => {
      this.setState({
        chipsLoaded: true,
        activeTab: "Library",
        updateText: "",
      })
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
    this.setState({modalText: msg, modalOpen: true, modalCallback: callback});
  }

  closeModal() {
    this.setState({modalOpen: false, modalText: "", modalCallback: () => {}});
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
      <MDBContainer style={{ backgroundColor: "#00637b", padding: "5px", maxWidth:"720px"}} float>
        <div style={{ backgroundColor: "#ffbd18", fontFamily: "Lucida Console", margin: "5px", color: "#FFFFFF", fontWeight: "bold" }}>
          {this.state.activeTab} <span style={{ float: "right", color: "red" }}>{this.state.updateText}</span>
        </div>
        <Router>
            <div style={{ backgroundColor: "#4abdb5", padding: "10px"}}>
              <MDBNav className="nav-tabs" tabs header>
                <MDBNavItem active={this.state.activeTab === "Folder"} className={this.state.activeTab === "Folder" ? "activeTab" : "inactiveTab"} tag="div">
                  <MDBNavLink to="#" active={this.state.activeTab === "Folder"} onClick={this.toggle("Folder")} role="tab" className={this.state.activeTab === "Folder" ? "activeTab" : "inactiveTab"} tag="div">
                    Folder
            </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem active={this.state.activeTab === "Pack"} className={this.state.activeTab === "Pack" ? "activeTab" : "inactiveTab"} tag="div">
                  <MDBNavLink to="#" active={this.state.activeTab === "Pack"} onClick={this.toggle("Pack")} role="tab" className={this.state.activeTab === "Pack" ? "activeTab" : "inactiveTab"}>
                    Pack
            </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem active={this.state.activeTab === "Library"} className={this.state.activeTab === "Library" ? "activeTab" : "inactiveTab"} tag="div">
                  <MDBNavLink to="#" active={this.state.activeTab === "Library"} onClick={this.toggle("Library")} role="tab" className={this.state.activeTab === "Library" ? "activeTab" : "inactiveTab"}>
                    Library
            </MDBNavLink>
                </MDBNavItem>
              </MDBNav>
              <MDBTabContent activeItem={this.state.activeTab}>
                <MDBTabPane tabId="Folder" role="tabpanel">
                  
                    
                    <Folder active={this.state.activeTab === "Folder"} msgCallback={(msg) => {this.setMessage(msg)}} modalOpen={(msg, callback) => {this.openModal(msg, callback)}}/>
                    
                  
                </MDBTabPane>
                <MDBTabPane tabId="Pack" role="tabpanel">
                  

                    <Pack contents={this.state.pack} active={this.state.activeTab === "Pack"} msgCallback={(msg) => this.setMessage(msg)} modalOpen={(msg, callback) => {this.openModal(msg, callback)}}/>

                 
                </MDBTabPane>
                <MDBTabPane tabId="Library" role="tabpanel">
                  
                    <Library msgCallback={(msg) => this.setMessage(msg)} active={this.state.activeTab === "Library"} modalOpen={(msg, callback) => {this.openModal(msg, callback)}}/>
                  
                </MDBTabPane>
              </MDBTabContent>
            </div>
          
        </Router>
        <MDBModal centered isOpen={this.state.modalOpen} toggle={() => {this.closeModal()}}>
          <MDBModalHeader>Confirm Action</MDBModalHeader>
          <MDBModalBody>
            {this.state.modalText}
          </MDBModalBody>
          <MDBModalFooter>
            <button onClick={() => {this.closeModal()}}>Cancel</button>
            <button onClick={()=>{this.state.modalCallback(); this.closeModal()}}>Confirm</button>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
  }
}

/*
 
 <div style={{ backgroundColor: "#4abdb5", textAlign: "right", padding: "10px" }}>
            Pack
        <div style={{
              borderRadius: "8px", backgroundColor: "#00637b", textAlign: "left", paddingLeft: "3px", paddingRight: "1px",
              fontFamily: "Lucida Console", fontWeight: "bold", fontSize: "16px", color: "white", overflowY: "scroll", maxHeight: "500px", minHeight: "200px"
            }}>


              <Battlechip chipName="FireSword" />
            </div>
          </div>

 */
export default App;
