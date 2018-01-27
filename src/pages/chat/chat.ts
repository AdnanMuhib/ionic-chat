import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events, Content, TextInput } from 'ionic-angular';
import { ChatService, ChatMessage, UserInfo } from "../../providers/chat-service/chat-service"

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content:Content;
  @ViewChild('chat_input') messageInput: TextInput;
  msgList: ChatMessage[] = [];
  user: UserInfo;
  toUser:UserInfo;
  editorMsg = '';
  showEmojiPicker = false;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
    private chatService:ChatService,
  private events:Events,) {
    // this will get the user name and id of 
    // toUser from list on previous page
    this.toUser = {
      id:  navParams.get('toUserId'),
      name: navParams.get('toUserName')
    };
    // get the current mock user infor
    // or it will be replaced with from user information
    this.chatService.getUserInfo().then((res)=> {
        this.user = res;
    });
  }
  ionViewWillLeave() {
    // unsubscribe
    this.events.unsubscribe('chat:received');
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad Chat');
  }
  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
}
  ionViewDidEnter() {
    //get message list
    this.getMsg();

    // Subscribe to received  new message events
    this.events.subscribe('chat:received', msg => {
        this.pushNewMsg(msg);
    })
}
switchEmojiPicker() {
  this.showEmojiPicker = !this.showEmojiPicker;
  if (!this.showEmojiPicker) {
      this.messageInput.setFocus();
  }
  this.content.resize();
  this.scrollToBottom();
}

/**
 * @name getMsg
 * @returns {Promise<ChatMessage[]>}
 */

 private getMsg(){
  // get the list of mock message
  return this.chatService.getMsgList().subscribe(res=>{
    this.msgList = res;this.scrollToBottom();
  })
}
/**
 * @name sendMsg
 */
    sendMsg() {
      if (!this.editorMsg.trim()) return;

      // Mock message
      const id = Date.now().toString();
      let newMsg: ChatMessage = {
          messageId: Date.now().toString(),
          userId: this.user.id,
          userName: this.user.name,
          userAvatar: this.user.avatar,
          toUserId: this.toUser.id,
          time: Date.now(),
          message: this.editorMsg,
          status: 'pending'
      };

      this.pushNewMsg(newMsg);
        this.editorMsg = "";
      if (!this.showEmojiPicker) {
        this.messageInput.setFocus();
      }
      this.chatService.sendMsg(newMsg)
        .then(() => {
            let index = this.getMsgIndexById(id);
            if (index !== -1) {
                this.msgList[index].status = 'success';
            }
        })
      }
/**
 * @name pushNewMsg
 * @param msg
 */
pushNewMsg(msg:ChatMessage) {
  const userId = this.user.id,
  toUserId = this.toUser.id;
  // verify user relationship
  if (msg.userId === userId && msg.toUserId === toUserId) {
    this.msgList.push(msg);
  } else if(msg.toUserId === userId && msg.userId === toUserId){
    this.msgList.push(msg);
  }
  this.scrollToBottom();
}

getMsgIndexById(id: string) {
  return this.msgList.findIndex(e => e.messageId === id)
}
scrollToBottom() {
  setTimeout(() => {
      if (this.content.scrollToBottom) {
          this.content.scrollToBottom();
      }
  }, 400)
}

}
