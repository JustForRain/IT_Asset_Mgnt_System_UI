<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ props.account.type }}权限</span>
      </div>
    </template>
    <el-row :gutter="24">
      <el-col :span="12" class="mb20">
        <el-form-item label="类型" prop="managerIp">
          <el-input v-model="props.account.type" readonly @mousedown="copyText(props.account.type)"/>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="mb20">
        <el-form-item label="协议" prop="protocol">
          <el-input v-model="props.account.protocol" readonly @mousedown="copyText(props.account.protocol)"/>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="mb20">
        <el-form-item label="IP" prop="managerIp">
          <el-input v-model="props.account.url" readonly @mousedown="copyText(props.account.url)"/>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="mb20">
        <el-form-item label="端口" prop="port">
          <el-input v-model="props.account.port" readonly/>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="mb20">
        <el-form-item label="帐号" prop="managerAccount">
          <el-input v-model="props.account.account" readonly @mousedown="copyText(props.account.account)"/>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="mb20">
        <el-form-item label="密码" prop="managerPassword">
          <el-input v-model="props.account.password" readonly @mousedown="copyText(props.account.password)">
            <template #append>
              <el-button @click="updatePasswordHandle">更新密码</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <change-password-dialog ref="ChangePasswordDialogRef"/>
  </el-card>
</template>

<script lang="ts" setup>
import {defineProps} from "vue";
import commonFunction from '/@/utils/commonFunction';

// 引入组件
const ChangePasswordDialog = defineAsyncComponent(() => import('./changePassword.vue'));
const ChangePasswordDialogRef = ref()

const {copyText} = commonFunction();

const props = defineProps({
  // 数据
  account: {
    type: Object,
    default: () => {
      return {
        account: '',
        password: '',
        type: '',
        url: '',
        port: '',
        protocol: '',
      };
    },
  }
});

const updatePasswordHandle = () => {
  ChangePasswordDialogRef.value.openDialog(props.account.id, props.account.password)
}
</script>

<style lang="scss" scoped>

</style>