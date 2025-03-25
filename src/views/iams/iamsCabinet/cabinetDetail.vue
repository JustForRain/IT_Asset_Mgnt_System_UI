<template>
  <el-dialog v-model="visible" :close-on-click-modal="false"
             draggable width="30%">
    <rack :id="cabinetId"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import rack from '/@/components/iams/rack.vue'
const visible = ref(false)
// 打开弹窗
const cabinetId=ref();
const openDialog = (id:string) => {
  visible.value = true
  cabinetId.value=id;
};
// 暴露变量
defineExpose({
  openDialog
});
</script>


<style lang="scss" scoped>
</style>