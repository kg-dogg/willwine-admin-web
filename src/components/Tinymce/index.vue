<template>
  <div class="tinymce-container editor-container" :class="{fullscreen:fullscreen}">
    <textarea class="tinymce-textarea" :id="tinymceId" />
    <div class="editor-custom-btn-container">
      <editorImage
        color="#1890ff"
        class="editor-upload-btn"
        @successCBK="imageSuccessCBK"
        :allowExtention='allowExtention'
      />
    </div>
  </div>
</template>

<script>
import editorImage from "./components/editorImage";
import plugins from "./plugins";
import toolbar from "./toolbar";
import { mapState } from "vuex";
import { globalViewUrl } from "@/api/api";
export default {
  name: "tinymce",
  components: { editorImage },
  props: {
    id: {
      type: String
    },
    value: {
      type: String,
      default: ""
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    menubar: {
      default: "file edit insert view format table"
    },
    height: {
      type: Number,
      required: false,
      default: 360
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || `vue-tinymce-${+new Date()}`,
      fullscreen: false
    };
  },
  computed: {
    ...mapState(["global"]),
    allowExtention() {
      return this.global.type.allow_extension;
    },
    audioTypes() {
      console.log('this.global.type', this.global.type);
      return this.global.type.allow_audio.split(",");
    }
  },
  watch: {
    value(val) {
      if (
        window.tinymce.get(this.tinymceId).getContent() !== val &&
        this.hasInit
      ) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val)
        );
      }
    }
  },
  mounted() {
    this.initTinymce();
  },
  activated() {
    this.initTinymce();
  },
  deactivated() {
    this.destroyTinymce();
  },
  methods: {
    initTinymce() {
      const self = this;
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language_url: "/static/plugins/tinymce4.7.5/langs/zh_CN.js",
        language: "zh_CN",
        height: this.height,
        body_class: "panel-body ",
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        branding: false,
        plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: "clean",
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: "square",
        advlist_number_styles: "default",
        imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
        default_link_target: "_blank",
        link_title: false,
        verify_html: false,
        encoding: true,
        init_instance_callback: editor => {
          if (self.value) {
            editor.setContent(self.value);
          }
          self.hasInit = true;
          editor.on("NodeChange Change KeyUp SetContent", () => {
            this.hasChange = true;
            this.$emit("input", editor.getContent());
          });
        },
        setup(editor) {
          editor.on("FullscreenStateChanged", e => {
            self.fullscreen = e.state;
          });
        }
      });
    },
    destroyTinymce() {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      return window.tinymce.get(this.tinymceId).getContent();
    },
    imageSuccessCBK(arr) {
      const self = this;
      arr.forEach(v => {
        const ext = _.last(_.split(v.url, "."));
        if (_.indexOf(["png", "jpg", "jpeg", "gif"], ext) !== -1) {
          window.tinymce
            .get(self.tinymceId)
            .insertContent(`<img class="wscnph" src="${v.url}" >`);
        } else if (_.indexOf(this.audioTypes, `.${ext}`) !== -1) {
          // 插入音频
          const data = v.url.split("/");
          const name = data[data.length - 1].split(".")[0];
          // const template = `
          //   <img
          //   width='40px'
          //   class='audio'
          //   onclick ="const audio = document.getElementsByName('${name}')[0];if(audio && audio.play) audio.paused ? audio.play() : audio.pause()"
          //   src="${globalViewUrl}static/images/audio-paused.png"
          //   name="img${name}"/>
          //   <audio
          //   style='opacity:0; position:absolute; right: 0; top: 0; height: 1px; width:1px;'
          //   name="${name}"
          //   src="${v.url}"
          //   onplay = "const img= document.getElementsByName('img${name}')[0];if(img) img.src = '${globalViewUrl}static/images/audio-played.gif'"
          //   onpause = "const img= document.getElementsByName('img${name}')[0];if(img) img.src = '${globalViewUrl}static/images/audio-paused.png'"></audio>
          // `

          // 复制的音频无法播放问题
          // const cdnUrl = globalViewUrl.replace(/^\/\//,'https://')
          const cdnUrl = globalViewUrl;
          const template = `<a class="audio-wrap" style="display:inline-block;width:40px;height:40px;cursor:pointer;background-image:url(${cdnUrl}static/images/audio-paused.png);background-size:40px;"
          onclick="const audio = this.querySelector('audio');if(audio && audio.play) audio.paused ? audio.play() : audio.pause()" contenteditable="false">
          <audio
            style="height: 40px; width:40px;background-image:url(${cdnUrl}static/images/audio-paused.png);background-size:40px;"
            name="${name}"
            src="${v.url}"
              onplay = "this.parentNode.style.backgroundImage='url(${cdnUrl}static/images/audio-played.gif)';document.querySelectorAll('audio').forEach(item=>{item !==this && item.pause()})"
            onpause = "this.parentNode.style.backgroundImage='url(${cdnUrl}static/images/audio-paused.png)'"></audio>
            </a>
          `;

          window.tinymce.get(self.tinymceId).insertContent(template);
        } else if (
          _.indexOf(["rm", "3gp", "mov", "avi", "wmv", "flv", "mp4"], ext) !==
          -1
        ) {
          window.tinymce
            .get(self.tinymceId)
            .insertContent(
              `<video src="${
                v.url
              }" controls="controls" controlsList="nodownload" poster="${
                v.cover_url
              }" vid="${v.videoId}"></video>`
            );
        } else {
          window.tinymce
            .get(self.tinymceId)
            .insertContent(`<a href="${v.url}" target="_blank">未知类型</a>`);
        }
      });
    }
  },
  destroyed() {
    this.destroyTinymce();
  }
};
</script>

<style scoped>
.tinymce-container {
  position: relative;
}
.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 0px;
  height: 34px;
  line-height: 34px;
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
