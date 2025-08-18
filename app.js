/************** 初始化数据 **************/
const friends = [
  { id: 1, name: "AI助手", avatar: "👩💻", unread: 0 }
];

const posts = [
  {
    id: 1,
    friendId: 1,
    content: "这是我的第一条朋友圈～",
    images: [
      "https://placekitten.com/200/200",
      "https://placekitten.com/201/201"
    ],
    likes: 5,
    comments: [
      { id: 1, friendId: 1, text: "自拍不错！" }
    ]
  }
];

/************** 核心功能 **************/
function renderHome() {
  document.getElementById('app').innerHTML = `
    <div style="height:100%;display:flex;flex-direction:column;">
      <div style="padding:15px;background:#07C160;color:white;">
        <h2 style="margin:0;text-align:center">小手机AI</h2>
      </div>
      
      <div style="flex:1;overflow-y:auto;">
        <div style="padding:15px;border-bottom:1px solid #f0f0f0;">
          <button onclick="renderChat(1)" class="wechat-green" 
            style="width:100%;padding:12px;font-size:16px;">
            💬 开始聊天
          </button>
        </div>
        
        <div style="padding:15px;">
          <button onclick="renderMoments()" class="wechat-green" 
            style="width:100%;padding:12px;font-size:16px;">
            📸 朋友圈
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderChat(friendId) {
  const friend = friends.find(f => f.id === friendId);
  
  document.getElementById('app').innerHTML = `
    <div style="height:100%;display:flex;flex-direction:column;">
      <!-- 顶部导航 -->
      <div style="padding:12px;background:#07C160;color:white;display:flex;align-items:center;">
        <button onclick="renderHome()" style="background:none;border:none;color:white;font-size:18px;">←</button>
        <h3 style="margin:0 auto;">${friend.name}</h3>
      </div>
      
      <!-- 消息区域 -->
      <div id="messages" style="flex:1;overflow-y:auto;padding:10px;">
        <div class="message ai">你好！我是AI助手，随时为你服务~</div>
      </div>
      
      <!-- 输入区域 -->
      <div style="padding:10px;background:#f9f9f9;display:flex;">
        <input id="chat-input" type="text" placeholder="输入消息..." 
          style="flex:1;padding:10px;border-radius:18px;border:1px solid #ddd;">
        <button onclick="sendMessage(${friendId})" 
          style="margin-left:8px;background:#07C160;color:white;border:none;border-radius:50%;width:40px;height:40px;">
          ↑
        </button>
      </div>
    </div>
  `;
}

function sendMessage(friendId) {
  const input = document.getElementById('chat-input');
  const content = input.value.trim();
  if (!content) return;
  
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML += `
    <div class="message user">${content}</div>
  `;
  input.value = '';
  
  // 模拟AI回复
  setTimeout(() => {
    messagesDiv.innerHTML += `
      <div class="message ai">收到：${content}</div>
    `;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }, 800);
}

function renderMoments() {
  document.getElementById('app').innerHTML = `
    <div style="height:100%;">
      <!-- 顶部导航 -->
      <div style="padding:12px;background:#07C160;color:white;">
        <button onclick="renderHome()" style="background:none;border:none;color:white;font-size:18px;">←</button>
        <h3 style="margin:0;text-align:center;">朋友圈</h3>
      </div>
      
      <!-- 动态列表 -->
      <div style="height:calc(100% - 50px);overflow-y:auto;">
        ${posts.map(post => {
          const friend = friends.find(f => f.id === post.friendId);
          return `
            <div class="post">
              <div class="post-header">
                <span class="post-avatar">${friend.avatar}</span>
                <strong>${friend.name}</strong>
              </div>
              <p>${post.content}</p>
              <div class="post-images">
                ${post.images.map(img => `<img src="${img}">`).join('')}
              </div>
              <div style="color:#888;margin-top:8px;">
                <span>❤️ ${post.likes}个赞</span>
                <button onclick="addLike(${post.id})" style="margin-left:15px;background:none;border:none;color:#07C160;">
                  点赞
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/************** 初始化 **************/
document.addEventListener('DOMContentLoaded', renderHome);
