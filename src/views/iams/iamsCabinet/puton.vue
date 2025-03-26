<template>
  <el-dialog title="上架" v-model="visible"
             :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="100px" v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item label="上架设备" prop="assetId">
            <el-select v-model="form.assetId" placeholder="请选择上架设备">
              <el-option v-for="item in iamsAssetOption" :key="item.value" :label="item.label" :value="item.value" @click="copyText(item.label)"/>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="设备角色" prop="role">
            <el-input v-model="form.role" placeholder="请输入设备角色"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item label="上架位置" prop="putOnLocatioin">
            <el-transfer v-model="form.putOnLocatioin" :data="cabinetDate" :titles="['空余位置', '上架位置']"
                         :button-texts="['下架', '上架']" @change="unitCheck"/>
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

import {useMessage} from "/@/hooks/message";
import {getUnit} from '/@/api/iams/iamsCabinet'
import {getObj as getObjAsset, fetchListNoPage} from '/@/api/iams/iamsAsset'
import {addObj as putOn} from '/@/api/iams/iamsShelf'
import commonFunction from '/@/utils/commonFunction';
const { copyText } = commonFunction();

const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// 定义字典

// 提交表单数据
const value = ref([])
const form = reactive({
  id: '',
  cabinetId: '',
  putOnLocatioin: [],
  assetId: '',
  unitStart: '',
  unitEnd:'',
});

// 定义校验规则
const dataRules = ref({
  assetId: [{required: true, message: '上架设备不能为空', trigger: 'blur'}],
  role: [{required: true, message: '设备角色不能为空', trigger: 'blur'}],
  putOnLocatioin: [{required: true, message: '上架位置不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.cabinetId = id

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });
  getIamsAssetData();
  getCabinetDate(id);
};

// 提交 调用上架管理addObj接口
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {
  });
  if (!valid) return false;
  form.unitStart=form.putOnLocatioin[0]
  form.unitEnd=form.putOnLocatioin[form.putOnLocatioin.length-1]
  try {
    loading.value = true;
    putOn(form)
    useMessage().success('上架成功');
    visible.value = false;
    emit('refresh');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};

// 初始化表单数据
// 获取设备列表
const iamsAssetOption = ref()
const getIamsAssetData = () => {
  // 获取数据
  loading.value = true
  fetchListNoPage({"status":"0"}).then((res: any) => {
    iamsAssetOption.value = res.data
  }).finally(() => {
    loading.value = false
  })
}

// 获取机柜空余位置
const cabinetDate = ref([])
const getCabinetDate = (id?: string) => {
  // 获取数据
  loading.value = true
  getUnit(id).then((res: any) => {
    cabinetDate.value = res.data.unit
  }).finally(() => {
    loading.value = false
  })
};
//上架位置与机柜大小校验
const assetSizeCheck = (value: any) => {
  //获取设备大小
  getObjAsset(form.assetId).then((res: any) => {
    if (res.data.size !== value) {
      useMessage().error("上架位置不匹配，请重新选择！")
      //清空
      form.putOnLocatioin = []
    }
  })
}
// 机柜位置选择
const unitCheck = (value: any) => {
  assetSizeCheck(value.length)
  if (value.length <= 1) {
    return true; // 如果数组长度小于等于1，则认为是连续的
  }
  // 将字符串转换为数字
  const numericValue = value.map(item => parseInt(item, 10));
  // 对数组进行排序
  numericValue.sort((a, b) => a - b);
  // 检查相邻元素是否连续
  for (let i = 0; i < numericValue.length - 1; i++) {
    if (numericValue[i] + 1 !== numericValue[i + 1]) {
      //清空
      form.putOnLocatioin = []
      useMessage().error("您所选择的上架位置不连续，请重新选择");
    }
  }
}
// 暴露变量
defineExpose({
  openDialog
});
</script>