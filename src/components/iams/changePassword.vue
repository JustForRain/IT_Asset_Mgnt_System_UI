<template>
  <el-dialog v-model="visible" :close-on-click-modal="false"
             draggable title="密码修改页面">
    <el-form ref="dataFormRef" :model="form" :rules="dataRules">
      <el-row :gutter="24">
        <el-col :span="24" class="mb20">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="form.oldPassword" placeholder="请输入旧密码" readonly
                      @mousedown="copyText(form.oldPassword)"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb20">
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="form.newPassword" placeholder="请点击右侧按钮随机生成新密码" readonly
                      @mousedown="copyText(form.newPassword)">
              <template #append>
                <el-button @click="generatePasswordHandler">生成密码</el-button>
              </template>
            </el-input>
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

<script lang="ts" setup>
import { useMessage } from "/@/hooks/message";
import commonFunction from '/@/utils/commonFunction';
import other from '/@/utils/other'
import {changePassword} from "/@/api/iams/iamsAccount";

const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
const {copyText} = commonFunction();


// 提交表单数据
const form = reactive({
  id: '',
  oldPassword: '',
  newPassword: '',
});
// 定义校验规则
const dataRules = ref({
  oldPassword: [{required: true, message: '旧密码不能为空', trigger: 'blur'}],
  newPassword: [{required: true, message: '新密码不能为空', trigger: 'blur'}],
})
// 打开弹窗
const openDialog = (id: string, oldPassword: string) => {
  visible.value = true

  if (id) {
    form.id = id;
  }
  if (oldPassword) {
    form.oldPassword = oldPassword;
  }
  form.newPassword=''
};
const generatePasswordHandler = () => {
  form.newPassword = other.generatePassword(8);
  copyText(form.newPassword)
}

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {
  });
  if (!valid) return false;

  try {
    loading.value = true;
    console.log(form)
    await changePassword(form);
    useMessage().success('修改成功');
    visible.value = false;
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};

// 暴露变量
defineExpose({
  openDialog
});
</script>

<style lang="scss" scoped>

</style>