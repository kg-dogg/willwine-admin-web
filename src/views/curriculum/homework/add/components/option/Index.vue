// 这个组件只做中转任务，判断是转给text还是picture渲染；并将子组件的回调直接发回给父组件
<template>
  <PictureOption v-if="optionType==='picture'" :value="value" :alpha="alpha" @emitChange="emitChange"></PictureOption>
  <TextOption v-else :value="value" :alpha="alpha" @emitChange="emitChange"></TextOption>
</template>

<script>
import TextOption from './TextOption';
import PictureOption from './PictureOption';
export default {
  components:{
    TextOption,
    PictureOption
  },
  props:{
    value: Object,
    // 选项字母: A,B,C,D
    alpha: String,
    // 选项类型：text or picture
    optionType: {
      type: String,
      default() {
        return "text";
      }
    }
  },
  data(){
    return {};
  },
  methods:{
    emitChange(newValue){
      this.$emit('emitChange',newValue);
    }
  }
}
</script>
