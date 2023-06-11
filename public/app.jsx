//import React from "react";
//import ReactDOM from "react-dom"
//import io from "socket.io"
function makeId() {
    let text = "";
    const possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}


class Game extends React.Component {
    componentDidMount() {
        this.gameName = "nechto";
        const initArgs = CommonRoom.roomInit(this);
        window.gameApp = this;
        this.socket.on("state", state => {
            window.gameState = state;
            CommonRoom.processCommonRoom(state, this.state, {
                maxPlayers: "∞",
                largeImageKey: "nechto",
                details: "nechto/Мемоджинариум",
            }, this);
            this.setState({
                ...state,
                userId: this.userId,
            });
        });
        this.socket.on("message", text => {
            popup.alert({content: text});
        });
        this.socket.on("reload", () => {
            setTimeout(() => window.location.reload(), 3000);
        });
        window.socket.on("disconnect", (event) => {
            this.setState({
                inited: false,
                disconnected: true,
                disconnectReason: event.reason,
            });
        });
        this.socket.on("ping", (id) => {
            this.socket.emit("pong", id);
        });
        document.title = `nechto - ${initArgs.roomId}`;
        this.socket.emit("init", initArgs);
    }

    constructor() {
        super();
        this.state = {
            inited: false,
        };
    }

    render() {
        if (this.state.disconnected)
            return (<div
                className="kicked">Disconnected{this.state.disconnectReason ? ` (${this.state.disconnectReason})` : ""}</div>);
        else if (this.state.inited) {
            return (
                <div className="game">
                    <CommonRoom state={this.state} app={this} />
                </div>
            );
        } else return (<div />);
    }
}

ReactDOM.render(<Game />, document.getElementById('root'));
