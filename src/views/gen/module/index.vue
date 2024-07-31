<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="120px" v-loading="loading">
			<el-row :gutter="20">
				<el-col :span="12" class="mb20">
					<el-form-item label="模块名" prop="moduleName">
						<el-input v-model="form.moduleName" placeholder="请输入模块名称" />
					</el-form-item>
					<el-form-item label="描述" prop="description">
						<el-input v-model="form.description" placeholder="请输入模块描述" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<span>
				<el-button formDialogRef @click="visible = false">重置</el-button>
				<el-button formDialogRef @click="onPreview">预览</el-button>
				<el-button formDialogRef type="primary" @click="onSubmit" :disabled="loading">生成</el-button>
			</span>
		</div>
		<!-- 预览基本信息 -->
		<preview-dialog ref="previewDialogRef" />
	</div>
</template>

<script lang="ts" name="systemGenModule" setup>
import { genModule } from '/@/api/gen/module';
import { downBlobFile } from '/@/utils/other';
import { useMessage } from '/@/hooks/message';

const PreviewDialog = defineAsyncComponent(() => import('./preview.vue'));

// 定义变量内容
const dataFormRef = ref();
const loading = ref(false);
const previewDialogRef = ref();
// 提交表单数据
const form = reactive({
	moduleName: '',
	description: '',
});

// 定义校验规则
const dataRules = reactive({
	moduleName: [{ required: true, message: '模块名称不能为空', trigger: 'blur' }],
});

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		await downBlobFile(`/gen/module/download?moduleName=${form.moduleName}&description=${form.description}`, {}, `${form.moduleName}.zip`);
		useMessage().success("模块生成成功");
	} catch (err: any) {
		useMessage().error('模块初始化异常');
	} finally {
		loading.value=false
	}
};

//预览
const onPreview = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
  previewDialogRef.value.openDialog(form.moduleName,form.description);
};
</script>
