<template>
  <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
             :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="162px" v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="24" class="mb20">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="form.projectName" placeholder="请输入项目名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="甲方" prop="purchaser">
            <el-input v-model="form.purchaser" placeholder="请输入甲方"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="乙方" prop="seller">
            <el-input v-model="form.seller" placeholder="请输入乙方"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="签订日期" prop="signingTime">
            <el-date-picker type="date" placeholder="请选择签订日期" v-model="form.signingTime" :value-format="dateStr"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="项目金额（单位：元）" prop="price">
            <el-input v-model="form.price" placeholder="请输入项目金额"/>
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

<script setup lang="ts" name="IamsContractDialog">
import {useDict} from '/@/hooks/dict';
import {useMessage} from "/@/hooks/message";
import {getObj, addObj, putObj} from '/src/api/iams/iamsContract'
import {rule} from '/@/utils/validate';

const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// 定义字典

// 提交表单数据
const form = reactive({
  id: '',
  purchaser: '',
  seller: '',
  signingTime: '',
  price: '',
  projectName: '',
});

// 定义校验规则
const dataRules = ref({
  purchaser: [{required: true, message: '甲方不能为空', trigger: 'blur'}],
  seller: [{required: true, message: '乙方不能为空', trigger: 'blur'}],
  signingTime: [{required: true, message: '签订日期不能为空', trigger: 'blur'}],
  price: [{required: true, message: '项目金额不能为空', trigger: 'blur'}],
  projectName: [{required: true, message: '项目名称不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });

  // 获取iamsContract信息
  if (id) {
    form.id = id
    getiamsContractData(id)
  }
};

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {
  });
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
const getiamsContractData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj(id).then((res: any) => {
    Object.assign(form, res.data)
  }).finally(() => {
    loading.value = false
  })
};

// 暴露变量
defineExpose({
  openDialog
});
</script>