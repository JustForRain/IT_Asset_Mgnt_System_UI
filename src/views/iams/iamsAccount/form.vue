<template>
  <el-dialog v-model="visible" :close-on-click-modal="false"
             :title="form.id ? '编辑' : '新增'" draggable>
    <el-form ref="dataFormRef" v-loading="loading" :model="form" :rules="dataRules" formDialogRef label-width="100px">
      <el-row :gutter="24">
        <el-col :span='24' class="mb20">
          <el-form-item label="设备序列号" :prop="form.single?'sn':'sns'">
            <el-input v-if="form.single" v-model="form.sn" placeholder="请输入设备序列号" style="flex: 1"/>
            <el-select v-if="!form.single" v-model="form.sns" clearable collapse-tags filterable multiple placeholder="请选择设备"
                       style="flex: 1">
              <el-option v-for="(item, index) in snList"
                         :key="index"
                         :label="item.label"
                         :value="item.label"
              />
            </el-select>
            <el-switch
                v-model="form.single"
                active-text="单一设备"
                inactive-text="多合一设备"
                inline-prompt
				style="margin: 0 10px"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">

        <el-col :span="12" class="mb20">
          <el-form-item label="MAC地址" prop="macAddress">
            <el-input v-model="form.macAddress" placeholder="请输入MAC地址"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="地址" prop="url">
            <el-input v-model="form.url" placeholder="请输入地址"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="端口" prop="port">
            <el-input v-model="form.port" placeholder="请输入端口"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="类型" prop="type">
            <el-input v-model="form.type" placeholder="请输入类型"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="协议" prop="protocol">
            <el-input v-model="form.protocol" placeholder="请输入协议"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="账号" prop="account">
            <el-input v-model="form.account" placeholder="请输入账号"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" :readonly="form.id!==''" placeholder="请输入密码"/>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button :disabled="loading" type="primary" @click="onSubmit">确认</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="IamsAccountDialog" setup>
import {useMessage} from "/@/hooks/message";
import {addObj, getObj, putObj} from '/@/api/iams/iamsAccount'
import {fetchListNoPage} from '/@/api/iams/iamsAsset'

const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// 定义字典

// 提交表单数据
const form = reactive({
  id: '',
  assetId: '',
  sn: '',
  vsn: '',
  sns: [],
  url: '',
  type: '',
  account: '',
  password: '',
  protocol: '',
  port: '',
  macAddress: '',
  single: true,
});

// 定义校验规则
const dataRules = ref({
  sn: [{required: true, message: '设备序列号', trigger: 'blur'}],
  sns: [{required: true, message: '设备序列号', trigger: 'blur'}],
  url: [{required: true, message: '地址不能为空', trigger: 'blur'}],
  macAddress: [{required: true, message: 'MAC地址不能为空', trigger: 'blur'}],
  port: [{required: true, message: '端口不能为空', trigger: 'blur'}],
  type: [{required: true, message: '类型不能为空', trigger: 'blur'}],
  protocol: [{required: true, message: '协议不能为空', trigger: 'blur'}],
  account: [{required: true, message: '账号不能为空', trigger: 'blur'}],
  password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });

  // 获取iamsAccount信息
  if (id) {
    form.id = id
    getiamsAccountData(id)
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
const getiamsAccountData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj(id).then((res: any) => {
    Object.assign(form, res.data)
  }).finally(() => {
    loading.value = false
  })
};
const snList = ref([])
watch(
    () => form.single,
    (newSingle) => {
      if (!newSingle) {
        form.sn = ''
        fetchListNoPage({"status": "1"}).then((res) => {
          snList.value = res.data
        })
      } else {
        form.sns = []
      }
    }
)

// 暴露变量
defineExpose({
  openDialog
});
</script>