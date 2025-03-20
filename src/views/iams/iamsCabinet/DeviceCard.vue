<template>
  <div v-if="message" class="deviceCard">
    <div v-if="message.brandName">
      设备品牌：{{ message.brandName }}
    </div>
    <div v-if="message.deviceName">
      设备名称：{{ message.deviceName }}
    </div>
    <div v-if="message.sn">
      序列号：{{ message.sn }}
    </div>
    <div v-if="message.role">
      设备角色：{{ message.role }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import {defineProps} from 'vue';

const props = defineProps({
  // 数据
  message: {
    type: Object,
    default: () => {
      return {
        id: '',
        cabinetId: '',
        assetId: '',
        unitStart: '',
        unitEnd: '',
        brandName: '',
        deviceName: '',
        role: '',
        sn: '',
      };
    },
  }
});
</script>

<style lang="scss" scoped>
.deviceCard {
  width: 100%;
  text-align: center;
  background-color: gray;
}
</style>