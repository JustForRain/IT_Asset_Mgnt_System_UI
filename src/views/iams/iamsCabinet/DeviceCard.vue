<template>
  <div v-if="device" :class="deviceSizeClass">
    <template v-if="device.role">
      {{ device.role }}
    </template>
  </div>
</template>

<script lang="ts" setup>
import {defineProps} from 'vue';

const props = defineProps({
  // 数据
  device: {
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
const deviceSizeClass = computed(() => {
  if(props.device.size>1){
    return 'deviceCard'
  }else {
    return 'deviceCardOne'
  }
});

</script>

<style lang="scss" scoped>
.deviceCardOne{
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;
}

.deviceCard{
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
}
</style>