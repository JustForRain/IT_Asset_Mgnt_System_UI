<template>
    <el-dialog title="下架" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="100px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="24" class="mb20">
      <el-form-item label="下架资产" prop="assetId">
            <el-select v-model="form.assetId" placeholder="请选择下架资产" multiple>
              <el-option v-for="item in iamsAssetOption" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
      </el-form-item>
      </el-col>
			</el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup lang="ts" name="IamsCabinetDialog">
import { useMessage } from "/@/hooks/message";
import { addObj, putObj } from '/@/api/iams/iamsCabinet'
import { fetchPutOnList, pullOff } from '/@/api/iams/iamsShelf'

const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// 定义字典

// 提交表单数据
const form = reactive({
  assetId: [],
  cabinetId: '',
});

// 定义校验规则
const dataRules = ref({
        assetId: [{required: true, message: '下架资产不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (cabinetId: string) => {
  visible.value = true
  form.cabinetId = cabinetId

  // 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});
  getIamsAssetData();
  // 获取iamsCabinet信息
  // if (id) {
    // form.id = id
    // getiamsCabinetData(id)
  // }
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
    loading.value = true;
		await pullOff(form.assetId);
		useMessage().success('下架成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
    loading.value = false;
  }
};

// 获取上架设备列表
const iamsAssetOption = ref()
const getIamsAssetData = () => {
  // 获取数据
  loading.value = true
  fetchPutOnList(form.cabinetId).then((res: any) => {
    iamsAssetOption.value = res.data
  }).finally(() => {
    loading.value = false
  })
}
// 暴露变量
defineExpose({
  openDialog
});
</script>