<!--
 * @Author: 月魂
 * @Date: 2022-09-06 13:28:06
 * @LastEditTime: 2022-09-06 17:26:58
 * @LastEditors: 月魂
 * @Description: 员工管理
 * @FilePath: \player-web\src\views\employee\index.vue
-->
<template>
  <div class="container">
    <!--:inline="true" 可以让表单域变为行内的单表域,即让表单不换行,直到挤满该页面才会换行-->
    <el-form :inline="true" :model="listQuery">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="员工账号">
            <!--v-model方法是在内部为不同的输入元素使用不同的property并抛出不同的事件
            1. text和textarea袁术使用value property和input事件
            2. checkbox和radio使用 checked property和change事件
            3. select字段将 value作为prop并将 change作为事件
            -->
            <el-input v-model.trim="listQuery.username" placeholder="请输入账号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="角色名称">
            <el-select v-model="listQuery.roleId" class="filter-item" placeholder="请选择角色名称" clearable>
              <el-option label="系统管理员" :value="1" />
              <el-option label="项目经理" :value="2" />
              <el-option label="普通员工" :value="3" />
              <el-option label="审核人员" :value="4" />
            </el-select>
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
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="username" label="员工账号" />
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="realName" label="名称" />
      <el-table-column prop="mobile" label="电话" />
      <el-table-column prop="department" label="部门" />
      <el-table-column prop="job" label="岗位" />
      <el-table-column prop="enable" label="状态">
        <template slot-scope="scope">
          <div>{{ enableMap[scope.row.enable] }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="text" icon="el-icon-edit" @click="showTips(scope.row,'update')" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="重置密码" placement="top-start">
            <el-button type="text" icon="el-icon-switch-button" @click="resetPwd(scope.row)" />
          </el-tooltip>
          <el-tooltip v-if="scope.row.enable === 'N'" class="item" effect="dark" content="启用" placement="top-start">
            <el-button type="text" icon="el-icon-circle-check" @click="enableTheEmployee(scope.row)" />
          </el-tooltip>
          <el-tooltip v-else class="item" effect="dark" content="禁用" placement="top-start">
            <el-button type="text" icon="el-icon-circle-close" @click="disableTheEmployee(scope.row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="text" icon="el-icon-delete" @click="remove(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="pagination.total > 0" class="pagination" background layout="total,prev,pager,next" :total="pagination.total" :page-size.sync="listQuery.pageSize" :current-page="listQuery.pageNumber" @current-change="onPageDown" />
    <el-dialog :title="textMap[showType]" :visible.sync="visible" destroy-on-close :close-on-click-modal="false" :close-on-press-escape="false" before-close="beforeClose">
      <!--员工的新增或修改的from表单,rules为属性的验证-->
      <el-form v-show="showType === 'create' || showType === 'update'" ref="dataFrom" :rules="rules" model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="temp.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="角色" prop="code">
          <el-select v-model="temp.code" class="filter-item" placeholder="请选择角色">
            <!--v-for 指令基于一个数组来渲染一个列表,v-for指令需要使用 item in items形式的特殊语法,其中items是源数据数组,而item则是被迭代的数组元素的别名-->
            <!--:key指绑定数据 是v-bind的缩写-->
            <el-option v-for="item in roleList" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="temp.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="temp.department" placeholder="请输入所属部门" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="temp.job" placeholder="请输入所属岗位" />
        </el-form-item>
      </el-form>
      <dev slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="oncancel">
          取消
        </el-button>
        <el-button type="primary" @click="onCertain">
          确定
        </el-button>
      </dev>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, getRoleList, resetPwd, removeEmployee, enableEmployee, disableEmployee, addEmployee, updateEmployee } from '@/api/user'
import { mobileReg } from '@/utils/index'
export default {
  name: 'Employee',
  data() {
    const validateMobile = (value, callback) => {
      if (value && value !== '') {
        if (!mobileReg(value)) {
          callback(new Error('请输入正确格式的手机号'))
        }
      }
      callback()
    }
    return {
      list: [],
      visible: false,
      showType: '',
      temp: {
        id: null,
        username: '',
        roleName: '',
        realName: '',
        code: null,
        mobile: '',
        department: '',
        job: '',
        createTime: ''
      },
      enableMap: {
        Y: '启用',
        N: '禁用'
      },
      // 注入操作的员工信息
      textMap: {
        create: '新增员工',
        update: '修改员工信息'
      },
      // 定义规则,实现新增员工和修改员工的参数信息
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        code: [{ required: true, message: '请选择角色', trigger: 'change' }],
        validateMobile: [{ validator: validateMobile, trigger: 'blur' }]
      },
      pagination: {
        total: 0,
        pageSize: 10
      },
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        username: undefined
      },
      roleList: []
    }
  },
  // 分页的方法，默认每页为10条
  mounted() {
    getEmployeeList(this.listQuery).then(res => {
      // 获取员工的总数据
      this.list = res.data.records
      // 获取员工的总数据total
      this.pagination.total = res.data.total
      // 请求角色信息服务,获取角色信息
      getRoleList().then(resp => {
        this.roleList = resp.data
      })
    })
  },
  methods: {
    beforeClose(done) {
      this.resetTemp()
      done()
    },
    onSearch() {
      // 此处对列表进行条件查询，分页时也同样调用
      this.listQuery.pageNumber = 1
      getEmployeeList(this.listQuery).then(res => {
        this.list = res.data.records
        this.pagination.total = +res.data.total
      })
    },
    // 向下翻页的配置
    onPageDown(num) {
      this.listQuery.pageNumber = num
      getEmployeeList(this.listQuery).then(res => {
        this.list = res.data.records
      })
    },
    // 定义修改员工信息赋值
    showTips(data, type) {
      this.showData = data
      this.showType = type
      // eslint-disable-next-line no-empty
      if (type === 'update') {
        this.$set(this.temp, 'id', data.id)
        this.$set(this.temp, 'username', data.username)
        this.$set(this.temp, 'roleCode', data.roleCode)
        this.$set(this.temp, 'roleName', data.roleName)
        this.$set(this.temp, 'realName', data.realName)
        this.$set(this.temp, 'mobile', data.mobile)
        this.$set(this.temp, 'department', data.department)
        this.$set(this.temp, 'job', data.job)
        this.$set(this.temp, 'enable', data.enable)
        this.$set(this.temp, 'createTime', data.createTime)
        this.visible = true
      } else {
        this.visible = true
      }
    },
    // 定义确定按钮,进行新增/修改员工数据提交
    onCertain(data) {
      // 判断是否为新增或者修改
      if (this.showType === 'create') {
        // 获取表单数据，检查是否拿到了表单的数据返回布尔值并执行添加
        this.$refs['dataFrom'].validate((valid) => {
          if (valid) {
            addEmployee(this.temp).then((res) => {
              if (this.listQuery.pageSize === 1) {
                // 不进行移位
                this.list.unshift({
                  // 将data数组里的元素拆开
                  ...res.data,
                  // id进行赋值
                  id: res.data.id
                })
              } else {
                // 获取员工集合里的第一页
                this.listQuery.pageNumber = 1
                // 获取员工信息集合
                getEmployeeList(this.listQuery).then(res => {
                // 获取集合里的数据
                  this.list = res.data.records
                  // 将分页的总数据进行加1
                  this.pagination.total = +res.data.total
                })
              }
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            })
          }
        })
        // 判断是否为修改员工信息
      } else if (this.showType === 'update') {
        // 获取表单(dataFrom)数据信息,返回布尔值进行判断,修改员工信息
        this.$refs['dataFrom'].validate((valid) => {
          if (valid) {
            // 将表单数据进行复制
            const tempData = Object.assign({}, this.temp)
            // 更新该员工数据
            updateEmployee(tempData).then(res => {
              // 可见性为false
              this.visible = false
              // 获取员工id相等的下标
              const index = this.list.findIndex(x => x.id === this.temp.id)
              // 获取员工角色code相等的下标
              const roleIndex = this.roleList.findIndex(r => r.code === tempData.code)
              // 将该员工的角色code和名称给tempData进行赋值
              tempData.roleCode = this.roleList[roleIndex].code
              tempData.roleName = this.roleList[roleIndex].name
              // 根据该员工的下标进行更新数据，赋值
              this.list.splice(index, 1, tempData)
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            })
          }
        })
      }
    },
    // 定义重置密码方法
    resetPwd(data) {
      // eslint-disable-next-line no-undef
      resetPwd(data.id).then(res => {
        this.$message({
          message: '重置成功',
          type: 'success'
        })
      })
    },
    // 定义启用员工方法
    enableTheEmployee(data) {
      enableEmployee(data.id).then(res => {
        // 判断当前id与传入的id是否一致,并获取下标
        const index = this.list.findIndex(item => item.id === data.id)
        // 将原数据进行复制到指定的数组中,vue的Object.assign方法是将原数据复制到指定的数组中
        const temp = Object.assign({}, data)
        // 进行更新属性赋值
        temp.enable = 'Y'
        // 进行更新数据,vue的list.splice方法是更新指定数据,index表示更新数据的下标,1表示更新或删除,0表示增加,temp表示要更新或增加的数据
        this.list.splice(index, 1, temp)
        this.$message({
          message: '启用成功',
          type: 'success'
        })
      })
    },
    // 定义禁用员工方法
    disableTheEmployee(data) {
      disableEmployee(data.id).then(res => {
        const index = this.list.findIndex(item => item.id === data.id)
        const temp = Object.assign({}, data)
        temp.enable = 'N'
        this.list.splice(index, 1, temp)
        this.$message({
          message: '禁用成功',
          type: 'success'
        })
      })
    },
    // 定义删除员工方法
    remove(data) {
      this.$confirm('请确认删除操作', '提示', { type: 'warning' }).then(k => {
        removeEmployee(data.id).then(res => {
          this.listQuery.pageNumber = 1
          getEmployeeList(this.listQuery).then(res => {
            this.list = res.data.records
            this.pagination.total = +res.data.total
          })
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }).catch(k => {})
    },
    // 定义取消按钮
    oncancel() {
      // visible表示可见的数据
      this.visible = false
      this.resetTemp()
    },
    // 撤销后的数据
    resetTemp() {
      // vue里this.$refs[name].resetFields();方法是重置表单到初始值,fromItem绑定的属性prop与包裹元素el-input绑定值必须一致,
      // from要满足以下形式才能真正使用resetFields(), 1> From必须定义ref 属性 2> From必须绑定model 3> From的fromItem中有prop属性 4> model中绑定的属性与prop中相同
      this.$refs.dataForm.resetFields()
      this.temp = {
        id: null,
        username: '',
        roleName: '',
        realName: '',
        code: null,
        mobile: '',
        department: '',
        job: '',
        createTime: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

