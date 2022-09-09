<template>
  <div class="container">
    <el-form :inline="true" :model="list">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="项目名称">
            <el-input v-model.trim="list.name" placeholder="请输入项目名称" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="onSearch"> 查询</el-button>
            <el-button @click="showTips({}, 'create')">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// import { getProjectList } from '@/api/user'

export default {
  name: 'Project',
  data() {
    return {
      list: [],
      visible: false, // visible表示可见的
      showType: '', // showType表示新增还是修改
      temp: {
        id: null,
        name: '',
        managerName: '',
        status: '',
        createTime: '',
        updatedTime: ''
      },
      textMap: {
        create: '创建项目',
        update: '修改项目'
      },
      statusMap: {
        0: '未开始',
        1: '审核中',
        2: '已结束'
      },
      pagination: {
        total: 0,
        pageSize: 10
      },
      listQuery: {
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  // 安装分页的数据与mack的数据
  mounted() {
    // 向list集合中mack数据
    this.list.push(
      { 'id': 1, 'name': '部省合作项目', 'managerName': '张三', 'status': '未开始', 'createTime': new Date(), 'updateTime': new Date() },
      { 'id': 2, 'name': '丝绸之路艺术节', 'managerName': '李四', 'status': '审核中', 'createTime': new Date(), 'updateTime': new Date() },
      { 'id': 3, 'name': '剧目展播项目', 'managerName': '赵六', 'status': '已结束', 'createTime': new Date(), 'updateTime': new Date() }
    )
  },
  // 定义按钮等方法
  methods: {
  }
}
</script>
