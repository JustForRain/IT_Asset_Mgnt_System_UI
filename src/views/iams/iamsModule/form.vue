<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="12" class="mb20">
      <el-form-item label="所属机房" prop="roomId">
            <el-select v-model="form.roomId" placeholder="请选择所属机房">
              <el-option v-for="item in getiamsRoomOption" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="微模块名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入微模块名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="机柜数量" prop="size">
        <el-input v-model="form.size" placeholder="请输入机柜数量"/>
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

<script setup lang="ts" name="IamsModuleDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/iams/iamsModule'
import {fetchList} from '/@/api/iams/iamsRoom'
import { rule } from '/@/utils/validate';
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// 定义字典

// 提交表单数据
const form = reactive({
		id:'',
	  roomId: '',
	  name: '',
	  size: '',
});

// 定义校验规则
const dataRules = ref({
        roomId: [{required: true, message: '所属机房不能为空', trigger: 'blur'}],
        name: [{required: true, message: '微模块名称不能为空', trigger: 'blur'}],
        size: [{required: true, message: '机柜数量不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});
  getiamsRoomData()
  // 获取iamsModule信息
  if (id) {
    form.id = id
    getiamsModuleData(id)
  }
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
    loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(form.id ? '修改成功' : '添加成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
    loading.value = false;
  }
};


// 初始化表单数据
const getiamsModuleData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj(id).then((res: any) => {
    Object.assign(form, res.data)
  }).finally(() => {
    loading.value = false
  })
};

//初始化机房列表
const getiamsRoomOption = ref();
const getiamsRoomData = () => {
  // 获取数据
  loading.value = true
  fetchList().then((res: any) => {
    getiamsRoomOption.value=res.data.records
  }).finally(() => {
    loading.value = false
  })
};

// 暴露变量
defineExpose({
  openDialog
});
</script>