<template>
  <div>
    <el-dialog title="初次登录请修改初始密码" v-model="visible" :close-on-click-modal="false" draggable>
      <el-form ref="passwordFormdataRef" :model="passwordFormData" :rules="passwordRuleForm" formDialogRef label-width="120px">
        <el-row :gutter="24">
          <el-col :span="24" class="mb20">
            <el-form-item label="原密码" prop="password">
              <el-input v-model="passwordFormData.password" placeholder="请输入密码" clearable type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newpassword1">
              <strength-meter
                  v-model="passwordFormData.newpassword1"
                  :minlength="8"
                  :maxlength="16"
                  placeholder="请输入新密码"
                  @score="passwordScore"
              ></strength-meter>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="mb20">
            <el-form-item label="再次输入新密码" prop="newpassword2">
              <strength-meter v-model="passwordFormData.newpassword2" :minlength="8" :maxlength="16" placeholder="请重复密码"></strength-meter>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
								<el-button type="primary" @click="handleChangePassword"> 修改密码 </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts" name="modifyPassword">
import {password} from "/@/api/admin/user";
import {useMessage} from "/@/hooks/message";
import {Session} from "/@/utils/storage";

const { t } = useI18n();
import {useI18n} from "vue-i18n";
const StrengthMeter = defineAsyncComponent(() => import('/src/components/StrengthMeter/index.vue'));
const visible = ref(false);
const passwordFormdataRef = ref();
// 提交表单数据
const passwordFormData  = reactive({
  password: '',
  newpassword1: '',
  newpassword2: '',
	firstLoginFlag: true,
});
const score = ref(0);
const passwordScore = (e) => {
  score.value = e;
};
const validatorScore = (rule: any, value: any, callback: any) => {
  if (score.value < 3) {
    callback(new Error("密码需包含字母+数字+特殊字符"));
  } else {
    callback();
  }
};
const validatorPassword2 = (rule: any, value: any, callback: any) => {
  if (value !== passwordFormData.newpassword1) {
    callback(new Error(t('personal.passwordRule')));
  } else {
    callback();
  }
};
// 修改密码框校验规则
const passwordRuleForm = ref({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newpassword1: [
    {
      required: true,
      min: 8,
      max: 16,
      message: '用户密码长度必须介于 8 和 20 之间',
      trigger: 'blur',
    },
    { validator: validatorScore, trigger: 'blur' },
  ],
  newpassword2: [
    {
      required: true,
      min: 8,
      max: 16,
      message: '用户密码长度必须介于 8 和 20 之间',
      trigger: 'blur',
    },
    { validator: validatorPassword2, trigger: 'blur' },
  ],
})
// 提交修改密码表单
const handleChangePassword=()=>{
  passwordFormdataRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    password(passwordFormData)
        .then(() => {
          useMessage().success('修改成功');
          // 需要重新登录
          // 清除缓存/token等
          Session.clear();
          // 使用 reload 时，不需要调用 resetRoute() 重置路由
          window.location.reload();
        })
        .catch((err) => {
          useMessage().error(err.msg);
        });
  });
}
// 打开弹窗
const openDialog = () => {
  visible.value = true
};
// 暴露变量
defineExpose({
  openDialog
});
</script>
