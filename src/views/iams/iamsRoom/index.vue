<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
       <el-row v-show="showSearch">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
      <el-form-item label="名称" prop="name" >
        <el-input placeholder="请输入名称" v-model="state.queryForm.name" />
      </el-form-item>
      <el-form-item label="地址" prop="location" >
        <el-input placeholder="请输入地址" v-model="state.queryForm.location" />
      </el-form-item>
      <el-form-item label="管理单位" prop="manager" >
        <el-input placeholder="请输入管理单位" v-model="state.queryForm.manager" />
      </el-form-item>
          <el-form-item>
            <el-button icon="search" type="primary" @click="getDataList">
              查询
            </el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()"
            v-auth="'iams_iamsRoom_add'">
            新 增
          </el-button>
          <el-button plain :disabled="multiple" icon="Delete" type="primary"
            v-auth="'iams_iamsRoom_del'" @click="handleDelete(selectObjs)">
            删除
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" :export="'iams_iamsRoom_export'"
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
          <el-table-column prop="name" label="名称"  show-overflow-tooltip/>
          <el-table-column prop="location" label="地址"  show-overflow-tooltip/>
          <el-table-column prop="manager" label="管理单位"  show-overflow-tooltip/>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button icon="edit-pen" text type="primary" v-auth="'iams_iamsRoom_edit'"
              @click="formDialogRef.openDialog(scope.row.id)">编辑</el-button>
            <el-button icon="delete" text type="primary" v-auth="'iams_iamsRoom_del'" @click="handleDelete([scope.row.id])">删除</el-button>
            <el-button icon="delete" text type="primary" v-auth="'iams_iamsRoom_view'" @click="roomDetailDialogRef.openDialog(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
    </div>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
    <room-detail-dialog ref="roomDetailDialogRef"/>
  </div>
</template>

<script setup lang="ts" name="systemIamsRoom">
import { BasicTableProps, useTable } from "/@/hooks/table";
import { fetchList, delObjs } from "/@/api/iams/iamsRoom";
import { useMessage, useMessageBox } from "/@/hooks/message";

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const RoomDetailDialog = defineAsyncComponent(() => import('./roomDetail.vue'));
// 定义查询字典

// 定义变量内容
const formDialogRef = ref()
const roomDetailDialogRef = ref()
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
  downBlobFile('/iams/iamsRoom/export',Object.assign(state.queryForm, { ids: selectObjs }), 'iamsRoom.xlsx')
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