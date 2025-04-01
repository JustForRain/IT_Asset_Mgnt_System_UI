<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row v-show="showSearch">
        <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
          <el-form-item label="所属机房" prop="roomName">
            <el-select v-model="state.queryForm.roomName" :remote-method="fetchRoomListHandler" allow-create clearable
                       filterable
                       placeholder="请选择所属机房" remote reserve-keyword @change="roomChangeHandler">
              <el-option v-for="item in roomList" :label="item.label" :value="item.label"/>
            </el-select>
          </el-form-item>
          <el-form-item label="微模块名称" prop="id">
            <el-select v-model="state.queryForm.id" :disabled="moduleNameLoading"
                       :remote-method="fetchModuleListHandler"
                       allow-create clearable
                       filterable placeholder="请选择微模块名称" remote reserve-keyword>
              <el-option v-for="item in moduleList" :label="item.label" :value="item.value"/>
            </el-select>
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
          <el-button v-auth="'iams_iamsModule_add'" class="ml10" icon="folder-add" type="primary"
                     @click="formDialogRef.openDialog()">
            新 增
          </el-button>
          <el-button v-auth="'iams_iamsModule_del'" :disabled="multiple" icon="Delete" plain
                     type="primary" @click="handleDelete(selectObjs)">
            删除
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" :export="'iams_iamsModule_export'"
                         class="ml10 mr20" style="float: right;" @exportExcel="exportExcel"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table v-loading="state.loading" :cell-style="tableStyle.cellStyle" :data="state.dataList"
                :header-cell-style="tableStyle.headerCellStyle" border
                @selection-change="selectionChangHandle"
                @sort-change="sortChangeHandle">
        <el-table-column align="center" type="selection" width="40"/>
        <el-table-column label="#" type="index" width="40"/>
        <el-table-column label="所属机房" prop="roomName" show-overflow-tooltip/>
        <el-table-column label="微模块名称" prop="name" show-overflow-tooltip/>
        <el-table-column label="机柜数量" prop="size" show-overflow-tooltip/>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button v-auth="'iams_iamsModule_edit'" icon="edit-pen" text type="primary"
                       @click="formDialogRef.openDialog(scope.row.id)">编辑
            </el-button>
            <el-button v-auth="'iams_iamsModule_del'" icon="delete" text type="primary"
                       @click="handleDelete([scope.row.id])">删除
            </el-button>
            <el-button v-auth="'iams_iamsModule_view'" icon="view" text type="primary"
                       @click="moduleDetailDialogRef.openDialog(scope.row.id)">查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"/>
    </div>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)"/>

    <module-detail-dialog ref="moduleDetailDialogRef"/>

  </div>
</template>

<script lang="ts" name="systemIamsModule" setup>
import {BasicTableProps, useTable} from "/@/hooks/table";
import {delObjs, fetchList, fetchList as fetchModuleList} from "/@/api/iams/iamsModule";
import {fetchList as fetchRoomList} from '/@/api/iams/iamsRoom'
import {useMessage, useMessageBox} from "/@/hooks/message";

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const ModuleDetailDialog = defineAsyncComponent(() => import('./moduleDetail.vue'));
// 定义查询字典

// 定义变量内容
const formDialogRef = ref()
const moduleDetailDialogRef = ref()
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
  downBlobFile('/iams/iamsModule/export', Object.assign(state.queryForm, {ids: selectObjs}), 'iamsModule.xlsx')
}

// 多选事件
const selectionChangHandle = (objs: { id: string }[]) => {
  selectObjs.value = objs.map(({id}) => id);
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

const loading = ref(false)
const moduleNameLoading = ref(false)
//所属机房远程搜索
const roomList = ref([])
const moduleList = ref([])

const fetchRoomListHandler = (val: string) => {
  try {
    loading.value = true;
    fetchRoomList({"name": val}).then((res) => {
      roomList.value = []
      res.data.records.forEach((item: any) => {
        roomList.value.push({
          label: item.name,
          value: item.id
        })
      })
    })
  } finally {
    loading.value = false;
  }
}

//微模块远程搜索
const fetchModuleListHandler = (val: string) => {
  try {
    loading.value = true;
    fetchModuleList({"name": val}).then((res) => {
      moduleList.value = []
      res.data.records.forEach((item: any) => {
        moduleList.value.push({
          label: item.name,
          value: item.id
        })
      })
    })
  } finally {
    loading.value = false;
  }
}

const roomChangeHandler = (roomName: string) => {
  //根据val查询微模块列表
  fetchModuleList({"roomName": roomName}).then((res) => {
    if (res.data.total > 0) {
      moduleList.value = []
      res.data.records.forEach((item: any) => {
        moduleList.value.push({
          label: item.name,
          value: item.id
        })
      })
    } else {
      moduleList.value = []
    }
  })
}

onMounted(() => {
  roomList.value = [];
  moduleList.value = [];
  fetchModuleListHandler()
  fetchRoomListHandler()
})

</script>