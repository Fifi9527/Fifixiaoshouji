/************** 数据存储 **************/
const Data = {
  friends: [
    { id: 1, name: "AI助手", avatar: "👩💻", unread: 3 },
    { id: 2, name: "小臭狗", avatar: "🐶", unread: 0 }
  ],
  moments: [
    {
      id: 1,
      friendId: 2,
      content: "今天拆家了新沙发，超有成就感！",
      images: [
        "https://place-puppy.com/300x300",
        "https://place-puppy.com/300x301"
      ],
      likes: 24,
      comments: [
        { id: 1, friendId: 1, text: "建议购买磨牙玩具" }
      ],
      timestamp: Date.now() - 3600000
    }
  ],
  settings: {
    currentUser: { id: 0, name: "我", avatar: "👤" }
  }
};

/************** DOM元素缓存 **************/
const Dom = {
  app: document.getElementById('app'),
  // 会在init中初始化的元素
  chatInput: null,
  messageArea: null
};

/************** 核心功能 **************/
function renderHome() {
  Dom.app.innerHTML = `
    <div style="flex:1;overflow-y:auto;">
      <!-- 消息列表 -->
      ${Data.friends.map(friend => `
        <div onclick="renderChat(${friend.id})" 
          style="padding:12px;display:flex;align-items:center;border-bottom:1px solid #eee;background:white;">
          <span style="font-size:32px;margin-right:12px;">${friend.avatar}</span>
          <div style="flex:1;">
            <h3 style="margin:0;">${friend.name}</h3>
            <p style="margin:0;color:#888;font-size:14px;">最后消息...</p>
          </div>
          ${friend.unread > 0 ? `
            <span class="unread-badge">${friend.unread}</span>
          ` : ''}
        </div>
      `).join('')}
    </div>
    
    <!-- 底部导航 -->
    <div class="tab-bar">
      <button class="tab-btn active">💬</button>
      <button class="tab-btn" onclick="renderMoments()">🔄</button>
      <button class="tab-btn">🔍</button>
      <button class="tab-btn">👤</button>
    </div>
  `;
}

function renderChat(friendId) {
  const friend = Data.friends.find(f => f.id === friendId);
  friend.unread = 0;
  
  Dom.app.innerHTML = `
    <div style="display:flex;flex-direction:column;height:100%;">
      <!-- 聊天头部 -->
      <div style="padding:12px;background:#07C160;color:white;display:flex;align-items:center;">
        <button onclick="renderHome()" style="background:none;border:none;color:white;font-size:20px;">←</button>
        <h2 style="margin:0 auto;font-size:18px;">${friend.name}</h2>
      </div>
      
      <!-- 消息区域 -->
      <div id="message-area" style="flex:1;overflow-y:auto;padding:10px;background:#f5f5f5;">
        <div class="message ai">你好！我是${friend.name}，有什么可以帮您？</div>
      </div>
      
      <!-- 输入区域 -->
      <div style="padding:10px;background:#f9f9f9;display:flex;align-items:center;">
        <button id="emoji-btn" style="font-size:24px;background:none;border:none;padding:0 10px;">➕</button>
        <input id="chat-input" type="text" placeholder="输入消息..." 
          style="flex:1;padding:10px 15px;border-radius:20px;border:1px solid #ddd;font-size:16px;">
        <button onclick="sendMessage(${friendId})" 
          style="background:#07C160;color:white;border:none;border-radius:50%;width:40px;height:40px;margin-left:8px;">↑</button>
      </div>
    </div>
  `;
  
  // 缓存DOM元素
  Dom.messageArea = document.getElementById('message-area');
  Dom.chatInput = document.getElementById('chat-input');
  
  // 聚焦输入框
  Dom.chatInput.focus();
}

function renderMoments() {
  Dom.app.innerHTML = `
    <div style="display:flex;flex-direction:column;height:100%;">
      <!-- 朋友圈头部 -->
      <div style="padding:12px;background:#07C160;color:white;text-align:center;">
        <h2>朋友圈</h2>
      </div>
      
      <!-- 动态列表 -->
      <div style="flex:1;overflow-y:auto;">
        ${Data.moments.map(moment => {
          const friend = Data.friends.find(f => f.id === moment.friendId);
          return `
            <div class="moment-post">
              <div class="moment-header">
                <span class="moment-avatar">${friend.avatar}</span>
                <strong>${friend.name}</strong>
              </div>
              <p style="margin-bottom:10px;">${moment.content}</p>
              
              ${moment.images.length > 0 ? `
                <div class="moment-images">
                  ${moment.images.map(img => `<img src="${img}" loading="lazy">`).join('')}
                </div>
              ` : ''}
              
              <div style="margin-top:10px;color:#888;font-size:14px;">
                <span>❤️ ${moment.likes}个赞</span>
                <button onclick="likeMoment(${moment.id})" 
                  style="margin-left:15px;background:none;border:none;color:#07C160;">
                  点赞
                </button>
              </div>
              
              ${moment.comments.length > 0 ? `
                <div style="margin-top:10px;padding-top:10px;border-top:1px solid #eee;">
                  ${moment.comments.map(comment => {
                    const commenter = Data.friends.find(f => f.id === comment.friendId) || Data.settings.currentUser;
                    return `
                      <p style="margin-botto
