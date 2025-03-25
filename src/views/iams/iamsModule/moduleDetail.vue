<template>
  <el-dialog v-model="visible" :close-on-click-modal="false"
            draggable fullscreen>
      <el-row :gutter="24">
    <el-col :span="6" v-for="(item,index) in cabinetDetails">
    <rack :id="item.id"/>
    </el-col>
  </el-row>
  </el-dialog>
</template>

<script setup lang="ts">
import {getModuleDetail} from '/@/api/iams/iamsModule'
import rack from '/@/components/iams/rack.vue'
const visible = ref(false)
const loading = ref(false)
const cabinetDetails=ref([])
// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  getModuleDetail(id).then((res)=>{
    cabinetDetails.value=res.data
  }).finally(() => {
    loading.value = false
  })
  //获取微模块里面的所有机柜
};
// 暴露变量
defineExpose({
  openDialog
});
</script>

<style scoped lang="scss">

</style>