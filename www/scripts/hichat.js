// 如何保持和服务器的长连接， 获取所有用户的聊天
// 而不是HTTP 这种协议断开式链接
// 实时的响应式用户界面 Tcp/Ip websocket(socket.io 实时的库-> 广播电台的作用)


window.onload = function() {
    var hichat = new HiChat()
    hichat.init()
}

let HiChat = function() {
    this.socket = null
}
HiChat.prototype = {
    init: function() {
        var that = this
        // 前端的socket 联接就此形成
        this.socket = io.connect();
        this.socket.on('connect', function() {
            document.getElementById('info')
                .textContent = "get yourself a nickname"
            document.getElementById('nickWrapper')
                .style.display = 'block'
            document.getElementById('nicknameInput')
                .focus()
        })
        this.socket.on('loginSuccess', function() {
            document.title = 'hichat | '
             + document.getElementById('nicknameInput').value
            document.getElementById('loginWrapper')
                .style.display = 'none'
            document.getElementById('messageInput').focus()
        })
        this.socket.on('system', function(nickname, userCount, type) {
            var msg = nickname + (type === 'login'? 'joined': 'left');
            that._displayNewMsg('system', msg, 'red');
            document.getElementById('status').textContent = userCount + (userCount>1 ? 'users': 'user') + 'online'
        })
        document.getElementById('loginBtn')
            .addEventListener('click', function() {
                var nickName =
                    document.getElementById('nicknameInput').value
                if (!nickName) {
                    document.getElementById('nicknameInput').focus()
                } else {
                    // emit 向服务器端发出一个请求
                    that.socket.emit('login', nickName)
                } 
            })
    },
    _displayNewMsg: function(user, msg , color) {
        var container = document.getElementById('historyMsg'),
        msgToDisplay = document.createElement('p'),
        date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000'
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' +msg
        container.appendChild(msgToDisplay)
    }
}
