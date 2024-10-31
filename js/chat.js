class AIChat {
    constructor() {
        this.chatOutput = document.getElementById('chat-output');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-btn');
        this.isProcessing = false;
        this.apiKey = 'sk-Y8SQmr5PggA8BgIjKBet7rdNOknLfLoSwCSkP8w56Yi0Ef79';
        this.conversationHistory = [];
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    async sendMessage() {
        if (this.isProcessing) return;
        
        const message = this.chatInput.value.trim();
        if (!message) return;

        // 添加用户消息
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        
        try {
            this.isProcessing = true;
            this.sendButton.disabled = true;
            
            // 使用代理服务器
            const response = await fetch('https://api.chatanywhere.cn/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "你是钟格英专属的AI助手。你需要以专业、友好的方式回答问题。你的回答要简洁明了，富有同理心。"
                        },
                        ...this.conversationHistory,
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'AI服务响应错误');
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // 更新对话历史
            this.conversationHistory.push(
                { role: "user", content: message },
                { role: "assistant", content: aiResponse }
            );
            
            // 保持对话历史在合理范围内
            if (this.conversationHistory.length > 10) {
                this.conversationHistory = this.conversationHistory.slice(-10);
            }
            
            // 添加AI响应
            this.addMessage(aiResponse, 'ai');
        } catch (error) {
            console.error('AI响应错误:', error);
            this.addMessage(`抱歉，发生了一个错误：${error.message}`, 'ai');
        } finally {
            this.isProcessing = false;
            this.sendButton.disabled = false;
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (sender === 'ai') {
            // 处理代码块和换行
            const formattedText = text
                .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                .replace(/\n/g, '<br>');
            messageDiv.innerHTML = formattedText;
        } else {
            messageDiv.textContent = text;
        }
        
        this.chatOutput.appendChild(messageDiv);
        this.chatOutput.scrollTop = this.chatOutput.scrollHeight;
    }
}

// 初始化聊天功能
document.addEventListener('DOMContentLoaded', () => {
    window.aiChat = new AIChat();
}); 