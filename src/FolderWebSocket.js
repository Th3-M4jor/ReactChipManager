import io from 'socket.io-client';
import { BattleChip } from './ChipLibrary';
const serverURL = "wss://spartan364.hopto.org";



export class FolderWebSocket {


    /**
     * @callback OnFolderUpdate called when the folders update
     * @argument {Object} folders all the players folders
     * @returns {void}
     */
    /** @private */static _FoldersUpdatedCallback = (obj) => {};

    /** @private
     *  @type {SocketIOClient.Socket} */
    static _socket = null;
    /** @private */static _groupName = "";
    /** @private */static _playerName = "";
    /** @private */static _groupFolders = {}; // {"PlayerName": {"Chips": [{"Name":"AirHoc", "Used": false}]}}
    

    /**
     * 
     * @param {string} groupName 
     * @param {string} playerName 
     */
    static connect(groupName, playerName) {
        if(FolderWebSocket._socket !== null) throw new Error("already in a group");
        if(groupName === "") throw new Error("cannot have an empty group name");
        if(playerName === "") throw new Error("cannot have an empty player name");
        if(playerName.length > 30) throw new Error("Cannot have a player name longer than 30 characters");
        if(groupName.length > 30) throw new Error("Cannot have a group name longer than 30 characters");
        FolderWebSocket._groupName = groupName;
        FolderWebSocket._playerName = playerName;
        FolderWebSocket._socket = io(serverURL ,{transports: ['websocket', 'polling']});
        FolderWebSocket._socket.on("error", (err) => {
            if(err) {
              console.log(err);
              alert(`A websocket error occurred:\n${err}`);
            } else {
              console.log("unknown websocket err occurred");
              alert("An unknown websocket error occurred");
            }
            FolderWebSocket.disconnect();
          });
          
          FolderWebSocket._socket.on('joined', () => {
            let playerFolder = JSON.stringify({ Chips: BattleChip.getFolder(), Name: playerName});
            FolderWebSocket._socket.on('folder', (data) => {
              FolderWebSocket._groupFolders = JSON.parse(data);
              FolderWebSocket._FoldersUpdatedCallback(FolderWebSocket._groupFolders);
            });
            FolderWebSocket._socket.emit(groupName, playerFolder);
      
          });
          let joinData = JSON.stringify({groupName: groupName, playerName: playerName});
          FolderWebSocket._socket.emit("join", joinData);
    }

    /**
     * Disconnect from a folder group, quietly does nothing if not connected
     */
    static disconnect() {
        if(FolderWebSocket._socket === null) return;
        FolderWebSocket._socket.close();
        FolderWebSocket._socket = null;
        FolderWebSocket._groupName = "";
        FolderWebSocket._playerName = "";
        FolderWebSocket._groupFolders = {};
        FolderWebSocket._FoldersUpdatedCallback({});
    }


    static folderUpdated() {
        if(FolderWebSocket._socket === null) return;
        let playerFolder = JSON.stringify({ Chips: BattleChip.getFolder(), Name: FolderWebSocket._playerName});
        FolderWebSocket._socket.emit(FolderWebSocket._groupName,playerFolder);
    }

    static getPlayerName() {
        return FolderWebSocket._playerName;
    }

    /**
     * @returns {object} {"PlayerName": {"Chips": [{"Name":"AirHoc", "Used": false}]}}
     */
    static getGroupFolders() {
        return FolderWebSocket._groupFolders;
    }

    /**
     * Are you currently part of a folder group?
     * 
     * @returns {boolean} true if you are currently part of a folder group 
     */
    static inFolderGroup() {
        return FolderWebSocket._socket !== null && FolderWebSocket._socket.connected;
    }

    /**
     * Get the number of people in the group
     * 
     * @returns {number} will be 0 if you are not in a group
     */
    static groupLength() {
        return Object.keys(FolderWebSocket._groupFolders).length;
    }

     /**
      * set the folder update callback
      * 
      * @param {OnFolderUpdate} updateCallback 
      */
    static setUpdateCallback(updateCallback) {
        FolderWebSocket._FoldersUpdatedCallback = updateCallback;
    }

}