<template>
<div class='rise-help'>
    <div class="header">
      <div class="header-left">
        <img :src='Tagline' alt="" class="image" />
        <span class="line"></span>
        <span class="text">Rise Help</span>
      </div>
      <span @click='close' class="shut-down">
        X
      </span>
    </div>
    <div class="container">
        <div class="help-im">
            <div class="chat-list" id='chat-list'>
              <div id='list-container'>
                <div v-for='(item,index) in messageList' :key='index' :class="{'list':item.flow === 'in', 'list-teacher':item.flow === 'out'}">
                  <div v-if="item.flow === 'in'">
                    <span class="student-nick">{{item.fromNick}}</span>
                    <div class="student-message">
                      <img v-if='item.type === "image"' class="chat-img" :src='item.file.url' @click="resize"/>
                      <div v-if='item.type !== "image"' v-html='item.text'></div>
                    </div>
                    <span class="student-time">{{item.time}}</span>
                  </div>
                  <div class="list-item" v-if="item.flow === 'out'">
                    <span class="teacher-time">{{item.time}}</span> 
                    <div class="teacher-message">
                      <img v-if='item.type === "image"' class="chat-img" :src='item.file.url' @click="resize"/>
                      <div v-if='item.type !== "image"' v-html='item.text'></div>
                    </div>
                    <span class="teacher-nick">{{item.fromNick}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="im-bar">
              <div class="emoji">
                <img :src='EmojiP' alt="" class="emoji-img left" @click='displayEmoji'/>
                <span>
                  <img :src='Upload' alt="" class="emoji-img right" @click='uploadImg'/>
                  <input id="file" type="file" @change='onChange'/>
                </span>
              </div>
              <div class="edit">
                <textarea class="editText" id="editText" placeholder="Tap Something..." v-model="editText"></textarea>
              </div>
              <div class="send-btn" id="sentText" @click='sendText'>
                <img :src='SendImg' alt="" />
              </div>
              <div id="emojiTag"></div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
    import { emoji,emojiList, CEmojiEngine } from './emoji'
    import { WebSdk } from '../../../static/js/IM_SDK';
    import Tagline from '@/assets/images/help/help-header.png';
    import EmojiP from '@/assets/images/help/emoji.svg';
    import Upload from '@/assets/images/help/upload-image.svg';
    import SendImg from '@/assets/images/help/send.png';
    export default {
      props:['appKey', 'account', 'token'],
      data(){
        return {
            Tagline,
            EmojiP,
            Upload,
            SendImg,

            nim: null,
            editText: '',
            messageList:[],
            messageVal:'',
            emNode: null,
            imConf:{ 
              appKey: '22caff759c9d45498227fdc775133708', 
              account: 'release_3',
              token: '91722395c0e1a72bee18231df8cacbf0'
            },
        }
      },
      created() {
        this.initNim();
      },
      mounted() {
        this.initEmoji();
      },
      methods:{
        initNim() {
          this.nim = WebSdk.NIM.getInstance({
            ...this.imConf,
            onconnect: this.onConnect,
            onwillreconnect: this.onWillReconnect,
            ondisconnect: this.onDisconnect,
            onerror: this.handleError,
            onmsg: this.onmsg,
          });
        },
        onConnect() {
          console.log('connected');
        },
        onWillReconnect(obj) {
          console.log(obj.retryCount);
          console.log(obj.duration);
        },
        onDisconnect(error) {
          console.log(error);
        },
        handleError(error) {
          console.log(`IM连接错误 ${JSON.stringify(error)}`);
        },
        onmsg(msg) {
          console.log('收到消息', msg.scene, msg.type, msg);
          this.receiveMsg(msg)
        },
        close() {
          this.$emit('close');
        },
        receiveMsg(msg) {
          switch(msg.type){
            case 'text' :  this.buildChat([msg], 'msg')
            break;
            case 'image' : this.buildImg([msg]);
            break;
          }

        },

        // 表情
        initEmoji() {
          // const requireContext = require.context("@/assets/images/emoji/", true, /^\.\/.*\.png$/);
          // const images = requireContext.keys().map(requireContext);
          let emojiConfig = {
            'emojiList': emojiList,  //普通表情
            'width': 350,
            'height': 300,
            'imgpath': '../../../static/images/',
            callback: (result) => {
              this.cbShowEmoji(result);
            }
          }
          this.emNode = new CEmojiEngine(document.getElementById('emojiTag'), emojiConfig);
        },
        cbShowEmoji(data) {
          this.editText = this.editText + data.emoji;
        },
        displayEmoji() {
          
          this.emNode._$show();
        },

        // 上传图片
        uploadImg() {
          document.getElementById("file").click();
        },
        onChange(e) {
          this.nim.sendFile({
            scene: 'p2p',
            to: '2222',
            type: 'image',
            fileInput: e.target,
            beginupload: function (upload) {
              // - 如果开发者传入 fileInput, 在此回调之前不能修改 fileInput
              // - 在此回调之后可以取消图片上传, 此回调会接收一个参数 `upload`, 调用 `upload.abort();` 来取消文件上传
            },
            uploadprogress: function (obj) {
              console.log('文件总大小: ' + obj.total + 'bytes');
              console.log('已经上传的大小: ' + obj.loaded + 'bytes');
              console.log('上传进度: ' + obj.percentage);
              console.log('上传进度文本: ' + obj.percentageText);
            },
            uploaddone:  (error, file) => {
              console.log(error);
              console.log(file);
              console.log(this.nim);
              console.log('上传' + (!error ? '成功' : '失败'));
            },
            beforesend: function (msg) {
              console.log('正在发送p2p image消息, id=' + msg.idClient);
              // pushMsg(msg);
            },
            done: this.sendImgDone,
          });
        },
        sendImgDone(error , msg) {
          this.buildImg([msg]);
        },
        buildImg(data) {
          data.forEach(item => {
              item.time = this.dateFormat(new Date());
              this.messageList.push(item);
            })
            this.scrollToLeast();
        }, 
        resize(e) {
          let src = e.target.getAttribute('src');
          document.body.style.overflow = 'hidden';  //清除body内部部分的滚动条
          let divModule = document.createElement('div');  //设置图片下面的蒙层
          let imgModule = document.createElement('img');  //设置图片的存放容器
          imgModule.setAttribute('src',src);
          imgModule.style.marginTop = '20px';
          divModule.appendChild(imgModule);
          divModule.style.position = 'fixed';
          divModule.style.backgroundColor = 'rgba(68,68,68,0.79)';
          divModule.style.top = '0px';
          divModule.style.bottom = '0px';
          divModule.style.left = '0px';
          divModule.style.right = '0px';
          divModule.style.display = 'flex';
          divModule.style.alignItems = 'center';
          divModule.style.justifyContent = 'center';
          divModule.style.height = '100%';
          divModule.style.zIndex = 10025;
          divModule.style.overflowY = 'scroll';
          document.body.appendChild(divModule);
          divModule.onclick = function() {
            document.body.style.overflow = 'auto';
            document.body.removeChild(divModule);
          }
        },
        //  发送消息
        sendText() {
          let text = this.editText.trim();
          if (text.length === 0) return;
          this.nim.sendText({
            scene: 'p2p',
            to: '2222',
            text: text,
            done: (error, data) => {
              if (error) {
                return alert(error, 'error')
              }
              this.editText = '';
              this.buildChat([data], 'msg')
            }
          })
        },
        buildChat(data, typeinfo) {
          data.sort(function (a, b) {
            return a.time - b.time;
          });
          if (typeinfo === "msg") {
            data.forEach(item => {
              item.text = this.buildEmoji(this.escape()(item.text));
              item.time = this.dateFormat(new Date());
              this.messageList.push(item);
            })
          }
          this.scrollToLeast();
        },
        buildEmoji(text) {
          var re = /\[([^\]\[]*)\]/g;
          var matches = text.match(re) || [];
          for (var j = 0, len = matches.length; j < len; ++j) {
            if(emoji[matches[j]]){
              text = text.replace(matches[j], '<img class="emoji" src="/static/images/emoji/' + emoji[matches[j]].file + '"   />');
            }		
          }
          return text;
        },
        escape() {
          let _reg = /<br\/?>$/,
            _map = {
              r: /\<|\>|\&|\r|\n|\s|\'|\"/g,
              '<': '&lt;', '>': '&gt;', '&': '&amp;', ' ': '&nbsp;',
              '"': '&quot;', "'": '&#39;', '\n': '<br/>', '\r': ''
            };
          let _$encode = function (_map, _content) {
            _content = '' + _content;
            if (!_map || !_content) {
              return _content || '';
            }
            return _content.replace(_map.r, function ($1) {
              let _result = _map[!_map.i ? $1.toLowerCase() : $1];
              return _result != null ? _result : $1;
            });
          };
          return function (_content) {
            _content = _$encode(_map, _content);
            return _content.replace(_reg, '<br/><br/>');
          };
        },
        dateFormat(date) {
          const hour = date.getHours().toString().length>1 ? date.getHours() : '0' + date.getHours();
          const minutes = date.getMinutes().toString().length>1 ? date.getMinutes() : '0' + date.getMinutes();
          return hour + ':' + minutes
        },
        scrollToLeast() {
          this.$nextTick(() => {
            const top = document.getElementById('list-container').clientHeight - 340;
            document.getElementById('chat-list').scrollTop = top;
          })
        }
      }

    }
</script>
<style lang="less">
@font-family-M: "Helvetica Neue", Helvetica, Tahoma, Arial, "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei";
@font-family-R: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei";
.rise-help {
  position: absolute;
  right: calc( 50vw - 310px );
  top: 100px;
  z-index: 10000;
  width:620px;
  height: 520px;
  background:rgba(255,255,255,1);
  border-radius:8px;
  border:3px solid #8b119b;
    .header{
      height:60px;
      line-height: 60px;
      background:rgba(139,17,155,1);
      border-radius:5px 8px 0px 0px;
      .header-left{
        height: 60px;
        float: left;
        padding-left: 20px;
        .image{
          width: 59px;
          height: 32px;
          vertical-align: middle;
        }
        .line{
          width:0;
          height:28px;
          border:1px solid rgba(157,29,173,1);
          margin: 0 16px;
          color: #9D1DAD;

        }
        .text{
          width:83px;
          height:25px;
          font-size:18px;
          font-family:PingFangSC-Semibold;
          color:rgba(252,230,255,1);
          line-height:25px;
        }
      }
      .shut-down{
        float: right;
        width:63px;
        height:63px;
        background:rgba(230,100,100,1);
        border-radius:0px 5px 0px 15px;
        text-align: center;
        color:#fff;
        cursor: pointer;
        margin-top: -3px;
        margin-right: -3px;
      }
    }
    .container{
      display: flex;
      position: relative;
      padding: 0;
      .help-im{
        flex:2;
        position: relative;
        height: 454px;
        .chat-list{
          overflow-y: scroll;
          height: 384px;
          padding-top: 20px;
          .chat-img{
            width:100%;
            height: 150px;
          }
          .list{
            margin-bottom: 24px;
            width: 100%;
            min-height: 36px;
            height: auto;
            overflow: hidden;
            position: relative;  
            .nick{
              font-size: 16px;
              font-family: @font-family-M;
              color: rgba(41,57,97,1);
              line-height: 16px;
              margin: 0px 12px 0px 12px;
            }
            .message{
              max-width: calc(100% * 208 / 406);
              padding: 8px;
              font-size:14px;
              font-family: @font-family-R;
              color:rgba(41,57,97,1);
              line-height:20px;
              word-break: break-all;
              word-wrap: break-word;
              position: relative;
            }
            .time{
              font-size:12px;
              font-family: @font-family-R;
              color:rgba(210,210,210,1);
              line-height:12px;
              position: absolute;
              bottom: 0px;
            }
            .student-time{
              .time;
              float: left;
            }
            .student-message{
              .message;
              border-radius:0px 14px 14px 14px;
              margin: 0px 8px 0px -2px;
              background: #F5F5F5;
              float: left;
            }
            .student-nick{
              .nick;
              float: left;
            } 
          }
          .list-teacher{
            width: 100%;
            margin-bottom: 24px;
            min-height: 36px;
            height: auto;
            overflow: hidden;
            .list-item{
              float: right;
              text-align:right;
              .time{
                font-size:12px;
                font-family: @font-family-R;
                color:rgba(210,210,210,1);
                line-height:12px;
                vertical-align: bottom;
              }
              
              .message{
                    max-width: calc(100% * 208 / 406);
                    padding: 8px;
                    font-size:14px;
                    font-family: @font-family-R;
                    color:rgba(41,57,97,1);
                    line-height:20px;
                    word-break: break-all;
                    word-wrap: break-word;
                    position: relative;
                  }
              .nick{
                    font-size: 16px;
                    font-family: @font-family-M;
                    color: rgba(41,57,97,1);
                    line-height: 16px;
                    margin: 0px 12px 0px 12px;
                  }
              .teacher-time{
                    .time;
                    display: inline-block;
                    width: 32px;
                  }
              .teacher-message{
                .message;
                border-radius:14px 0px 14px 14px;
                margin: 0px -2px 0px 8px;
                background: #E8ECF9;
                display: inline-block;
                white-space: pre-line;
                text-align:left;
                }
              }
              .teacher-nick{
                // .nick;
                font-size: 16px;
                font-family: @font-family-M;
                color: rgba(41,57,97,1);
                line-height: 16px;
                margin: 0px 12px 0px 12px;
                display: inline-block;
                vertical-align: top;
              }
          }
        }
        .im-bar{
          position: absolute;
          bottom: 0px;
          height:70px;
          background:rgba(242,242,242,1);
          border-radius:0 0 4px 4px;
          width:100%;
          line-height: 70px;
          display: flex;
          .m-emoji-wrapper{
            display: none;
            position: absolute;
            border: 1px solid #ccc;
            width: 100%;
            height: 150px;
            background-color: #fff;
            position: absolute;
            bottom: 70px;
            left: 0px;
            z-index: 10;
            overflow-y: scroll;
            .m-emoji-picCol{
              position: relative;
              background: #fff;
              .m-emoji-picCol-ul{
                position: relative;
                list-style-type: none;
                zoom: 1;
                &:after{
                  display: block;
                  clear: both;
                  visibility: hidden;
                  height: 0;
                  overflow: hidden;
                  content: ".";
                }
                span{
                  float: left;
                  display: inline-block;
                  margin: 0;
                  background: #fff;
                  border-right: #eee 1px solid;
                  border-bottom: #eee 1px solid;
                  cursor: pointer;
                  padding: 10px;
                  .f-sel{
                    background-color: #ccc;
                  }
                  img{
                    display: block;
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
            .m-emoji-chnCol{
              display: none;
              position: relative;
              background: #f0f0f0;
              .f-sel{
                background-color: #ccc;
              }
            }
          }
          .emoji{
            width:112px;
            cursor: pointer;
            .emoji-img{
              vertical-align: middle;
              width:30px;
              height: 30px;
            }
            .left{
              margin-left: 12px;
              margin-right: 16px;
            }
            .right{
            //   margin-right: 24px;
              cursor: pointer;
            }
            #file{
                display: none;
            }
          }
          .edit{
            cursor: pointer;
            float: left;
            flex:1;
            color:rgba(178,178,178,1);
            height: 70px;
            display: flex;
            align-items: center;
            margin-left: 10px;
            margin-right: 20px;
            box-sizing: border-box;
            
            .editText{
              width: 100%;
              height: 36px;
              line-height: 27px;
	            padding: 4px 5px;
	            margin: 0 auto;
	            box-sizing: border-box;
	            background-color: #fff;
	            border: 1px solid #ccc;
              border-radius: 2px;
              outline: 0;
              resize: none;
              &::-webkit-input-placeholder { /* WebKit browsers */
                color: #B2B2B2;
              }
            }
          }
          .send-btn{
            width:90px;
            background-color: #FDC850;
            float: right;
            text-align: center;
            border-radius: 0 0 4px 0;
            cursor: pointer;
            img{
              width:44px;
              height: 44px;
              vertical-align: middle;
            }
          }
        }
        
      }
    }
}
</style>


