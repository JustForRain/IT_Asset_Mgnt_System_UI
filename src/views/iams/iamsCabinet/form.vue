<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="100px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="12" class="mb20">
      <el-form-item label="所属微模块" prop="moduleId">
            <el-select v-model="form.moduleId" placeholder="请选择所属微模块">
              <el-option v-for="item in getiamsModuleOption" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="大小" prop="size">
        <el-input v-model="form.size" placeholder="请输入大小"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="所在行" prop="rowNum">
        <el-input v-model="form.rowNum" placeholder="请输入所在行"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="所在列" prop="columnNum">
        <el-input v-model="form.columnNum" placeholder="请输入所在列"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="机柜从上到下数字排序" prop="sortOrder">
        <el-switch v-model="form.sortOrder"  inline-prompt   active-text="大到小"    inactive-text="小到大"/>
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
import { useDict } from '/@/hooks/dict';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/iams/iamsCabinet'
import {fetchList} from '/@/api/iams/iamsModule'
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
	  moduleId: '',
	  size: '',
	  rowNum: '',
	  columnNum: '',
	  name: '',
    sortOrder: true,
});

// 定义校验规则
const dataRules = ref({
        moduleId: [{required: true, message: '所属微模块不能为空', trigger: 'blur'}],
        size: [{required: true, message: '大小不能为空', trigger: 'blur'}],
        rowNum: [{required: true, message: '所在行不能为空', trigger: 'blur'}],
        columnNum: [{required: true, message: '所在列不能为空', trigger: 'blur'}],
        // name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});
  getiamsModuleData();
  // 获取iamsCabinet信息
  if (id) {
    form.id = id
    getiamsCabinetData(id)
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
const getiamsCabinetData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj(id).then((res: any) => {
    Object.assign(form, res.data)
  }).finally(() => {
    loading.value = false
  })
};

//初始化机房列表
const getiamsModuleOption = ref();
const getiamsModuleData = () => {
  // 获取数据
  loading.value = true
  fetchList().then((res: any) => {
    getiamsModuleOption.value=res.data.records
  }).finally(() => {
    loading.value = false
  })
};

// 暴露变量
defineExpose({
  openDialog
});
</script>