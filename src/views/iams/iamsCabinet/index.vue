<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()"
            v-auth="'iams_iamsCabinet_add'">
            新 增
          </el-button>
          <el-button plain :disabled="multiple" icon="Delete" type="primary"
            v-auth="'iams_iamsCabinet_del'" @click="handleDelete(selectObjs)">
            删除
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" :export="'iams_iamsCabinet_export'"
                @exportExcel="exportExcel" class="ml10 mr20" style="float: right;"
            @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" border 
        :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle"
				@selection-change="selectionChangHandle"
        @sort-change="sortChangeHandle">
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column type="index" label="#" width="40" />
          <el-table-column prop="moduleName" label="所属微模块"  show-overflow-tooltip/>
          <el-table-column prop="size" label="大小"  show-overflow-tooltip/>
          <el-table-column prop="rowNum" label="所在行"  show-overflow-tooltip/>
          <el-table-column prop="columnNum" label="所在列"  show-overflow-tooltip/>
          <el-table-column prop="name" label="名称"  show-overflow-tooltip/>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button icon="edit-pen" text type="primary" v-auth="'iams_iamsCabinet_edit'"
              @click="formDialogRef.openDialog(scope.row.id)">编辑</el-button>
            <el-button icon="delete" text type="primary" v-auth="'iams_iamsCabinet_del'" @click="handleDelete([scope.row.id])">删除</el-button>
            <el-button icon="plus" text type="primary" v-auth="'iams_iamsCabinet_del'" @click="putOnDialogRef.openDialog(scope.row.id)">上架</el-button>
            <el-button icon="minus" text type="primary" v-auth="'iams_iamsCabinet_del'" @click="pullOffDialogRef.openDialog(scope.row.id)">下架</el-button>
            <el-button icon="view" text type="primary" v-auth="'iams_iamsCabinet_del'" @click="cabinetDetailDialogRef.openDialog(scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
    </div>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)" />

    <!-- 上架  -->
    <put-on-dialog ref="putOnDialogRef" @refresh="getDataList(false)" />

    <!-- 下架  -->
    <pull-off-dialog ref="pullOffDialogRef" @refresh="getDataList(false)" />

    <!-- 机柜详情  -->
    <cabinet-detail-dialog ref="cabinetDetailDialogRef" />

  </div>
</template>

<script setup lang="ts" name="systemIamsCabinet">
import { BasicTableProps, useTable } from "/@/hooks/table";
import { fetchList, delObjs } from "/@/api/iams/iamsCabinet";
import { useMessage, useMessageBox } from "/@/hooks/message";

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const PutOnDialog = defineAsyncComponent(() => import('./puton.vue'));
const PullOffDialog = defineAsyncComponent(() => import('./pulloff.vue'));
const cabinetDetailDialog = defineAsyncComponent(() => import('./cabinetDetail.vue'))
// 定义查询字典

// 定义变量内容
const formDialogRef = ref()
const putOnDialogRef = ref()
const pullOffDialogRef = ref()
const cabinetDetailDialogRef = ref()
// 搜索变量
const queryRef = ref()
const showSearch = ref(true)
// 多选变量
const selectObjs = ref([]) as any
const multiple = ref(true)

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {},
  pageList: fetchList
})

//  table hook
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
  sortChangeHandle,
  downBlobFile,
	tableStyle
} = useTable(state)

// 清空搜索条件
const resetQuery = () => {
  // 清空搜索条件
  queryRef.value?.resetFields()
  // 清空多选
  selectObjs.value = []
  getDataList()
}

// 导出excel
const exportExcel = () => {
  downBlobFile('/iams/iamsCabinet/export',Object.assign(state.queryForm, { ids: selectObjs }), 'iamsCabinet.xlsx')
}

// 多选事件
const selectionChangHandle = (objs: { id: string }[]) => {
  selectObjs.value = objs.map(({ id }) => id);
  multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (ids: string[]) => {
  try {
    await useMessageBox().confirm('此操作将永久删除');
  } catch {
    return;
  }

  try {
    await delObjs(ids);
    getDataList();
    useMessage().success('删除成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};
</script>