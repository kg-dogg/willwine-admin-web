<template>
    <div>
        <div class="audiosync" v-if="audiosync.attachment">
            <ul class="scroll-content" :style="{ top }">
                <li v-for="(item, index) in setLyric(audiosync.attachment)" :key="index">{{item}}</li >
            </ul>
        </div>
        <!--<audio ref="audio" controls="controls" src="http://59.109.84.2/mp3.9ku.com/m4a/506703.m4a" @timeupdate="onTimeupdate" @loadedmetadata="onLoadedmetadata"></audio>-->
         <audio ref="audio" controls="controls" :src="audiosync.resource_path" @timeupdate="onTimeupdate" @loadedmetadata="onLoadedmetadata"></audio>
    </div>
</template>

<script>
import { globalViewUrl } from '../api/api';

export default {
  data() {
    return {
      lyric: [],
      activeIndex: 0,
    };
  },
  props: {
    audiosync: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.lyric = this.resolve(this.audiosync.attachment);
  },
  computed: {
    top() {
      return `${-this.activeIndex * 30}px`;
    },
  },
  methods: {
    setPath(path) {
      return `${globalViewUrl}/${path}`;
    },
    setLyric(param) {
      const lyric = this.resolve(param);
      return lyric.lyric;
    },
    resolve(param) {
      const lyrics = param.split('\n');
      const lrcObj = {};
      lrcObj.time = [];
      lrcObj.lyric = [];

      for (let i = 0; i < lyrics.length; i += 1) {
        const lyric = decodeURIComponent(lyrics[i]);
        const timeReg = /\[\d*:\d*((\.|)\d*)*\]/g;
        const timeRegExpArr = lyric.match(timeReg);

        if (timeRegExpArr) {
          const clause = lyric.replace(timeReg, '');

          for (let k = 0, h = timeRegExpArr.length; k < h; k += 1) {
            const t = timeRegExpArr[k];
            const t_ = t.split(':');
            const _t = t_[1].split('.');

            const min = Number(t_[0].slice(1));
            const sec = Number(_t[0]);
            const mill = Number(_t[1].slice(0,2));

            const time = (((min * 60) + sec) * 1000) + mill;

            lrcObj.time.push(time);
            lrcObj.lyric.push(clause);
          }
        }
      }

      return lrcObj;
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      const obj = this.lyric;

      if (obj !== undefined) {
        let start = 0;
        for (let index = 0; index < obj.time.length; index += 1) {
          const curr = res.target.currentTime * 1000;
          if (curr >= start && curr < obj.time[index]) {
            this.activeIndex = index;
            start = obj.time[index];
          }
        }
      }
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {

    },
  },
};
</script>
<style scoped>
*{
  margin: 0 ;
  padding: 0;
}
.audiosync{
  width: 300px;
  height: 32px;
  line-height: 30px;
  overflow: hidden;
  padding-left: 30px;
  border: 1px solid black;
}
.scroll-content{
  position: relative;
  transition: top 0.5s;
}
li{
  line-height: 30px;
  text-align: center;
}
</style>

