/************** 数据初始化 **************/
let friends = [
  { id: 1, name: "AI助手", avatar: "👩💻", unread: 2 }
];

let posts = [
  {
    id: 1,
    friendId: 1,
    content: "这是我的第一条朋友圈",
    images: ["https://placekitten.com/200/200"],
    likes: 5,
    liked: false,
    comments: [
      { id: 1, friendId: 1, text: "自拍不错" }
    ]
  }
];

let emojis = [
  { symbol: "😀", desc: "开心" },
  { symbol: "👍", desc: "点赞" }
];

/************** 核心功能 **************/
// 渲染主界面
function renderHome() {
  document.getElementById('app').innerHTML = `
    <div style="position:relative">
      <button onclick="renderApiSettings()" 
        style="position:absolute;top:10px;right:10px;background:none;border:none;font-size:20px">
        ⚙️
      </button>
      <button onclick="renderAddFriend()" 
        style="position:absolute;top:10px;left:10px;background:none;border:none;font-size:20px">
        👥
        ${friends.some(f=>f.unread>0) ? '<span class="unread-badge">!</span>' : ''}
      </button>

      <div style="padding:60px 10px 10px">
        <button onclick="renderChat(1)" class="wechat-green" 
          style="width:100%;margin-bottom:15px;font-size:18px">
          💬 开始聊天
        </button>
        <button onclick="renderMoments()" class="wechat-green" 
          style="width:100%;font-size:18px">
          📸 朋友圈
        </button>
      </div>
    </div>
  `;
}

// 渲染聊天界面
function renderChat(friendId) {
  const friend = friends.find(f => f.id === friendId);
  friend.unread = 0;
  
  document.getElementById('app').innerHTML = `
    <div class="chat-header wechat-green" style="padding:10px;display:flex;justify-content:space-between">
      <button onclick="renderHome()" style="background:none;border:none;color:white">←</button>
      <h3 style="margin:0">${friend.name}</h3>
      <button onclick="renderFriendSettings(${friendId})" style="background:none;border:none;color:white">⚙️</button>
    </div>
    
    <div id="messages" style="height:calc(100vh - 120px);overflow-y:auto;padding:10px"></div>
    
    <div style="position:fixed;bottom:0;width:100%;background:#f5f5f5;padding:8px;display:flex">
      <button onclick="toggleEmojiPanel()" style="font-size:20px;background:none;border:none">➕</button>
      <input id="chat-input" type="text" style="flex:1;padding:8px;border-radius:4px;border:1px solid #ddd">
      <button onclick="sendMessage(${friendId})" class="wechat-green" style="margin-left:5px">发送</button>
    </div>
    
    <div id="emoji-panel" class="emoji-panel">
      <div style="display:flex;flex-wrap:wrap;margin-bottom:10px">
        ${getAllEmojis().map(e => `
          <span onclick="insertEmoji('${e.symbol}')" 
            style="font-size:24px;margin:5px;cursor:pointer" 
            title="${e.desc}">${e.symbol}</span>
        `).join('')}
      </div>
      <input type="file" id="emoji-upload" accept="image/*" multiple style="display:none">
      <button onclick="document.getElementById('emoji-upload').click()" class="wechat-green" style="width:100%">
        上传表情包
      </button>
      <textarea id="emoji-desc" placeholder="表情描述" style="width:100%;margin-top:5px;padding:5px"></textarea>
    </div>
  `;

  document.getElementById('emoji-upload').onchange = uploadEmoji;
  loadMessages(friendId);
}

// 发送消息
function sendMessage(friendId) {
  const input = document.getElementById('chat-input');
  const content = input.value.trim();
  if (!content) return;
  
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML += `
    <div class="message user">${content}</div>
  `;
  input.value = '';
  
  setTimeout(() => {
    messagesDiv.innerHTML += `
      <div class="message ai">收到: ${content}</div>
    `;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    checkNotifications();
  }, 1000);
}

/************** 朋友圈功能 **************/
function renderMoments() {
  document.getElementById('app').innerHTML = `
    <div class="chat-header wechat-green" style="padding:10px">
      <button onclick="renderHome()" style="background:none;border:none;color:white">←</button>
      <h3 style="margin:0;text-align:center">朋友圈</h3>
    </div>
    
    <div style="padding:10px">
      <button onclick="renderNewPost()" class="wechat-green" style="width:100%">
        ＋ 发布动态
      </button>
      
      ${posts.map(post => {
        const friend = friends.find(f => f.id === post.friendId);
        return `
          <div class="post">
            <div style="display:flex;align-items:center">
              <span style="font-size:24px">${friend.avatar}</span>
              <strong style="margin-left:8px">${friend.name}</strong>
            </div>
            <p>${post.content}</p>
            ${post.images?.length ? `
              <div class="post-images">
                ${post.images.map(img => `<img src="${img}">`).join('')}
              </div>
            ` : ''}
            <div style="margin-top:8px;color:#888">
              <span>❤️ ${post.likes}赞</span>
              <button onclick="toggle
