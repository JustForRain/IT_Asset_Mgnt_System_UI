<template>
  <el-dialog v-model="visible" :title="form.id ? '设备详情页面' : '设备详情页面'">
    <el-form ref="dataFormRef" v-loading="loading" :model="form" formDialogRef label-width="120px">
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item label="品牌" prop="brandName">
            <el-input v-model="form.brandName" readonly @mousedown="copyText(form.brandName)"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="型号" prop="model">
            <el-input v-model="form.model" readonly @mousedown="copyText(form.model)"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item label="序列号" prop="sn">
            <el-input v-model="form.sn" readonly @mousedown="copyText(form.sn)"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="设备类型" prop="type">
            <el-input v-model="form.type" readonly @mousedown="copyText(form.type)"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item label="角色" prop="role">
            <el-input v-model="form.role" readonly @mousedown="copyText(form.role)"/>
          </el-form-item>
        </el-col>
      </el-row>
<!--      循环体开始-->
      <div v-for="(item) in form.accountList">
      <el-divider />
      <account :account="item"/>
      </div>
<!--      循环体结束-->
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="visible = false">关闭</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {getDetail} from '/@/api/iams/iamsAsset'
import commonFunction from '/@/utils/commonFunction';
import account from '/@/components/iams/account.vue'
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
const { copyText } = commonFunction();

// 提交表单数据
const form = ({});
// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
    // 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});
  getIamsAssetDetail(id)
};
// 初始化表单数据
const getIamsAssetDetail = (id: string) => {
  // 获取数据
  loading.value = true
  getDetail(id).then((res: any) => {
    Object.assign(form, res.data)
    console.log(form)
  }).finally(() => {
    loading.value = false
  })
};
// 暴露变量
defineExpose({
  openDialog
});
</script>


<style lang="scss" scoped>

</style>